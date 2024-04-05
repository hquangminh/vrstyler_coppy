import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import { DetectLanguage } from 'lib/utils/language';

import commonServices from 'services/common-services';

import HeaderSample from 'components/Layout/HeaderSample';
import FooterSample from 'components/Layout/FooterSample';
import HelpCenterComponent from 'components/Pages/HelpCenter';

import { PageProps } from 'models/page.models';
import { HelpCategory } from 'models/help.models';

type Props = PageProps & {};

const Index = (props: Props) => {
  const router = useRouter();

  const title = `${props.seo?.title || 'Help Center'} | ${config.websiteName}`;
  const imageMeta: string = props.seo?.image || config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={props.seo?.descriptions} />

        {/* Facebook Open Graph */}
        <meta property='og:title' content={props.seo?.title} />
        <meta property='og:description' content={props.seo?.descriptions} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={config.urlRoot + router.asPath} />
        <meta property='og:image' content={imageMeta} />
        <meta property='keywords' content={props.seo?.keywords} />

        {/* Twitter */}
        <meta property='twitter:card' content='VRStyler_HelpCenter' />
        <meta property='twitter:site' content={config.urlRoot + router.asPath} />
        <meta property='twitter:title' content={props.seo?.title} />
        <meta property='twitter:description' content={props.seo?.descriptions} />
        <meta property='twitter:image' content={imageMeta} />

        <link rel='image_src' href={imageMeta} />
        <link rel='canonical' href={config.urlRoot + router.asPath} />
      </Head>

      <HeaderSample style={{ padding: '18px 0' }} title={'help'} />
      <HelpCenterComponent />
      <FooterSample blog={false} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (content) => {
  let props: { helpCollection?: HelpCategory[] } & PageProps = {
    language: await DetectLanguage(content),
  };

  await commonServices
    .seoPage('help-center', props.language?.langCode)
    .then((res) => (props.seo = res.data || null))
    .catch((err) => console.error(err));

  return { props };
};

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
