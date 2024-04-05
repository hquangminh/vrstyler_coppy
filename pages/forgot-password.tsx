import Head from 'next/head';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import { LinkHrefLang, MetaFacebook, MetaTwitter } from 'components/Head';
import ForgotPwPage from 'components/Pages/ForgotPassword';

import { PageProps } from 'models/page.models';

const Home = (props: PageProps) => {
  const { asPath } = useRouter();

  const title = `${props.seo ? props.seo.title : 'Forgot Password'} | ${config.websiteName}`;
  const description = props.seo?.descriptions ?? '';
  const imageMeta: string = props.seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <MetaFacebook title={title} description={description} image={imageMeta} />
        <MetaTwitter title={title} description={description} image={imageMeta} />
        <link rel='canonical' href={config.urlRoot + '/forgot-password'} />
        <LinkHrefLang asPath={asPath} />
      </Head>

      <ForgotPwPage />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    if (content.auth) return { redirect: { destination: '/', permanent: false } };

    let props: PageProps = { language: await DetectLanguage(content) };

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Home, { footer: { show: false } }));
