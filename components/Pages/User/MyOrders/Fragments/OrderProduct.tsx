import styled from 'styled-components';

import { formatNumber } from 'common/functions';

import MyImage from 'components/Fragments/Image';

import { OrderProductType } from 'models/order.model';

import { maxMedia } from 'styles/__media';

const OrderProduct = (props: { data: OrderProductType }) => {
  const { data } = props;

  return (
    <OrderProductWrapper key={data.id}>
      <div className='box'>
        <div className='box__left'>
          <MyImage src={data.image || ''} alt='' loading='lazy' width={64} height={48} />
          <span>{data.title}</span>
        </div>
        <div className='box__right'>
          {data.old_price && (
            <span className='box__right--old'>{formatNumber(data.old_price || 0, '$')}</span>
          )}

          <span className='box__right--new'>{formatNumber(data.price, '$')}</span>
        </div>
      </div>
    </OrderProductWrapper>
  );
};

export default OrderProduct;

const OrderProductWrapper = styled.div`
  padding: 20px 40px;
  border-bottom: 1px solid var(--color-gray-4);

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;

    span {
      font-size: 14px;
      line-height: normal;
      color: var(--color-gray-9);
    }

    &__left {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: auto;
      word-break: break-word;
      margin-right: 10px;
      img {
        object-fit: cover;
        border-radius: 8px;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 10px;

      &--old {
        color: var(--color-gray-6) !important;
        text-decoration: line-through;
      }
    }
  }

  ${maxMedia.medium} {
    padding: 15px 20px;

    .box {
      &__left {
        gap: 10px;
      }
    }
  }
`;
