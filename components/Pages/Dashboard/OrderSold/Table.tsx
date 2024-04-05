import React, { memo, useCallback, useEffect } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { Badge, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { formatNumber } from 'common/functions';
import urlPage from 'constants/url.constant';
import sellerServices from 'services/seller-services';

import TableFragment from '../Fragments/Table';
import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';

import { ProductModel } from 'models/product.model';
import { SellerOrderItem } from 'models/seller.model';

const pageSize = 10;

type Props = {
  total: number;
  data: ProductModel[] | null;
  setOrders: React.Dispatch<React.SetStateAction<{ data: ProductModel[] | null; total: number }>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};

const TableComponent = (props: Props) => {
  const { setOrders, data, total, loading, setLoading } = props;
  const { langCode, langLabel, t } = useLanguage();

  const router = useRouter();

  const onFetchAllOrder = useCallback(async () => {
    try {
      setLoading?.(true);

      const page = Number(router.query.page ?? 1);

      const queryParams = {
        start_date: router.query.start_date ? router.query.start_date.toString() : undefined,
        end_date: router.query.end_date ? router.query.end_date.toString() : undefined,
        order_status: router.query.order_status ? router.query.order_status : undefined,
      };

      await sellerServices
        .getAllOrder(pageSize, (page - 1) * pageSize, queryParams)
        .then(({ data, total }) => setOrders({ data, total }))
        .finally(() => setLoading?.(false));
    } catch (error) {
      setLoading?.(false);
      if ((error as AxiosError)?.response?.status === 400 && Object.keys(router.query).length) {
        message.destroy();
        router.replace({ query: undefined }, undefined, { shallow: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, setLoading, setOrders]);

  useEffect(() => {
    onFetchAllOrder();
  }, [onFetchAllOrder]);

  const columns: ColumnsType<SellerOrderItem> = [
    {
      title: langLabel.order_id,
      key: 'order_no',
      render: (_, record) => {
        const linkOrderDetail = urlPage.dashboard_order_detail.replace(
          '{orderID}',
          record.market_order.id
        );
        return (
          <Link
            href={linkOrderDetail}
            className='order__column'
            title={`#${record.market_order.order_no}`}>
            #{record.market_order.order_no}
          </Link>
        );
      },
    },
    {
      title: langLabel.sale_date,
      key: 'createdAt',
      render: (_, record) => (
        <div className='sale__date__column'>
          <Moment date={record.market_order.createdAt} langCode={langCode} />
          <p>{dayjs(record.market_order.createdAt).format('h:mm A')}</p>
        </div>
      ),
    },
    {
      title: (
        <div
          className='d-flex align-items-center justify-content-between text-nowrap'
          style={{ gap: '5px' }}>
          {langLabel.total_payment}
          <Tooltip title={t('dashboard_order_total_payment_tooltip')}>
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        </div>
      ),
      width: 160,
      dataIndex: 'totalPayment',
      render: (_, record) => formatNumber(record.subtotal, '$'),
    },
    {
      title: langLabel.amount,
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => record.market_items_boughts_aggregate.aggregate.count ?? 0,
    },
    {
      title: (
        <div
          className='d-flex align-items-center justify-content-between text-nowrap'
          style={{ gap: '5px' }}>
          {langLabel.total_earning}
          <Tooltip title={t('dashboard_order_total_earning_tooltip')}>
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'totalEarning',
      width: 160,
      render: (_, record) => formatNumber(record.total_earn, '$'),
    },
    {
      title: langLabel.buyer,
      dataIndex: 'buyer',
      key: 'buyer',
      render: (_, record) => (
        <div className='buyer__column'>
          <MyImage
            src={record.market_order.market_user.image}
            img_error='/static/images/avatar-default.png'
            alt=''
            width={24}
            height={24}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          {record.market_order.market_user.name}
        </div>
      ),
    },
    {
      title: langLabel.order_status,
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (_, record) => {
        const checked = record.market_items_boughts_aggregate.nodes[0].is_checked;
        return (
          <div className='d-flex align-items-center' style={{ gap: '5px' }}>
            <Badge dot status={checked ? 'success' : 'error'} className='mr-2' />
            {checked
              ? t('dashboard_order_checked', 'Checked')
              : t('dashboard_order_unchecked', 'Unchecked')}
          </div>
        );
      },
    },
  ];

  return (
    <TableFragment
      loading={loading}
      total={total}
      pageSize={pageSize}
      key='models'
      rowKey={(record) => {
        if ('market_order' in record) return record.market_order.id;
        return data?.indexOf(record);
      }}
      columns={columns}
      isPagination={true}
      data={data}
    />
  );
};

export default memo(TableComponent);
