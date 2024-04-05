import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import { PageProps } from 'models/page.models';

import urlPage from 'constants/url.constant';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(urlPage.saleOff.replace('{category}', 'all'));
  }, [router]);

  const title = `Sale Off 50% | ${config.websiteName}`;

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = { language: await DetectLanguage(content) };
    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
