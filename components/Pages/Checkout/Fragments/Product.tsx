import styled from 'styled-components';

import { formatNumber } from 'common/functions';
import useLanguage from 'hooks/useLanguage';

import MyImage from 'components/Fragments/Image';

import { ProductCartModel } from 'models/checkout.models';

import { maxMedia } from 'styles/__media';

type Props = {
  products: ProductCartModel[];
};

const CheckoutProduct = (props: Props) => {
  const { products } = props;
  const { langLabel, t } = useLanguage();

  return (
    <Wrapper>
      <div className='checkout-section-header'>
        <h4>{langLabel.checkout_order_title || 'Order'}</h4>
        <div className='checkout-method-commit'>
          {t(
            products.length > 1 ? 'checkout_product_counter_plural' : 'checkout_product_counter'
          ).replace('{{total}}', products.length.toString())}
        </div>
      </div>
      {products.map((product) => {
        return (
          <div key={product.id} className='checkout-product-item'>
            <MyImage width={74.5} height={56} src={product.market_item.image} alt='' />
            <h4 className='title text-truncate'>{product.market_item.title}</h4>
            <div>
              {product.market_item.old_price && (
                <span>{formatNumber(product.market_item.old_price, '$')}</span>
              )}
              {formatNumber(product.market_item.price, '$')}
            </div>
          </div>
        );
      })}
    </Wrapper>
  );
};
export default CheckoutProduct;

const Wrapper = styled.div`
  .checkout-section-header {
    margin-bottom: 5px;
  }
  .checkout-product-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 0;
    & + .checkout-product-item {
      border-top: var(--border-1px);
    }
    img {
      border-radius: 4px;
      object-fit: cover;
      border-radius: var(--border-radius-base);
    }
    h4 {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-title);
    }
    div {
      flex: auto;
      text-align: right;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-caption);
      span {
        margin-right: 20px;
        text-decoration: line-through;
        color: var(--color-gray-6);
      }
    }

    ${maxMedia.small} {
      padding: 10px 0;
      img {
        width: 64px;
        height: 48px;
      }
    }
  }
`;
