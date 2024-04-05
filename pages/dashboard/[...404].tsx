import Head from 'next/head';

import { Flex } from 'antd';

import config from 'config';
import useLanguage from 'hooks/useLanguage';
import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import PageNotFound from 'components/Fragments/PageNotFound';

import { PageProps } from 'models/page.models';

const Index = () => {
  const i18n = useLanguage();
  const title = `404 | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex align='center' justify='center' style={{ minHeight: '100vh' }}>
        <PageNotFound backToURL='/dashboard' btnText={i18n.t('btn_go_dashboard')} />
      </Flex>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(async (content) => {
  let props: PageProps = { language: await DetectLanguage(content) };

  return { props };
});

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
