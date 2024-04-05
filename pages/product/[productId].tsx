import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { Button, Result } from 'antd';

import config from 'config';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import useLanguage from 'hooks/useLanguage';
import useRouterChange from 'hooks/useRouterChange';

import commonServices from 'services/common-services';
import productServices from 'services/product-services';

import ProductDetail from 'components/Pages/ProductDetail';

import { ProductModel } from 'models/product.model';
import { PageProps } from 'models/page.models';

type Props = { data?: ProductModel } & PageProps;

const Index = (props: Props) => {
  const { data, seo, auth } = props;
  const router = useRouter();
  const i18n = useLanguage();

  const [loading, setLoading] = useState<boolean>(false);

  useRouterChange(
    (path) => {
      const pathLength = 1 - router.asPath.split('/').length;
      const newPath = '/' + path.split('/').slice(pathLength).join('/');
      if (newPath.startsWith('/product') && newPath !== router.asPath) setLoading(true);
    },
    () => setLoading(false)
  );

  if (loading) return <div style={{ minHeight: '100vh' }} />;
  else if (!data) {
    const title = `${i18n.t('product_detail_not_found_title')} | ${config.websiteName}`;
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>

        <Result
          status='404'
          title='Oops!'
          subTitle={i18n.t('product_detail_not_found_description')}
          extra={
            <Button type='primary'>
              <Link href='/'>{i18n.t('btn_go_home')}</Link>
            </Button>
          }
        />
      </>
    );
  }

  const title = `${seo?.title.replace(/{{name}}/g, data?.title) ?? data.title} | ${
    config.websiteName
  }`;
  const descriptions = seo?.descriptions.replace(/{{name}}/g, data?.title);
  const keywords = seo?.keywords?.replace(/{{name}}/g, data?.title);
  const thumbnail = data?.image ?? seo?.image ?? config.urlRoot + '/static/thumbnail.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={data?.seo_description ?? descriptions} />

        {/* Facebook Open Graph */}
        <meta property='og:title' content={data?.seo_title ?? title} />
        <meta property='og:description' content={data?.seo_description ?? descriptions} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={config.urlRoot + router.asPath} />
        <meta property='og:image' content={thumbnail} />
        <meta property='keywords' content={keywords} />

        {/* Twitter */}
        <meta property='twitter:card' content='summary' />
        <meta property='twitter:site' content={config.urlRoot + router.asPath} />
        <meta property='twitter:title' content={data?.seo_title ?? title} />
        <meta property='twitter:description' content={data?.seo_description ?? descriptions} />
        <meta property='twitter:image' content={thumbnail} />

        <link rel='image_src' href={thumbnail} />
        <link rel='canonical' href={config.urlRoot + router.asPath} />
      </Head>

      <ProductDetail data={data} auth={auth ?? undefined} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (context) => {
    let props: Props = { language: await DetectLanguage(context) };
    try {
      const productId: string = context.query.productId?.toString().split('--')[1] ?? '';
      const fetchSeo = commonServices.seoPage('product', props.language?.langCode);
      const fetchProduct = productServices.getProductDetail(productId, context.req.cookies.token);
      await Promise.all([fetchSeo, fetchProduct]).then(([{ data: seo }, { data: product }]) => {
        props.seo = seo || null;
        props.data = product || null;
      });
    } catch {}
    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
