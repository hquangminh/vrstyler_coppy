import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';

import { changeToSlug } from 'common/functions';

import urlPage from 'constants/url.constant';

import productServices from 'services/product-services';

import ProductCard from 'components/Fragments/ProductCard';
import DividerMain from 'components/Fragments/DividerMain';
import ProductSkeleton from 'components/Pages/Explore/Fragments/Skeleton';

import { ProductModel } from 'models/product.model';

import * as L from './style';

type Props = {
  productId: string;
  categories_id: string[];
  categoryName: string;
};

const Suggested = memo(function Suggested({ productId, categories_id, categoryName }: Props) {
  const { langLabel } = useLanguage();
  const { width: screenW } = useWindowSize();

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestLists, setSuggestLists] = useState<{ total: number; data: ProductModel[] }>({
    total: 0,
    data: [],
  });

  const productID = useMemo(() => productId, [productId]);
  const pageSize = useMemo(() => {
    if (screenW) {
      if (screenW > 1920) return 10;
      else if (screenW > 1440) return 8;
      else return 6;
    } else return 0;
  }, [screenW]);

  const getProductRelated = useCallback(
    async (signal: AbortSignal) => {
      if (pageSize) {
        try {
          setLoading(true);
          const { total, data } = await productServices.getProductRelated(
            productID,
            categories_id,
            pageSize,
            { signal }
          );
          setSuggestLists({ total, data });
          setLoading(false);
        } catch (error) {}
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize, productID]
  );

  useEffect(() => {
    const controller = new AbortController();
    getProductRelated(controller.signal);
    return () => controller.abort();
  }, [getProductRelated]);

  return (
    <>
      <DividerMain />
      <L.Suggested_wrapper>
        <h3 className='title'>{langLabel.product_similar_model}</h3>

        {loading && <ProductSkeleton length={pageSize / 2} />}
        <L.Grid_wrapper className='ProductList__Grid'>
          {suggestLists.data?.map((item) => (
            <ProductCard key={item.id} className='product__card--item' data={item} />
          ))}
        </L.Grid_wrapper>

        {suggestLists.total > pageSize && (
          <Button className='btn__load' type='primary'>
            <Link
              href={urlPage.explore.replace(
                '{category}',
                changeToSlug(categoryName) + '--' + categories_id[0]
              )}>
              {langLabel.btn_see_all || 'See All'}
            </Link>
          </Button>
        )}
      </L.Suggested_wrapper>
    </>
  );
});

export default Suggested;
