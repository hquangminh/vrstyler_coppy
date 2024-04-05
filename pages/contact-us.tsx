import Head from 'next/head';
import { useRouter } from 'next/router';

import config from 'config';
import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import { DetectLanguage } from 'lib/utils/language';

import commonServices from 'services/common-services';

import { LinkHrefLang, MetaFacebook, MetaTwitter } from 'components/Head';
import ContactUs from 'components/Pages/ContactUs';

import { PageProps } from 'models/page.models';
import checkAuthServerSide from 'lib/checkAuthServerSide';

const Index = (props: PageProps) => {
  const { asPath } = useRouter();

  const title = `${props.seo ? props.seo.title : 'Contact Us'} | ${config.websiteName}`;
  const description = props.seo?.descriptions ?? '';
  const imageMeta: string = props.seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <MetaFacebook title={title} description={description} image={imageMeta} />
        <MetaTwitter title={title} description={description} image={imageMeta} />
        <link rel='canonical' href={config.urlRoot + '/contact-us'} />
        <LinkHrefLang asPath={asPath} />
      </Head>

      <ContactUs />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = {};
    await Promise.all([
      DetectLanguage(content),
      commonServices.seoPage('contact-us', content.locale),
    ]).then(([language, { data: seo }]) => (props = { language, seo }));

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index, { footer: { show: false } }));
