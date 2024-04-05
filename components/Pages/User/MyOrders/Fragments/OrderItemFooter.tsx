import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { Button } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { CreateOrderActionRedux } from 'store/reducer/order';
import { formatNumber } from 'common/functions';

import { OrderStatusType } from 'models/order.model';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  data: { id: string; status: OrderStatusType; amount: number };
};

const OrderItemFooter = (props: Props) => {
  const { data } = props;

  const dispatch = useDispatch();

  const onCancel = () => {
    dispatch(CreateOrderActionRedux({ type: 'cancel', order: data }));
  };
  const { langLabel, langCode } = useLanguage();

  return (
    <OrderTotal__Wrapper>
      <div>
        <div className='total__amount'>
          <img className='icon' src='/static/images/my-orders/sigma.png' alt='' loading='lazy' />
          <span className='total__text'>{langLabel.my_profile_total_amount}</span>
          <p className='total__text total__price'>{formatNumber(data.amount, '$')}</p>
        </div>

        <div className='total__btn'>
          {data.status === 1 && (
            <Button className='btn__right' type='primary'>
              <Link href={`/${langCode}/user/my-orders/detail/` + data.id}>
                {langLabel.my_profile_order_btn_detail}
              </Link>
            </Button>
          )}

          {data.status === 4 && (
            <>
              <Button className='btn__left'>
                <Link href={'/user/my-orders/detail/' + data.id}>Details</Link>
              </Button>

              <Button className='btn__left' onClick={onCancel}>
                Cancel
              </Button>

              <Button className='btn__right' type='primary'>
                Pay now
              </Button>
            </>
          )}

          {data.status === 5 && (
            <>
              <Button className='btn__left' onClick={onCancel}>
                Cancel
              </Button>
              <Button className='btn__right' type='primary'>
                Pay back
              </Button>
            </>
          )}

          {data.status === 6 && (
            <>
              <Button className='btn__left'>
                <Link href={'/user/my-orders/detail/' + data.id}>Details</Link>
              </Button>

              <Button className='btn__right' type='primary'>
                Repurchase
              </Button>
            </>
          )}
        </div>
      </div>
    </OrderTotal__Wrapper>
  );
};

export default OrderItemFooter;

const OrderTotal__Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 21px 40px;
  text-align: right;
  background-color: #f6f7f8;

  .total__amount {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: fit-content;
    margin-left: auto;
    margin-bottom: 20px;

    .icon {
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(calc(-100% - 10px), -20%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .total__text {
      font-weight: 500;
      font-size: 16px;
      line-height: 1;
      color: var(--color-gray-11);
    }

    .total__price {
      display: block;
      color: var(--color-red-6);
    }
  }

  .total__btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;

    button {
      height: 37px;
      min-width: 130px;
      border-color: var(--color-main-6);
      font-weight: 600;
    }

    .btn__left {
      color: var(--color-main-6);
    }
  }

  ${maxMedia.medium} {
    padding: 20px;
  }
`;
