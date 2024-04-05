import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import axios from 'axios';

import apiConstant from 'api/api-constants';

import { UserType } from 'models/user.models';
import { AuthModel } from 'models/page.models';

export interface GetServerSidePropsContextWithContext extends GetServerSidePropsContext {
  auth: AuthModel | null;
}

type IncomingPageServerSideProp<P> = (
  ctx: GetServerSidePropsContextWithContext
) => Promise<GetServerSidePropsResult<P>>;

export default function checkAuthServerSide<T>(
  incomingGSSP: IncomingPageServerSideProp<T>,
  option?: { skipAuth?: boolean; userAllow?: UserType[]; redirectUrl?: string }
): GetServerSideProps {
  return async (context) => {
    const { token, refresh_token } = context.req.cookies;
    const { skipAuth, userAllow, redirectUrl } = option ?? {};
    let login_url = `/login?redirect=${redirectUrl ?? context.resolvedUrl}`;
    let auth: AuthModel | null = null;

    if (token && refresh_token) {
      const res = await fetch(apiConstant.me, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refresh_token }),
      });

      const { error, error_code, data: user } = await res.json();

      if (error) {
        delete axios.defaults.headers.common['Authorization'];
        context.res.setHeader('Set-Cookie', [
          'token=deleted; Max-Age=0; path=/',
          'refresh_token=deleted; Max-Age=0; path=/',
        ]);
        if (error_code) login_url += `&error_code=${error_code}`;
      } else {
        auth = { token, user };
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      }
    }

    if (!skipAuth && !auth) return { redirect: { destination: login_url, permanent: false } };
    if (auth && userAllow && !userAllow.includes(auth.user.type)) return { notFound: true };

    if (incomingGSSP) {
      const incomingGSSPResult = await incomingGSSP({ ...context, auth });

      if ('props' in incomingGSSPResult) {
        return { props: { ...incomingGSSPResult.props, auth } };
      }
      if ('redirect' in incomingGSSPResult) {
        return { redirect: { ...incomingGSSPResult.redirect } };
      }
      if ('notFound' in incomingGSSPResult) {
        return { notFound: incomingGSSPResult.notFound };
      }
    }

    return { props: { auth } };
  };
}
