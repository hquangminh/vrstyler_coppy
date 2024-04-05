import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Button } from 'antd';

import config from 'config';
import authServices from 'services/auth-services';

import Icon from 'components/Fragments/Icons';
import LoadingPage from './LoadingPage';

type Props = {
  onSuccess: (data: any) => void;
};

const LoginWithSNS = (props: Props) => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const onLogin = useCallback(
    async (sns: string, access_token: string, redirect?: string) => {
      setIsLogin(true);
      await authServices
        .oAuth({ sns, access_token })
        .then(({ data }) => props.onSuccess(data))
        .catch(() => {
          setIsLogin(false);
          router.replace(router.pathname + (redirect ? '?redirect=' + redirect : ''));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const oAuthResponse: Record<string, string> = decodeURI(router.asPath)
      .split('#')[1]
      ?.split('&')
      .reduce((obj, i) => Object.assign(obj, { [i.split('=')[0]]: i.split('=')[1] }), {});

    if (oAuthResponse && Object.keys(oAuthResponse).length > 0 && oAuthResponse.state) {
      const state: Record<string, string> = decodeURIComponent(oAuthResponse.state)
        .slice(1, -1)
        .split(',')
        .reduce((obj, i) => Object.assign(obj, { [i.split('=')[0]]: i.split('=')[1] }), {});

      if (state.sns && oAuthResponse.access_token)
        onLogin(state.sns, oAuthResponse.access_token, state.redirect);
    }
  }, [onLogin, router]);

  return (
    <LoginWithSNS_Wrapper>
      {isLogin && <LoadingPage blur />}

      <p className='or_social'>OR</p>

      <div className='login_with'>
        <Button
          onClick={() =>
            window.open(
              'https://accounts.google.com/o/oauth2/v2/auth?' +
                `scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&` +
                `client_id=${config.googleClientId}&` +
                `response_type=token&` +
                `redirect_uri=${location.href.split('?')[0]}&` +
                `state={sns=google,redirect=${location.href.split('?')[1] || ''}}`,
              '_self'
            )
          }>
          <Icon iconName='google-color' />
        </Button>

        <Button
          onClick={() =>
            (location.href =
              'https://www.facebook.com/v14.0/dialog/oauth' +
              '?client_id=577772940724693' +
              '&response_type=token' +
              '&scope=email%20public_profile' +
              `&redirect_uri=${location.href.split('?')[0]}` +
              `&state={sns=facebook,redirect=${location.href.split('?')[1] || ''}}`)
          }>
          <Icon iconName='facebook-color' />
        </Button>
      </div>
    </LoginWithSNS_Wrapper>
  );
};

export default LoginWithSNS;

const LoginWithSNS_Wrapper = styled.div`
  .or_social {
    margin: 1.7rem 0 1.9rem;
    font-size: 14px;
    line-height: 1.57;
    color: var(--color-gray-7);
    text-align: center;
  }

  .login_with {
    display: flex;
    justify-content: center;
    gap: 0.8rem;

    .ant-btn {
      width: 105px;
      height: 56px;

      border: none;
      background-color: var(--color-main-1);

      .my-icon {
        font-size: 26px;
      }
    }
  }
`;
