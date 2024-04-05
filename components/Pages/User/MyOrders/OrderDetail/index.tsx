import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Head from 'next/head';
import Link from 'next/link';

import { Button, Result, Spin } from 'antd';

import config from 'config';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { getNewObjByFields } from 'common/functions';
import urlPage from 'constants/url.constant';

import orderServices from 'services/order-services';

import HeaderPage from '../../Fragments/HeaderPage';
import OrderHeader from '../Fragments/OrderHeader';
import OrderProduct from '../Fragments/OrderProduct';
import OrderTotal from './OrderTotal';

import { OrderModel } from 'models/order.model';
import { AppState } from 'store/type';

import * as L from './style';

type Props = {
  orderId: string;
};

const OrderDetail = (props: Props) => {
  const { langLabel } = useLanguage();
  const orderAction = useSelector((state: AppState) => state.order);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<OrderModel>();

  const fetchData = useCallback(async () => {
    await orderServices
      .getOrderDetail(props.orderId)
      .then(({ data }) => setOrder(data))
      .catch(() => message.destroy())
      .finally(() => setIsLoading(false));
  }, [props.orderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (orderAction?.type === 'cancel-success' && order) {
      setOrder({
        ...order,
        status: 6,
        payment_note: orderAction.order?.payment_note,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [order, orderAction]);

  const title = `${order ? `Order #${order.order_no} | ` : ''}${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <L.OrderDetail_wrapper>
        {isLoading && (
          <Spin
            style={{ height: 300 }}
            className='d-flex align-items-center justify-content-center'
          />
        )}
        {!isLoading && order && (
          <>
            <HeaderPage title={langLabel.my_profile_order_detail_title} isBack />
            <L.OrderDetail_Content>
              <OrderHeader
                date={order.createdAt}
                order_no={order.order_no}
                status={order.status}
                productTotal={order.items.length}
              />

              {order.items.map((product) => (
                <OrderProduct key={product.id} data={product} />
              ))}

              <OrderTotal
                data={getNewObjByFields(order, [
                  'id',
                  'order_no',
                  'subtotal',
                  'discount',
                  'amount',
                  'market_coupon',
                  'payment_method',
                  'payment_note',
                  'status',
                  'paidAt',
                  'createdAt',
                  'updatedAt',
                ])}
              />
            </L.OrderDetail_Content>
          </>
        )}
        {!isLoading && !order && (
          <Result
            status='404'
            title={langLabel.oops || 'Oops!'}
            subTitle={langLabel.my_profile_order_detail_not_found}
            extra={
              <Button type='primary'>
                <Link href={urlPage.my_order}>{langLabel.modeling_back_to_order}</Link>
              </Button>
            }
          />
        )}
      </L.OrderDetail_wrapper>
    </>
  );
};

export default OrderDetail;
