import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import styled from 'styled-components';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import useLanguage from 'hooks/useLanguage';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import { message } from 'lib/utils/message';
import userServices from 'services/user-services';

import ResetPwPage from 'components/Pages/ResetPassword';
import LoadingPage from 'components/Fragments/LoadingPage';

import { PageProps } from 'models/page.models';

import { Container } from 'styles/__styles';

const Home = (props: PageProps) => {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<'link_error' | 'expired'>();
  const { langLabel } = useLanguage();

  const onCheckToken = useCallback(async () => {
    const email = router.query.email?.toString().replace(/\s+/g, '+');
    const token = router.query.token?.toString().replace(/\s+/g, '+');

    if (!email || !token || (props.auth && email && props.auth.user.email !== email))
      setError('link_error');
    else
      await userServices
        .checkTokenResetPw(email, token)
        .catch(() => {
          message.destroy();
          setError('expired');
        })
        .finally(() => setIsChecking(false));
  }, [props.auth, router.query.email, router.query.token]);

  useEffect(() => {
    onCheckToken();
  }, [onCheckToken]);

  if (isChecking && !error) return <LoadingPage />;
  if (error)
    return (
      <LinkErrorWrapper>
        <Container>
          {error === 'link_error' && (
            <p dangerouslySetInnerHTML={{ __html: langLabel.reset_password_link_incorrect }} />
          )}
          {error === 'expired' && (
            <p dangerouslySetInnerHTML={{ __html: langLabel.reset_password_link_expired }} />
          )}
        </Container>
      </LinkErrorWrapper>
    );

  const title = `Reset Password | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel='canonical' href={config.urlRoot + '/reset-password'} />
      </Head>

      {typeof router.query.email === 'string' && typeof router.query.token === 'string' && (
        <ResetPwPage
          email={router.query.email.replace(/\s+/g, '+')}
          token={router.query.token.replace(/\s+/g, '+')}
        />
      )}
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const language = await DetectLanguage(content);
    return { props: { language } };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Home, { footer: { show: false } }));

//Style
const LinkErrorWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
`;
