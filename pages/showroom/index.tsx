import { useRouter } from 'next/router';
import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import showroomServices from 'services/showroom-services';

import ShowroomTop from 'components/Pages/Showroom';

import { PageProps } from 'models/page.models';
import { ListShowroom } from 'models/showroom.models';

type Props = PageProps & { showroom: ListShowroom };

const Index = (props: Props) => {
  const { asPath } = useRouter();

  const title = `${props.seo?.title ?? 'Top Showroom'} | ${config.websiteName}`;
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
        <meta property='og:url' content={config.urlRoot + asPath} />
        <meta property='og:image' content={imageMeta} />
        <meta property='keywords' content={props.seo?.keywords} />

        {/* Twitter */}
        <meta property='twitter:card' content='VRStyler_HelpCenter' />
        <meta property='twitter:site' content={config.urlRoot + asPath} />
        <meta property='twitter:title' content={props.seo?.title} />
        <meta property='twitter:description' content={props.seo?.descriptions} />
        <meta property='twitter:image' content={imageMeta} />

        <link rel='image_src' href={imageMeta} />
        <link rel='canonical' href={config.urlRoot + asPath} />
      </Head>

      <ShowroomTop showroom={props.showroom} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const props: Props = await Promise.all([
      DetectLanguage(content),
      showroomServices.listTopShowroom(),
    ]).then(([language, { data: showroom }]) => ({ language, showroom }));
    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
