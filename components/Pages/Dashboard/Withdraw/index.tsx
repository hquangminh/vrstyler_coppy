import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import dayjs from 'dayjs';
import { App } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import cleanObject from 'functions/cleanObject';
import sellerServices from 'services/seller-services';

import FilterFragments from '../Fragments/HeaderTable';
import Action from './Action';
import TableComponent from './Table';

import { TypeFilter } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import * as L from './style';

const WithdrawComponent = () => {
  const router = useRouter();
  const { langLabel, t } = useLanguage();
  const { message: messageApp } = App.useApp();

  const [isView, setIsView] = useState<boolean>(false);
  const [dataView, setDataView] = useState<ProductModel | {}>({});
  const [loading, setLoading] = useState(true);

  const [withdrawLists, setWithdrawLists] = useState<{
    total: number;
    data: ProductModel[] | null;
  }>({ total: 0, data: null });

  const onFetchWithdrawDetail = useCallback(async () => {
    const withdrawID = router.query.id?.toString();
    if (withdrawID)
      await sellerServices
        .getWithdrawDetail(withdrawID)
        .then(({ data }) => {
          setIsView(true);
          setDataView(data);
        })
        .catch(() => {
          message.destroy();
          messageApp.error(langLabel.dashboard_withdraw_not_found_title);

          const queryCleaned = cleanObject({ ...router.query, id: undefined });
          router.replace({ query: queryCleaned }, undefined, { shallow: true });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  useEffect(() => {
    onFetchWithdrawDetail();
  }, [onFetchWithdrawDetail]);

  const filterLists = [
    {
      placeholder: langLabel.sort_by,
      values: [
        { value: 1, label: langLabel.success },
        { value: 2, label: langLabel.failure },
        { value: 3, label: langLabel.dashboard_withdraw_filter_order_status_pending },
      ],
      data: function () {
        const value = Number(router.query.status) || router.query.status;
        if (this.values?.some((i) => i.value === value)) return value;
        else if (value) return t('invalid_value');
        else return undefined;
      },
      type: 'status',
    },
  ];

  const onFilter = ({ type, value }: { type: TypeFilter; value: any }) => {
    let query = { ...router.query };
    query.page = '1';

    if (type === 'date') {
      query.start_date = value && Array.isArray(value) ? value[0]?.format() : null;
      query.end_date = value && Array.isArray(value) ? value[1]?.format() : null;
    } else query[type] = value;

    query = Object.entries({ ...query }).reduce(
      (obj, item) => (item[1] ? Object.assign(obj, { [item[0]]: item[1] }) : obj),
      {}
    );
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return (
    <L.WithdrawMoney>
      <FilterFragments
        uploadName={<Link href='/withdraw'>{t('btn_withdraw_money')}</Link>}
        totalData={withdrawLists.total}
        totalLabel={
          withdrawLists.total <= 1 && withdrawLists.total !== 0
            ? langLabel.dashboard_total_withdraw
            : langLabel.dashboard_total_withdraws
        }
        isFilterDate
        filterLists={filterLists}
        isLine
        onFilter={onFilter}
        dataRangePicker={
          router.query.start_date && router.query.end_date
            ? [dayjs(router.query.start_date.toString()), dayjs(router.query.end_date.toString())]
            : undefined
        }
      />

      <TableComponent
        total={withdrawLists.total}
        data={withdrawLists.data ?? []}
        setWithdrawLists={setWithdrawLists}
        setDataView={setDataView}
        setIsView={setIsView}
        setLoading={setLoading}
        loading={loading}
      />

      <Action isView={isView} setIsView={setIsView} data={dataView} />
    </L.WithdrawMoney>
  );
};

export default WithdrawComponent;
