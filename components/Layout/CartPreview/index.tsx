import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button, Drawer } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { AppState } from 'store/type';
import { CloseCart } from 'store/reducer/modal';
import { formatNumber } from 'common/functions';

import Icon from 'components/Fragments/Icons';
import CartEmpty from 'components/Fragments/CartEmpty';
import ProductCartPreview from 'components/Fragments/ProductCartPreview';

import * as SC from './style';

const CartPreview = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { langLabel, langCode } = useLanguage();

  const cart = useSelector((state: AppState) => state.cart);
  const show = useSelector((state: AppState) => state.modal.cartPreview);

  return (
    <Drawer
      placement='right'
      closable={false}
      width='auto'
      style={{ zIndex: 1001 }}
      styles={{ body: { padding: 0 } }}
      open={show}
      onClose={() => dispatch(CloseCart())}>
      <SC.CartPreview>
        <SC.Header>
          <h3 className='d-flex align-items-center'>
            {langLabel.cart_drawer_title}
            <span className='Cart__Count'>{cart.products?.length}</span>
          </h3>

          <Icon
            iconName='close'
            className='btn-close--mobile'
            onClick={() => dispatch(CloseCart())}
          />
        </SC.Header>

        <SC.Content>
          <SC.ProductList>
            {cart.products?.map((product) => {
              return <ProductCartPreview key={product.id} data={product} />;
            })}
          </SC.ProductList>
          {!cart.products?.length && (
            <SC.CartEmpty>
              <CartEmpty
                size='small'
                button={
                  <Button
                    type='primary'
                    onClick={() => {
                      const currentPath = router.asPath.split('/')[1];

                      let pathname = '';
                      if (currentPath === 'explore') {
                        pathname = `/${langCode}/${currentPath}/all`;
                      } else {
                        pathname = `/${langCode}/explore/all`;
                      }
                      router.push({ pathname }, undefined, {
                        shallow: true,
                      });
                      dispatch(CloseCart());
                    }}>
                    {langLabel.cart_drawer_empty_btn}
                  </Button>
                }
              />
            </SC.CartEmpty>
          )}
        </SC.Content>

        <SC.Checkout>
          {cart.products?.length ? (
            <>
              <h4 className='d-flex align-items-center'>
                {langLabel.cart_total}
                <span className='d-inline-block ml-auto'>
                  {formatNumber(
                    cart.products
                      .filter((product) => product.market_item.is_available !== false)
                      .reduce((total: number, product) => total + product.market_item.price, 0),
                    '$'
                  )}
                </span>
              </h4>

              <Button
                type='primary'
                disabled={!cart.products.length || router.pathname === `/cart`}
                onClick={() => dispatch(CloseCart())}>
                <Link href={`/${langCode}/cart`}>{langLabel.cart_drawer_btn_to_cart}</Link>
              </Button>
            </>
          ) : null}
        </SC.Checkout>
      </SC.CartPreview>
    </Drawer>
  );
};

export default CartPreview;
