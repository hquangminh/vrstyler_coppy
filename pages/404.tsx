import Head from 'next/head';

import { Flex } from 'antd';

import config from 'config';
import useLanguage from 'hooks/useLanguage';

import PageNotFound from 'components/Fragments/PageNotFound';

const Index = () => {
  const i18n = useLanguage();

  const title = '404 | ' + config.websiteName;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex align='center' justify='center' style={{ minHeight: '100vh' }}>
        <PageNotFound backToURL='/' btnText={i18n.t('btn_go_home')} />
      </Flex>
    </>
  );
};

export default Index;
