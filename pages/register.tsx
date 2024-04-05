import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';
import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';
import commonServices from 'services/common-services';

import { LinkHrefLang, MetaFacebook, MetaTwitter } from 'components/Head';
import RegisterPage from 'components/Pages/Register';

import { PageProps } from 'models/page.models';

const Home = (props: PageProps) => {
  const { asPath } = useRouter();

  const title = `${props.seo ? props.seo.title : 'Register'} | ${config.websiteName}`;
  const description = props.seo?.descriptions ?? '';
  const imageMeta: string = props.seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <MetaFacebook title={title} description={description} image={imageMeta} />
        <MetaTwitter title={title} description={description} image={imageMeta} />
        <link rel='canonical' href={config.urlRoot + '/register'} />
        <LinkHrefLang asPath={asPath} />
      </Head>

      <RegisterPage />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    if (content.auth) return { redirect: { permanent: false, destination: '/' } };

    let props: { data?: any } & PageProps = {};

    await Promise.all([
      DetectLanguage(content),
      commonServices.seoPage('register', content.locale),
    ]).then(([language, seo]) => {
      props = { language, seo: seo.data };
    });

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Home, { footer: { show: false } }));
