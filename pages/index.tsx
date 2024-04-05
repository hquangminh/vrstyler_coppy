import { useRouter } from 'next/router';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';
import { tagLinkHrefLang } from 'lib/helpers/metaSeo';

import config from 'config';
import commonServices from 'services/common-services';
import homepageServices from 'services/homepage-services';

import Market from 'components/Pages/Market';

import { PageProps } from 'models/page.models';
import { DataHomePage } from 'models/homepage.models';

type Props = PageProps & { data: DataHomePage };

const Home = (props: Props) => {
  const { asPath } = useRouter();

  const title = `${props.seo?.title ?? ''} | ${config.websiteName}`;
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
        <meta property='og:url' content={config.urlRoot} />
        <meta property='og:image' content={imageMeta} />
        <meta property='keywords' content={props.seo?.keywords} />

        {/* Twitter */}
        <meta property='twitter:card' content='VRStyler_Homepage' />
        <meta property='twitter:site' content={config.urlRoot} />
        <meta property='twitter:title' content={props.seo?.title} />
        <meta property='twitter:description' content={props.seo?.descriptions} />
        <meta property='twitter:image' content={imageMeta} />

        <link rel='image_src' href={imageMeta} />
        <link rel='canonical' href={config.urlRoot} />

        {tagLinkHrefLang(asPath)}
      </Head>

      <Market data={props.data} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: { data?: any } & PageProps = { language: await DetectLanguage(content) };

    await Promise.all([
      commonServices.seoPage('index', props.language?.langCode),
      homepageServices.getData(props.language?.langCode),
    ]).then(([seo, homepage]) => {
      props = { ...props, seo: seo.data, data: homepage.data };
    });

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Home));
