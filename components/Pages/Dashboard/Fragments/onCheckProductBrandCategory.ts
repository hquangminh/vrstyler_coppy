import { changeToSlug } from 'common/functions';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import urlPage from 'constants/url.constant';
import { ProductModel } from 'models/product.model';

const onCheckProductBrandCategory = (data: ProductModel) => {
  const activeCategory =
    isArrayEmpty(data.market_item_categories) ||
    data.market_item_categories?.some((e) => e.market_category.status);

  const activeBrand = !data.market_brand || data.market_brand.status;

  const link =
    activeCategory && activeBrand && data.status === 1
      ? urlPage.productDetail.replace('{slug}', changeToSlug(data.title) + '--' + data.id)
      : urlPage.productPreviewDetail.replace('{slug}', data.id);
  return { activeCategory, activeBrand, link };
};

export default onCheckProductBrandCategory;
