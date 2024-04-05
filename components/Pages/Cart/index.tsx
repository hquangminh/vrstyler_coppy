import { useSelector } from 'react-redux';

import Link from 'next/link';

import { Button, Flex, Spin } from 'antd';

import { AppState } from 'store/type';
import useLanguage from 'hooks/useLanguage';

import DividerMain from 'components/Fragments/DividerMain';
import CartEmpty from 'components/Fragments/CartEmpty';
import CartProductSection from './Product';
import CartTotal from './Total';
import CartSuggest from './Suggest';

import { Wrapper, Content } from './style';
import { Container } from 'styles/__styles';

const CartPage = () => {
  const { langLabel } = useLanguage();

  const products = useSelector((state: AppState) => state.cart.products);
  const subTotal = Number(
    products
      ?.filter((product) => product.market_item.is_available !== false)
      .reduce((total: any, product: any) => total + product.market_item.price, 0)
      .toFixed(2)
  );

  if (!products)
    return (
      <Flex justify='center' align='center' style={{ height: 300 }}>
        <Spin />
      </Flex>
    );

  return (
    <Wrapper>
      <Container>
        <Content>
          {products && products.length > 0 ? (
            <>
              <CartProductSection products={products} />
              <CartTotal subTotal={subTotal} />
            </>
          ) : (
            <div className='w-100 text-center'>
              <CartEmpty
                size='small'
                button={
                  <Button type='primary'>
                    <Link href='/explore/all'>{langLabel.cart_drawer_empty_btn}</Link>
                  </Button>
                }
              />
            </div>
          )}
        </Content>
        <DividerMain />
      </Container>
      <CartSuggest />
    </Wrapper>
  );
};

export default CartPage;
