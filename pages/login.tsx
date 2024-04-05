import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';
import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import { DetectLanguage } from 'lib/utils/language';

import { LinkHrefLang, MetaFacebook, MetaTwitter } from 'components/Head';
import LoginPage from 'components/Pages/Login';

import { PageProps } from 'models/page.models';
import checkAuthServerSide from 'lib/checkAuthServerSide';

const Index = (props: PageProps) => {
  const { asPath } = useRouter();

  const title = `${props.seo ? props.seo.title : 'Login'} | ${config.websiteName}`;
  const description = props.seo?.descriptions ?? '';
  const imageMeta: string = props.seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <MetaFacebook title={title} description={description} image={imageMeta} />
        <MetaTwitter title={title} description={description} image={imageMeta} />
        <link rel='canonical' href={config.urlRoot + '/login'} />
        <LinkHrefLang asPath={asPath} />
      </Head>

      <LoginPage />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    if (content.auth)
      return {
        redirect: {
          permanent: false,
          destination: content.query.redirect?.toString() ?? '/',
        },
      };

    let props: PageProps = { language: await DetectLanguage(content) };

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index, { footer: { show: false } }));
