import { useState } from 'react';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

import useLanguage from 'hooks/useLanguage';

import FilterFragments from '../Fragments/HeaderTable';
import TableComponent from './Table';

import { TypeFilter } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import * as L from './style';

dayjs.extend(weekday);
dayjs.extend(localeData);

const OrderSoldComponent = () => {
  const router = useRouter();
  const { langLabel, t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);

  const [orders, setOrders] = useState<{ data: ProductModel[] | null; total: number }>({
    data: null,
    total: 0,
  });

  const filterLists = [
    {
      placeholder: langLabel.dashboard_order_status,
      values: [
        { value: 'false', label: t('dashboard_order_unchecked', 'Unchecked') },
        { value: 'true', label: t('dashboard_order_checked', 'Checked') },
      ],
      type: 'order_status',
      data: function () {
        if (router.query.order_status) {
          if (this.values?.some((i) => i.value === router.query.order_status))
            return router.query.order_status;
          return t('invalid_value');
        } else return undefined;
      },
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
    <L.ProductInteraction>
      <FilterFragments
        totalData={orders.total}
        totalLabel={
          orders.total <= 1 && orders.total !== 0
            ? langLabel.dashboard_total_order
            : langLabel.dashboard_total_orders
        }
        isFilterDate
        dataRangePicker={
          router.query.start_date && router.query.end_date
            ? [dayjs(router.query.start_date as string), dayjs(router.query.end_date as string)]
            : undefined
        }
        isLine
        filterLists={filterLists}
        onFilter={onFilter}
      />

      <TableComponent
        total={orders.total}
        data={orders.data ?? []}
        setOrders={setOrders}
        setLoading={setLoading}
        loading={loading}
      />
    </L.ProductInteraction>
  );
};

export default OrderSoldComponent;
