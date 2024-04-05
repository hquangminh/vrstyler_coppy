import Head from 'next/head';
import { useRouter } from 'next/router';

import config from 'config';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import blogServices from 'services/blog-services';

import BlogDetailComponent from 'components/Pages/BlogDetail';

import { PageProps } from 'models/page.models';
import { BlogModel } from 'models/blog.models';

type Props = PageProps & {
  data: BlogModel;
};

const Index = (props: Props) => {
  const { data } = props;

  const router = useRouter();

  const dataBlog = data.market_blog_languages[0];
  const title = `${dataBlog.title} - Blog | ${config.websiteName}`;
  const imageMeta: string = data.image || config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={dataBlog.seo_description ?? dataBlog.sumary} />

        {/* Facebook Open Graph */}
        <meta property='og:title' content={dataBlog.seo_title ?? dataBlog.title} />
        <meta property='og:description' content={dataBlog.seo_description ?? dataBlog.sumary} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={config.urlRoot + router.asPath} />
        <meta property='og:image' content={imageMeta} />

        {/* Twitter */}
        <meta property='twitter:card' content='summary' />
        <meta property='twitter:site' content={config.urlRoot + router.asPath} />
        <meta property='twitter:title' content={dataBlog.seo_title ?? dataBlog.title} />
        <meta
          property='twitter:description'
          content={dataBlog?.seo_description ?? dataBlog.sumary}
        />
        <meta property='twitter:image' content={data.image} />

        <link rel='image_src' href={data.image} />
        <link rel='canonical' href={config.urlRoot + router.asPath} />
      </Head>

      <BlogDetailComponent data={data} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: { data?: BlogModel; blogId?: string } & PageProps = {};

    props.language = await DetectLanguage(content);

    const blogId: string = content.query.blogId?.toString() ?? '';
    await blogServices
      .getDetail(props.language.langCode, blogId, { headers: { Authorization: '' } })
      .then(({ data }) => {
        if (data) props.data = data;
      });
    if (!props.data) return { notFound: true };

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
