import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { Button, Flex, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { handlerMessage } from 'common/functions';
import showroomServices from 'services/showroom-services';

import ShowroomCard from 'components/Pages/Showroom/Fragments/ShowroomCard';
import ProductModal from 'components/Pages/Dashboard/Showroom/Decoration/Fragments/ProductModal';

import { ProductModel } from 'models/product.model';
import { ShowroomModel } from 'models/showroom.models';

import styled from 'styled-components';

const ProductComponent = () => {
  const i18n = useLanguage();
  const checkShowroomCart = true;

  const [authProduct, setAuthProduct] = useState<ShowroomModel>();

  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    onFetchAllProductHomePage();
  }, []);

  const onFetchAllProductHomePage = async () => {
    setLoading(true);
    try {
      const resp = await showroomServices.getListShowroomHomepage();
      if (!resp.error) {
        resp.data.market_user = {
          ...resp.data.market_user,
          products: {
            aggregate: {
              count: resp.data.market_user?.market_items_aggregate?.aggregate?.count || 0,
            },
          },
        };
        setAuthProduct(resp.data);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductModel[]) => {
    setLoading(true);
    try {
      let params: any = {};
      params['listItemId'] = data.map((i) => i?.id);

      let responseAPI = await showroomServices.addProductHomepage(params);

      if (!responseAPI.error) {
        setAuthProduct((current) =>
          current
            ? { ...current, market_user: { ...current?.market_user, market_items: data } }
            : undefined
        );
        setOpenSetting(false);
      }
      handlerMessage(i18n.t('message_edit_success'), 'success');

      setLoading(false);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const productUnavailable: ProductModel[] = error.response?.data?.items_unavailable;
        if (productUnavailable) {
          setAuthProduct((current) => {
            if (current) {
              const market_items = current?.market_user.market_items.map((i) => {
                const prodUnavailable = productUnavailable.find((p) => p.id === i.id);
                if (prodUnavailable) return { ...i, ...prodUnavailable };
                else return i;
              });
              return { ...current, market_user: { ...current.market_user, market_items } };
            } else return current;
          });
        }
      }
      setLoading(false);
      setOpenSetting(false);
    }
  };

  if (!authProduct)
    return (
      <Flex align='center' justify='center' style={{ height: 300 }}>
        <Spin />
      </Flex>
    );

  return (
    <Wrapper>
      <ProductComponentWrapper>
        <h3>{i18n.t('dashboard_card_product_title', 'My featured product')}</h3>
        <ul dangerouslySetInnerHTML={{ __html: i18n.t('dashboard_card_product_description') }} />
        <ProductWrapper>
          <ShowroomCard showroom={authProduct} type={'review'} notHover />
        </ProductWrapper>
      </ProductComponentWrapper>

      <Button
        type='primary'
        onClick={() => setOpenSetting(true)}
        loading={loading}
        className='btn_edit_card'>
        {i18n.t('btn_edit', 'Edit')}
      </Button>

      <ProductModal
        selected={authProduct?.market_user.market_items}
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        onFinishCard={onSubmit}
        checkShowroomCart={checkShowroomCart}
      />
    </Wrapper>
  );
};

export default ProductComponent;

export const ProductComponentWrapper = styled.div`
  h3 {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-gray-11);
  }
  ul > li {
    list-style-type: initial;
    margin-left: 20px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray-9);
  }
`;
export const ProductWrapper = styled.div`
  padding: 0;
  width: 425px;
  height: 258px;
  border-radius: 8px;
  background-color: #fff;
`;

export const Wrapper = styled.main`
  .btn_edit_card {
    margin-top: 32px;
    width: 213px;
    height: 48px;
  }
`;
