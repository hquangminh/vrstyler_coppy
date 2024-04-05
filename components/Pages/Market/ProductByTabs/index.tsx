import { useCallback, useEffect, useMemo, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import Link from 'next/link';

import { Button, Spin } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useDebounce from 'hooks/useDebounce';
import urlPage from 'constants/url.constant';
import productServices, { BodyFilterProductModel } from 'services/product-services';

import HeaderSection from '../Fragments/HeaderSection';
import ProductCard from 'components/Fragments/ProductCard';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import { ProductModel } from 'models/product.model';

import { ContainerFreeSize } from 'styles/__styles';
import * as L from './style';

const ProductByTabs = () => {
  const { width: screenW } = useWindowSize();
  const { langLabel } = useLanguage();

  const [tab, setTab] = useState<'newest' | 'popular' | 'best-selling' | 'sale-50'>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductModel[]>();

  const itemOfPage = useMemo(() => {
    if (screenW) {
      if (screenW > 1920) return 20;
      else if (screenW > 1440) return 16;
      else return 9;
    } else return 0;
  }, [screenW]);
  const itemOfPageDebounce = useDebounce(itemOfPage, 1000);

  const getProduct = useCallback(async () => {
    if (itemOfPageDebounce) {
      let body: any = {
        minPrice: 1,
        saleoff: true,
        sort_by: 'viewed_count',
        sort_type: 'desc',
        offset: 0,
        limit: itemOfPageDebounce,
      };
      try {
        setIsLoading(true);
        if (tab === 'sale-50') {
          const { status, error, data } = await productServices.filterProducts(body);
          if (!error && status !== 204) setProducts(data);
          if (status === 204) setProducts([]);
        } else if (tab === 'newest') {
          const { status, error, data } = await productServices.getProductNewest(
            0,
            itemOfPageDebounce
          );
          if (!error && status !== 204) setProducts(data);
          if (status === 204) setProducts([]);
        } else {
          let body: BodyFilterProductModel = {
            minPrice: 0,
            sort_by: 'createdAt',
            sort_type: 'desc',
            offset: 0,
            limit: itemOfPageDebounce,
          };
          if (tab === 'popular') body.sort_by = 'viewed_count';
          if (tab === 'best-selling') {
            (body.sort_by = 'bought_count'), (body.minPrice = 1);
          }
          const { status, error, data } = await productServices.filterProducts(body);

          if (status === 204) setProducts([]);
          else if (!error) setProducts(data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  }, [itemOfPageDebounce, tab]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  return (
    <L.BestSeller_wrapper>
      <ContainerFreeSize>
        <HeaderSection title={langLabel.homepage_product_title} />

        <L.Tabs_wrapper>
          <ul className='hide-scrollbar'>
            <li
              className={tab === 'newest' ? '--active' : undefined}
              onClick={() => setTab('newest')}>
              {langLabel.homepage_product_new}
            </li>
            <li
              className={tab === 'popular' ? '--active' : undefined}
              onClick={() => setTab('popular')}>
              {langLabel.homepage_product_popular}
            </li>
            <li
              className={tab === 'best-selling' ? '--active' : undefined}
              onClick={() => setTab('best-selling')}>
              {langLabel.homepage_product_best_selling}
            </li>
            <li
              className={tab === 'sale-50' ? '--active' : undefined}
              onClick={() => setTab('sale-50')}>
              {langLabel.homepage_product_sale_off}
            </li>
          </ul>
        </L.Tabs_wrapper>

        <Spin spinning={isLoading}>
          {isLoading && !products ? (
            <div style={{ minHeight: '300px' }} />
          ) : products && products?.length > 0 ? (
            <div className='product_list_scroll hide-scrollbar'>
              <L.Grid_wrapper
                className='ProductList__Grid'
                $itemCount={products?.length <= 3 ? products?.length : 3}>
                {products?.map((item, index) => (
                  <ProductCard key={index} data={item} />
                ))}
              </L.Grid_wrapper>
            </div>
          ) : (
            <ResultEmpty description='No products found' />
          )}
        </Spin>

        {products && products?.length > 0 && (
          <Button type='primary' className='btn__explore'>
            <Link
              href={
                tab === 'sale-50'
                  ? urlPage.saleOff.replace('{category}', 'all')
                  : `/explore/all${tab !== 'popular' ? '?sort=' + tab : ''}`
              }>
              {langLabel.btn_explore_all || 'Explore All'}
            </Link>
          </Button>
        )}
      </ContainerFreeSize>
    </L.BestSeller_wrapper>
  );
};

export default ProductByTabs;
