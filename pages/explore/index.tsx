import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import commonServices from 'services/common-services';

import { PageProps } from 'models/page.models';

type Props = PageProps & {
  data: any;
};

const Index = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/explore/all');
  }, [router]);

  const title = `${props.seo?.title} | ${config.websiteName}`;

  return (
    <Head>
      <title>{title}</title>

      <meta name='description' content={props.seo?.descriptions} />

      {/* Facebook Open Graph */}
      <meta property='og:title' content={props.seo?.title} />
      <meta property='og:description' content={props.seo?.descriptions} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={config.urlRoot + router.asPath} />
      <meta property='og:image' content={props.seo?.image} />
      <meta property='keywords' content={props.seo?.keywords} />

      {/* Twitter */}
      <meta property='twitter:card' content='VRStyler_Explore' />
      <meta property='twitter:site' content={config.urlRoot + router.asPath} />
      <meta property='twitter:title' content={props.seo?.title} />
      <meta property='twitter:description' content={props.seo?.descriptions} />
      <meta property='twitter:image' content={props.seo?.image} />

      <link rel='image_src' href={props.seo?.image} />
      <link rel='canonical' href={config.urlRoot + router.asPath} />
    </Head>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = { language: await DetectLanguage(content) };
    props.seo = await commonServices.seoPage('explore', props.language?.langCode);
    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
