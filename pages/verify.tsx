import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import { message } from 'lib/utils/message';
import userServices from 'services/user-services';

import LoadingPage from 'components/Fragments/LoadingPage';
import NotVerify from 'components/Pages/Verify/NotVerify';
import SentVerifySucceeded from 'components/Pages/Verify/SentVerifySucceeded';
import VerifySucceeded from 'components/Pages/Verify/VerifySucceeded';
import VerifyError from 'components/Pages/Verify/VerifyError';

import { PageProps } from 'models/page.models';

const Index = (props: PageProps) => {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [status, setStatus] = useState<'not_verify' | 'verified' | 'sent_mail' | 'error'>();

  const onConfirmRegister = useCallback(async () => {
    try {
      const confirmToken =
        typeof router.query.token === 'string' ? router.query.token.replace(/\s+/g, '+') : '';
      const { error } = await userServices.confirmRegister({ token: confirmToken });
      setStatus(error ? 'error' : 'verified');
      setIsChecking(false);
    } catch (error) {
      message.destroy();
      setIsChecking(false);
      setStatus('error');
    }
  }, [router.query.token]);

  useEffect(() => {
    if (router.query.token) onConfirmRegister();
    else setStatus('not_verify');
  }, [onConfirmRegister, router.query.token]);

  if (isChecking && !status) return <LoadingPage />;

  const title = `Verify Account | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {status === 'not_verify' && <NotVerify onSuccess={() => setStatus('sent_mail')} />}
      {status === 'sent_mail' && (
        <SentVerifySucceeded customerEmail={props.auth?.user?.email ?? ''} />
      )}
      {status === 'verified' && <VerifySucceeded />}
      {status === 'error' && <VerifyError onReVerify={() => setStatus('not_verify')} />}
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(async (content) => {
  if (content.auth?.user.status) return { redirect: { permanent: false, destination: '/' } };

  let language = await DetectLanguage(content);
  return { props: { language } };
});

export default withLanguage(withLayout(Index, { footer: { show: false } }));
