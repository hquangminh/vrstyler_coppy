import { useDispatch } from 'react-redux';
import { CreateOrderActionRedux } from 'store/reducer/order';

import { Button } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { formatNumber } from 'common/functions';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';

import { OrderModel } from 'models/order.model';

import * as L from './style';

type Props = { data: OrderModel };

const OrderTotal = (props: Props) => {
  const dispatch = useDispatch();
  const { data } = props;
  const { langCode, langLabel } = useLanguage();

  const coupon = data.market_coupon;

  const onCancel = () => {
    dispatch(CreateOrderActionRedux({ type: 'cancel', order: data }));
  };

  return (
    <L.OrderTotal_wrapper>
      <div className='total__date'>
        <div className='text'>
          <p>
            <span>{langLabel.my_profile_order_date + ': '}</span>
            <Moment date={data.createdAt} langCode={langCode} showTime timeFormat='hh:mm:ss A' />
          </p>
          {data.status === 1 && data.paidAt && (
            <p>
              <span>{langLabel.my_profile_order_payment_date + ': '}</span>
              <Moment date={data.paidAt} langCode={langCode} showTime timeFormat='hh:mm:ss A' />
            </p>
          )}
          {data.status === 6 && (
            <>
              <p>
                <span>{langLabel.my_profile_order_cancel_date + ': '}</span>
                <Moment date={data.updatedAt} langCode={langCode} />
              </p>
              <p>
                <span>{langLabel.my_profile_order_cancel_reason + ': '}</span>
                {data.payment_note}
              </p>
            </>
          )}
        </div>
      </div>

      <div className='total__price'>
        <div className='total__table'>
          <div className='table__item'>
            <h4>{langLabel.subtotal || 'Subtotal'}</h4>
            <p>{formatNumber(data.subtotal, '$')}</p>
          </div>

          <div className='table__item'>
            <h4>{langLabel.discount || 'Discount'}</h4>
            <p>- {formatNumber(data.discount, '$')}</p>
          </div>

          {coupon && (
            <div className='table__item table__item--coupons'>
              <h4>{langLabel.coupon || 'Coupon'}</h4>
              <p>
                {coupon?.prefix}-{coupon?.code}
              </p>
            </div>
          )}

          {data.status === 1 && data.payment_method && (
            <div className='table__item table__item--payment'>
              <h4>{langLabel.payment_method || 'Payment method'}</h4>

              <p>
                {data.payment_method?.split('|')[0] === 'card' && (
                  <>
                    {data.payment_method?.split('|')[1] === 'visa' && <Icon iconName='visa' />}
                    {data.payment_method?.split('|')[1] === 'mastercard' && (
                      <Icon iconName='mastercard' />
                    )}
                    {data.payment_method?.split('|')[1] === 'amex' && <Icon iconName='am-ex' />}
                    {data.payment_method?.split('|')[1] === 'discover' && (
                      <Icon iconName='discover-card' />
                    )}
                    {data.payment_method?.split('|')[1] === 'diners' && (
                      <Icon iconName='diners-club' />
                    )}
                    {data.payment_method?.split('|')[1] === 'jcb' && <Icon iconName='jcb-card' />}
                    <span>**** {data.payment_method?.split('|')[2]}</span>
                  </>
                )}
                {data.payment_method?.split('|')[0] === 'paypal' && <Icon iconName='paypal-text' />}
              </p>
            </div>
          )}

          <div className='table__item table__item--amount'>
            <h4>
              <img
                src='/static/images/my-orders/sigma.png'
                alt=''
                loading='lazy'
                style={{ width: '2.4rem', height: '2.4rem', borderRadius: '50%' }}
              />
              {langLabel.my_profile_total_amount}
            </h4>
            <p>{formatNumber(data.amount, '$')}</p>
          </div>
        </div>

        <div className='total__btn'>
          {data.status === 4 && (
            <>
              <Button className='btn__left' shape='round' onClick={onCancel}>
                Cancel
              </Button>

              <Button className='btn__right' type='primary' shape='round'>
                Pay Now
              </Button>
            </>
          )}

          {data.status === 6 && (
            <Button className='btn__right' type='primary' shape='round'>
              Repurchase
            </Button>
          )}

          {/* {status === 1 && (
            <Button className='btn__right' type='primary' shape='round'>
              Refund
            </Button>
          )} */}
        </div>
      </div>
    </L.OrderTotal_wrapper>
  );
};

export default OrderTotal;
