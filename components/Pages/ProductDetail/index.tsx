import Link from 'next/link';

import { Breadcrumb } from 'antd';

import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';

import ProductDetailTitle from './Fragments/Title';
import ProductDetailInspect from './Fragments/Inspect';
import ProductDetailContent from './Fragments/Content';
import ProductDetailHeader from './Fragments/Header';
import ProductViewer from './Viewer';
import ReviewComment from './ReviewComment';
import Suggested from './Suggested';

import { ProductModel } from 'models/product.model';
import { CategoryModel } from 'models/category.models';
import { AuthModel } from 'models/page.models';

import { ContainerLarge } from 'styles/__styles';
import * as L from './style';

type Props = {
  data: ProductModel;
  auth?: AuthModel;
  isPreview?: boolean;
};

const ProductDetail = ({ data, auth, isPreview }: Props) => {
  const { langLabel } = useLanguage();

  const isFree = (data.price === 0 || data.price === null) && data.status === 1;
  const categoryOne: CategoryModel | undefined = data.market_item_categories?.length
    ? data.market_item_categories[0].market_category
    : undefined;

  return (
    <L.ProductDetail_wrapper>
      <ContainerLarge>
        <Breadcrumb
          className='my-breadcrumb'
          separator='>'
          items={[
            {
              title: (
                <Link href={urlPage[isFree ? 'freeModels' : 'explore'].replace('{category', 'all')}>
                  {langLabel.header_menu_explore}
                </Link>
              ),
            },
            { title: data.title },
          ]}
        />

        <L.Grid_wrapper>
          <ProductViewer data={data} />
          <ProductDetailHeader auth={auth} data={data} isFree={isFree} isPreview={isPreview} />
          <ProductDetailTitle data={data} isPreview={isPreview} />
          <ProductDetailContent data={data} isPreview={isPreview} />
          <ProductDetailInspect data={data} />
        </L.Grid_wrapper>

        {!isPreview && (
          <ReviewComment
            isReview={!isFree}
            averageReview={data.avgReview}
            totalReview={data.totalReview}
            totalComment={data.totalComment}
            productId={data.id}
            auth={auth}
          />
        )}

        {categoryOne && !isPreview && (
          <Suggested
            productId={data.id}
            categories_id={data.market_item_categories?.map((i) => i.market_category.id) ?? []}
            categoryName={categoryOne?.title}
          />
        )}
      </ContainerLarge>
    </L.ProductDetail_wrapper>
  );
};

export default ProductDetail;
