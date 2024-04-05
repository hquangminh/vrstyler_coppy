import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import { message } from 'lib/utils/message';
import userServices from 'services/user-services';

import urlPage from 'constants/url.constant';
import LoadingPage from 'components/Fragments/LoadingPage';

import { PageProps } from 'models/page.models';
import { UserType } from 'models/user.models';

import styled from 'styled-components';
import { Container } from 'styles/__styles';

const Index = (props: PageProps) => {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const onConfirmChangeEmail = async () => {
      try {
        if (props.auth && router.query.token) {
          await userServices.confirmChangeEmail(router.query.token.toString().replace(/\s+/g, '+'));
          message.success('Your email address has been changed');
          if (props.auth?.user.type === UserType.SHOWROOM)
            router.push(props.auth ? `${urlPage.dashboard}/setting?key=email` : '/login');
          else router.push(props.auth ? urlPage.my_settings_email : '/login');
        } else throw new Error('Auth or Token not found');
      } catch (error) {
        message.destroy();
        setIsChecking(false);
        setError(true);
      }
    };

    onConfirmChangeEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isChecking) return <LoadingPage />;

  const title = `Confirm Change Email | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {!isChecking && error && (
        <LinkError>
          <Container>
            <p>
              The link is incorrect or has expired.{' '}
              {props.auth?.user?.nickname && (
                <>
                  If you want to change your email address, please click{' '}
                  <Link
                    href={
                      props.auth?.user.type === UserType.SHOWROOM
                        ? `${urlPage.dashboard}/setting?key=email`
                        : urlPage.my_settings_email
                    }>
                    here
                  </Link>
                  .
                </>
              )}
            </p>
          </Container>
        </LinkError>
      )}
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(async (content) => {
  const language = await DetectLanguage(content);
  return { props: { language } };
});

export default withLanguage(withLayout(Index, { footer: { show: false } }));

const LinkError = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
`;
