import { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AxiosError } from 'axios';
import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { formatNumber } from 'common/functions';
import urlPage from 'constants/url.constant';

import sellerServices from 'services/seller-services';

import TableFragment from '../Fragments/Table';
import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';

import { ProductModel } from 'models/product.model';

const pageSize = 10;

type Props = {
  total: number;
  data: ProductModel[] | [];
  setWithdrawLists: React.Dispatch<
    React.SetStateAction<{ total: number; data: ProductModel[] | null }>
  >;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  setDataView: React.Dispatch<React.SetStateAction<ProductModel>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};

const TableComponent = (props: Props) => {
  const { data, total, setWithdrawLists, setIsView, setDataView, loading, setLoading } = props;

  const { langLabel, langCode, t } = useLanguage();
  const router = useRouter();

  const onFetchWithdraw = useCallback(async () => {
    try {
      setLoading?.(true);

      const page = Number(router.query.page ?? 1);

      const queryParams = {
        start_date: router.query.start_date ? router.query.start_date.toString() : undefined,
        end_date: router.query.end_date ? router.query.end_date.toString() : undefined,
        status: router.query.status ? router.query.status : undefined,
      };

      await sellerServices
        .getWithdraw(pageSize, (page - 1) * pageSize, queryParams)
        .then(({ data, total }) => setWithdrawLists({ total, data }));

      setLoading?.(false);
    } catch (error: any) {
      setLoading?.(false);
      if ((error as AxiosError)?.response?.status === 400 && Object.keys(router.query).length) {
        message.destroy();
        router.replace({ query: undefined }, undefined, { shallow: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, setLoading, setWithdrawLists]);

  useEffect(() => {
    onFetchWithdraw();
  }, [onFetchWithdraw]);

  const columns: ColumnsType<ProductModel> = [
    {
      title: langLabel.number_id,
      dataIndex: 'order_no',
    },
    {
      title: langLabel.created_date,
      dataIndex: 'createdAt',
      render: (value) => <Moment date={value} langCode={langCode} />,
    },
    {
      title: langLabel.account_name,
      dataIndex: 'account_name',
    },
    {
      title: langLabel.account_number,
      dataIndex: 'card_number',
    },
    {
      title: langLabel.swift_code,
      dataIndex: 'swift_code',
    },
    {
      title: langLabel.amount,
      dataIndex: 'amount',
      render: (value) => formatNumber(value, '$'),
    },
    {
      title: langLabel.status,
      dataIndex: 'status',
      render: (value) => {
        if (value === 1) {
          return <Badge color={'#52C41A'} text={t('success')} />;
        } else if (value === 2) {
          return <Badge color={'#F5222D'} text={t('failure')} />;
        } else if (value === 3) {
          return (
            <Badge color={'#FA8C16'} text={t('dashboard_withdraw_filter_order_status_pending')} />
          );
        } else return null;
      },
    },
    {
      title: langLabel.action,
      dataIndex: 'action',
      className: 'action-column',
      align: 'center',
      render: (_, record: any) => {
        if (router)
          return (
            <Icon
              onClick={() => {
                if (router.query.id) {
                  router.replace(`/${langCode}${urlPage.dashboard_withdraw}`, undefined, {
                    shallow: true,
                  });
                }
                setIsView(true);
                setDataView(record);
              }}
              iconName='seller-eye'
            />
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
      rowKey='id'
      columns={columns}
      isPagination={true}
      data={data}
    />
  );
};

export default memo(TableComponent);
