import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Button, Flex, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';

import productServices from 'services/product-services';

import ProductCard from 'components/Fragments/ProductCard';

import { ProductModel } from 'models/product.model';

import { ContainerFreeSize } from 'styles/__styles';
import Wrapper from './style';

const rowOfPage = 4;

const CartSuggest = () => {
  const { width: screenW } = useWindowSize();
  const { langLabel } = useLanguage();

  const [data, setData] = useState<ProductModel[]>();
  const [loading, setLoading] = useState(false);

  const itemOfPage = useMemo(() => {
    let calculatedItemOfPage = 0;
    if (screenW) {
      if (screenW > 1920) calculatedItemOfPage = rowOfPage * 5;
      else if (screenW > 1440) calculatedItemOfPage = rowOfPage * 4;
      else if (screenW > 640) calculatedItemOfPage = rowOfPage * 3;
      else calculatedItemOfPage = rowOfPage * 2.5;
    }
    return calculatedItemOfPage;
  }, [screenW]);

  const getProduct = useCallback(async () => {
    if (itemOfPage !== 0) {
      setLoading(true);
      try {
        const { status, error, data } = await productServices.suggestProduct(itemOfPage);

        if (!error && status !== 204) setData(data);
        setLoading(false);
        if (status === 204) setData([]);
      } catch (error) {
        setLoading(false);
      }
    }
  }, [itemOfPage]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  return (
    <Wrapper>
      <ContainerFreeSize>
        <h4 className='cartSuggest_title'> {langLabel.cart_suggest_modal}</h4>

        {loading ? (
          <Flex justify='center' align='center' style={{ height: 100 }}>
            <Spin className='spin' />
          </Flex>
        ) : (
          <>
            <div className='cartSuggest_productList ProductList__Grid hide-scrollbar'>
              {data?.map((v) => {
                return <ProductCard key={v.id} data={v} />;
              })}
            </div>
            <Flex justify='center' style={{ marginTop: 30 }}>
              <Button size='large' type='primary'>
                <Link href='/explore/all?sort=best-selling'>{langLabel.btn_see_more}</Link>
              </Button>
            </Flex>
          </>
        )}
      </ContainerFreeSize>
    </Wrapper>
  );
};

export default CartSuggest;
