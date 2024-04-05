import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import Notification from 'components/Pages/Notification';

import { PageProps } from 'models/page.models';

const Index = () => {
  const title = `Notification | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Notification />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(async (content) => {
  let props: { data?: any } & PageProps = { language: await DetectLanguage(content) };
  return { props };
});

export default withLanguage(withLayout(Index));
