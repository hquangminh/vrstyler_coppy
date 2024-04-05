import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';

type Props = {
  title: string;
  descriptions: string;
  image?: string;
  keywords?: string;
  twitter_card?: string;
};

const HeadSeo = ({ title, descriptions, image, keywords, twitter_card }: Props) => {
  const router = useRouter();

  const titleSEO = `${title} | ${config.websiteName}`;

  return (
    <Head>
      <title>{titleSEO}</title>

      <meta name='description' content={descriptions} key='desc' />

      {/* Facebook Open Graph */}
      <meta property='fb:app_id' content={config.facebookAppId} />
      <meta property='og:title' content={titleSEO} />
      <meta property='og:description' content={descriptions} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={config.urlRoot + router.asPath} />
      <meta property='og:image' content={image || config.urlRoot + '/static/thumbnail.jpg'} />
      <meta property='keywords' content={keywords} />

      {/* Twitter */}
      <meta property='twitter:card' content={twitter_card} />
      <meta property='twitter:site' content={config.urlRoot + router.asPath} />
      <meta property='twitter:title' content={titleSEO} />
      <meta property='twitter:description' content={descriptions} />
      <meta property='twitter:image' content={image || config.urlRoot + '/static/thumbnail.jpg'} />

      <link rel='image_src' href={image || config.urlRoot + '/static/thumbnail.jpg'} />
      <link rel='canonical' href={config.urlRoot + router.asPath} />
    </Head>
  );
};

export default HeadSeo;
