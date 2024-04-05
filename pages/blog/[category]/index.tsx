import { useRouter } from 'next/router';
import Head from 'next/head';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import urlPage from 'constants/url.constant';
import commonServices from 'services/common-services';
import blogServices from 'services/blog-services';

import BlogComponent from 'components/Pages/Blog';

import { PageProps } from 'models/page.models';
import { BlogCategory } from 'models/blog.models';

type Props = PageProps & { category?: BlogCategory[] };

const Index = (props: Props) => {
  const router = useRouter();

  const title = `${props.seo?.title ?? 'Blog'} | ${config.websiteName}`;
  const imageMeta: string = (props.seo?.image ?? config.urlRoot) + '/static/thumbnail.jpg';

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

      <BlogComponent langCode={props.language?.langCode} category={props.category ?? []} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: Props = { language: await DetectLanguage(content) };

    const fetchSeo = commonServices.seoPage('blogs', props.language?.langCode);
    const fetchCategory = await blogServices.getAllCategoryBlog();

    await Promise.all([fetchSeo, fetchCategory]).then(([{ data: seo }, { data: category }]) => {
      props.seo = seo;
      props.category = category;
    });

    const categoryID = content.query.category?.toString().split('--')[1] ?? content.query.category;
    if (props.category && categoryID !== 'all' && !props.category.some((i) => i.id === categoryID))
      return { redirect: { destination: urlPage.blog, permanent: false } };

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
