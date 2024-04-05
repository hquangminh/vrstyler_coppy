import Head from 'next/head';
import Link from 'next/link';

import { Button, Result } from 'antd';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import useLanguage from 'hooks/useLanguage';
import productServices from 'services/product-services';

import ProductDetail from 'components/Pages/ProductDetail';

import { ProductModel } from 'models/product.model';
import { PageProps } from 'models/page.models';
import sellerServices from 'services/seller-services';

type Props = PageProps & { data?: ProductModel };

const Index = (props: Props) => {
  const { data, auth } = props;
  const i18n = useLanguage();

  if (!data)
    return (
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
    );

  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <ProductDetail data={data} auth={auth ?? undefined} isPreview={true} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(async (context) => {
  let props: Props = { language: await DetectLanguage(context) };
  try {
    const productId: string = context.query.productId?.toString() ?? '';
    await sellerServices
      .productDetail(productId, context.req.cookies.token)
      .then(({ data }) => (props.data = data));
  } catch {}
  return { props };
});

export default withLanguage(withLayout(Index));
