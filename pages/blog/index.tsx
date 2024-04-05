import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import commonServices from 'services/common-services';

import { PageProps } from 'models/page.models';

const Index = (props: PageProps) => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/blog/all');
  }, [router]);

  const title = `${props.seo?.title ?? 'Blog'} | ${config.websiteName}`;
  const imageMeta: string = props.seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

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
      <main />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: { data?: any } & PageProps = {};

    await Promise.all([
      DetectLanguage(content),
      commonServices.seoPage('blogs', content.locale),
    ]).then(([language, seo]) => {
      props = { language, seo: seo.data };
    });

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
