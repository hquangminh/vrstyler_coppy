import styled from 'styled-components';

import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';

import { OrderStatusType } from 'models/order.model';

import { maxMedia } from 'styles/__media';

type Props = {
  status: OrderStatusType;
  date: string;
  order_no: string;
  productTotal: number;
};

const OrderHeader = (props: Props) => {
  const { langCode, langLabel } = useLanguage();

  return (
    <OrderHeaderWrapper className='order--header' type={props.status}>
      <Icon iconName='order' />
      <div className='OrderHeader__Info'>
        <p className='OrderHeader_Code'>
          <span>{langLabel.my_profile_order_code}</span> {props.order_no}
        </p>
        <p className='OrderHeader_Date'>
          <span>{langLabel.date + ': '}</span>
          <Moment date={props.date} langCode={langCode} />
        </p>
        <p className='OrderHeader_Amount'>
          <span>{langLabel.my_profile_order_product_total}</span> {props.productTotal}
        </p>
      </div>
    </OrderHeaderWrapper>
  );
};

export default OrderHeader;

const OrderHeaderWrapper = styled.div<{ type: number }>`
  display: flex;
  align-items: flex-start;
  gap: 6px;

  padding: 12px 24px;
  background-color: #f6f7f8;

  .OrderHeader__Info {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr;
    gap: 2px 16px;
    font-size: 12px;
    color: var(--color-gray-9);

    .OrderHeader_Code {
      color: var(--color-primary-700);
    }
    span {
      color: var(--color-gray-11);
      font-weight: 500;
    }

    ${maxMedia.xsmall} {
      .OrderHeader_Code {
        grid-area: 1/1/2/3;
      }
      .OrderHeader_Date {
        grid-area: 2/2/3/3;
      }
    }
  }

  .my-icon {
    display: flex;
    align-items: center;
    line-height: initial;
    font-size: initial;
    margin-top: 4px;

    &.order {
      color: var(--color-primary-700);
    }
  }

  svg {
    width: 22px;
    fill: var(--color-main-6);
  }

  ${maxMedia.medium} {
    padding: 6px 20px;

    .box {
      &__left {
        gap: 10px;
      }
    }
  }
`;
