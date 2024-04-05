import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Head from 'next/head';

import { Spin } from 'antd';

import config from 'config';

import useLanguage from 'hooks/useLanguage';
import useWindowScroll from 'hooks/useWindowScroll';
import useRouterChange from 'hooks/useRouterChange';

import { getNewObjByFields } from 'common/functions';
import { AppState } from 'store/type';

import orderServices, { BodyGetOrder } from 'services/order-services';

import ResultEmpty from 'components/Fragments/ResultEmpty';
import UserPageTabContent from '../Layout/TabContent';
import HeaderPage from '../Fragments/HeaderPage';
import OrderHeader from './Fragments/OrderHeader';
import OrderProduct from './Fragments/OrderProduct';
import OrderItemFooter from './Fragments/OrderItemFooter';

import { UserPageOrderProps } from 'models/user.models';
import { OrderModel } from 'models/order.model';

import * as L from './style';

const pageSize: number = 20;
const paramFilterDefault: BodyGetOrder = { type: '1', keySearch: '', offset: 0, limit: pageSize };

const MyOrdersPage = (props: UserPageOrderProps) => {
  const { langLabel, t } = useLanguage();

  const pageYOffset = useWindowScroll();
  const orderAction = useSelector((state: AppState) => state.order);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [paramFilter, setParamFilter] = useState<BodyGetOrder>(paramFilterDefault);
  const [data, setData] = useState<{ orders: OrderModel[]; orderTotal: number }>();

  useRouterChange(
    () => undefined,
    () => setParamFilter(paramFilterDefault)
  );

  //Get Order FirstTime
  useEffect(() => {
    setPage(1);
    setData(undefined);
    setParamFilter(paramFilterDefault);
  }, [props.tabName, props.userID]);

  //Get Order
  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    await orderServices
      .getOrders(paramFilter)
      .then(({ data, total }) =>
        setData((current = { orders: [], orderTotal: 0 }) => ({
          orders: current.orders.length <= paramFilter.offset ? current.orders.concat(data) : data,
          orderTotal: total,
        }))
      )
      .catch(() => setData({ orders: [], orderTotal: 0 }))
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [paramFilter]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  //Load more
  useEffect(() => {
    const isScrollBottom =
      (document.getElementById('__next')?.offsetHeight ?? 0) -
        document.getElementsByTagName('footer')[0]?.offsetHeight -
        50 <
      pageYOffset + window.innerHeight + 100;

    if (isScrollBottom && data && data.orderTotal > page * pageSize && !isLoadingMore) {
      setPage(page + 1);
      setParamFilter((p) => ({ ...p, offset: page * pageSize }));
      setIsLoadingMore(true);
    }
  }, [data, isLoadingMore, page, pageYOffset]);

  useEffect(() => {
    if (orderAction?.type === 'cancel-success' && data?.orders) {
      let orderClone = [...data.orders];
      const indexOrder = data.orders.findIndex((i) => i.id === orderAction.order?.id);
      orderClone.splice(indexOrder, 1, { ...data.orders[indexOrder], status: 6 });
      setData((s = { orders: [], orderTotal: 0 }) => ({ ...s, orders: orderClone }));
    }
  }, [data, orderAction]);

  const title = `My Orders | ${config.websiteName}`;

  const onSearch = (value: string) => {
    if (paramFilter.keySearch.trim() !== value.trim()) {
      setParamFilter((p) => ({ ...p, keySearch: value.trim() }));
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <UserPageTabContent
        tabs={[
          {
            title: langLabel.all,
            url: '/user/my-orders/all',
            active: [null, 'all'].includes(props.tabName),
          },
        ]}
        isSearch
        isResetSearchChangeTab
        onSearch={(keySearch) => onSearch(keySearch)}
        placeholder={langLabel.my_profile_order_search_placeholder}
      />

      <L.OrderTotal_wrapper>
        <HeaderPage
          className='p-0'
          title={
            data?.orderTotal != null && (data?.orderTotal > 1 || data?.orderTotal === 0)
              ? langLabel.my_profile_orders_total
              : langLabel.my_profile_order_total
          }
          total={data?.orderTotal}
        />
        <Spin spinning={isLoading}>
          <L.OrderList style={{ minHeight: isLoading ? 300 : 'inherit' }}>
            {!data && <div style={{ height: 300 }} />}
            {data && !data.orderTotal && (
              <ResultEmpty description={t('my_profile_order_empty_title')} />
            )}
            {data?.orders.map((order) => (
              <L.OrderItem__Wrapper key={order.id}>
                <OrderHeader
                  date={order.createdAt}
                  order_no={order.order_no}
                  status={order.status}
                  productTotal={order.items.length}
                />
                {order.items.slice(0, 3)?.map((product) => (
                  <OrderProduct key={product.id} data={product} />
                ))}
                <OrderItemFooter
                  data={getNewObjByFields(order, ['id', 'order_no', 'status', 'amount'])}
                />
              </L.OrderItem__Wrapper>
            ))}
          </L.OrderList>
        </Spin>
        {isLoadingMore && (
          <div className='mt-5 pt-3 text-center'>
            <Spin />
          </div>
        )}
      </L.OrderTotal_wrapper>
    </>
  );
};

export default MyOrdersPage;
