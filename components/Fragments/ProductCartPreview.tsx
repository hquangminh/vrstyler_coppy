import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { RemoveProductCartRedux } from 'store/reducer/cart';
import { RemoveProductCart } from 'lib/utils/checkout';
import { formatNumber, decimalPrecision } from 'common/functions';
import percentDiscount from 'common/functions/percDiscount';

import Icon from './Icons';
import MyImage from './Image';

import { ProductCartModel } from 'models/checkout.models';

import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

const ProductCartPreview = (props: { data: ProductCartModel }) => {
  const { data } = props;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { langLabel } = useLanguage();

  const onRemoveCart = async () => {
    try {
      setLoading(true);
      const { error } = await RemoveProductCart(data.market_item.id);
      if (!error) {
        dispatch(RemoveProductCartRedux(data.id));
      }
    } finally {
      setLoading(false);
    }
  };

  const isProductUnavailable = data.market_item.is_available === false;

  return (
    <Wrapper>
      <Spin spinning={loading} tip={langLabel.cart_deleting}>
        <div
          className={`Cart_Preview_Product_Card_Container ${
            isProductUnavailable ? 'unavailable' : ''
          }`}>
          <MyImage
            className='product-image'
            width={75}
            height={56}
            src={data.market_item.image}
            alt=''
            loading='lazy'
          />
          <div className='product-info'>
            <h4 className='title text-truncate-line'>{data.market_item.title}</h4>
            <p className='price'>{formatNumber(data.market_item.price, '$')}</p>
            {Boolean(data.market_item.old_price && data.market_item.price) && (
              <p className='price-discount'>
                {data.market_item.old_price && (
                  <span className='discount'>
                    -
                    {decimalPrecision(
                      percentDiscount(data.market_item.price, data.market_item.old_price),
                      2
                    )}
                    %
                  </span>
                )}
                <span>
                  <del>{formatNumber(data.market_item.old_price ?? 0, '$')}</del>
                </span>
              </p>
            )}
            {isProductUnavailable && (
              <span className='text__unavailable'>
                {langLabel.cart_product_unavailable || 'This product is not available'}
              </span>
            )}
          </div>

          <Icon iconName='close-circle' className='btn-remove' onClick={onRemoveCart} />
        </div>
        {data.isProductChange && (
          <span className='change__error'>
            {langLabel.cart_product_edit || 'Sản phẩm này đã được chỉnh sửa'}
          </span>
        )}
      </Spin>
    </Wrapper>
  );
};

export default ProductCartPreview;

const Wrapper = styled.div`
  & + div {
    background-image: url('/static/images/cart-preview_product_line-dash.png');
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: top;
  }

  .Cart_Preview_Product_Card_Container {
    display: flex;
    gap: 10px;
    padding: 10px 30px 10px 20px;
    position: relative;
    &.unavailable {
      border-color: #d9d9d9;
      color: #ff4d4f;
      background-color: rgba(0, 0, 0, 0.04);
      opacity: 0.6;

      .text__unavailable {
        display: block;
        margin-top: 5px;
      }
    }
  }

  .change__error {
    display: inline-block;
    margin-left: 20px;
    position: relative;
    top: -8px;
    font-size: 14px;
    word-wrap: break-word;
    color: #ff4d4f;
  }

  .product-image {
    object-fit: cover;
    border-radius: 4px;
    ${maxMedia.small} {
      width: 64px;
      height: 48px;
    }
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-caption);
      max-width: 220px;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;

      ${maxMedia.medium} {
        max-width: 210px;
      }
      ${maxMedia.small} {
        -webkit-line-clamp: 1;
        max-width: 180px;
      }
    }

    .price {
      font-size: 18px;
      font-weight: 500;
      color: var(--color-gray-8);

      &-discount {
        font-size: 13px;
        line-height: 16px;
        color: var(--color-main-6);
        font-weight: 500;

        span {
          margin-right: 5px;
          font-size: 14px;
          color: var(--color-gray-7);

          &.discount {
            font-weight: 500;
            color: var(--color-primary-500);
          }
        }
      }
    }
  }
  .btn-remove {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;

    cursor: pointer;

    &:hover {
      color: var(--color-red-6);
    }
  }
`;
