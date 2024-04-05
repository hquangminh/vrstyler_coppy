import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { ConfigProvider, Spin } from 'antd';

import { changeToSlug, formatNumber } from 'common/functions';
import useLanguage from 'hooks/useLanguage';
import { RemoveProductCart } from 'lib/utils/checkout';
import { RemoveCouponRedux, RemoveProductCartRedux } from 'store/reducer/cart';
import urlPage from 'constants/url.constant';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';

import { AppState } from 'store/type';
import { ProductCartModel } from 'models/checkout.models';

import { ProductItem, Wrapper } from './style';

type Props = {
  products: ProductCartModel[];
};

const CartProductSection = (props: Props) => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <div className='cart_header'>
        {langLabel.cart_title || 'Shopping Cart '} <span>{props.products.length}</span>
      </div>

      {props.products.map((product) => (
        <ProductCard key={product.id} data={product} />
      ))}
    </Wrapper>
  );
};

export default CartProductSection;

const ProductCard = ({ data }: { data: ProductCartModel }) => {
  const dispatch = useDispatch();
  const { langLabel } = useLanguage();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const products = useSelector((state: AppState) => state.cart.products);
  const slug = changeToSlug(data.market_item.title, data.market_item.id);
  const link = urlPage.productDetail.replace('{slug}', slug);

  const onRemoveCart = async (cartID: string, productID: string) => {
    setIsDeleting(true);
    await RemoveProductCart(productID)
      .then(() => {
        dispatch(RemoveProductCartRedux(cartID));
        const isCheckEmptyProducts =
          products && products.filter((product) => product.market_item.is_available).length > 0;
        if (!isCheckEmptyProducts) dispatch(RemoveCouponRedux());
      })
      .catch(() => setIsDeleting(false));
  };

  const isProductUnavailable = data.market_item.is_available === false;

  return (
    <ProductItem>
      <ConfigProvider theme={{ token: { fontSize: 12 } }}>
        <Spin spinning={isDeleting} tip={langLabel.cart_deleting} size='small'>
          <div className={`Cart_Product_Container ${isProductUnavailable ? 'unavailable' : ''}`}>
            <div>
              <Link href={link}>
                <MyImage
                  width={74.5}
                  height={56}
                  src={data.market_item.image}
                  alt={data.market_item.title}
                  loading='lazy'
                />
              </Link>
              <h5>
                <Link href={link}>{data.market_item.title}</Link>
                {isProductUnavailable && (
                  <span className='text__unavailable'>
                    {langLabel.cart_product_unavailable || 'This product is not available'}
                  </span>
                )}
              </h5>
            </div>
            <div>
              <p>{formatNumber(data.market_item.price, '$')}</p>
              <div className='product-actions'>
                <Icon
                  iconName='close-circle'
                  className='btn-remove'
                  onClick={() => onRemoveCart(data.id, data.market_item.id)}
                />
              </div>
            </div>
          </div>
        </Spin>
      </ConfigProvider>
    </ProductItem>
  );
};
