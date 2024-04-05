import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import useLanguage from 'hooks/useLanguage';
import dayjs from 'dayjs';

import FilterFragments, { FilterItem } from '../Fragments/HeaderTable';
import TableComponent from './Table';

import { TypeFilter } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import * as L from './style';
import cleanObject from 'functions/cleanObject';

const ModelsComponent = () => {
  const router = useRouter();
  const { langLabel, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [sellerLists, setSellerLists] = useState<{ total: number; data: ProductModel[] | null }>({
    data: null,
    total: 0,
  });

  const onFilter = ({ type, value }: { type: TypeFilter; value: any }) => {
    let query = { ...router.query };
    query.page = '1';

    if (type === 'date') {
      query.start_date = value && Array.isArray(value) ? value[0]?.format() : null;
      query.end_date = value && Array.isArray(value) ? value[1]?.format() : null;
    } else if (type === 'sort') query.sort_by = value;
    else query[type] = value;

    router.push({ query: cleanObject(query) }, undefined, { shallow: true });
  };

  const filterLists: FilterItem[] = [
    {
      placeholder: langLabel.sort_by,
      values: [
        { value: 'price-desc_nulls_last', label: langLabel.sort_price_high_to_low },
        { value: 'price-asc_nulls_first', label: langLabel.sort_price_low_to_high },
        { value: 'publish_date-desc_nulls_last', label: langLabel.sort_published_date_latest },
        { value: 'publish_date-asc_nulls_last', label: langLabel.sort_published_date_oldest },
      ],
      type: 'sort',
      data: function () {
        const value = router.query.sort_by?.toString();
        if (this.values?.some((i) => i.value === value)) return value;
        else if (value) return t('invalid_value');
        else return undefined;
      },
      style: { width: 170 },
    },
    {
      placeholder: langLabel.dashboard_product_status,
      values: [
        { value: 7, label: langLabel.hide },
        { value: 5, label: langLabel.draft },
        { value: 1, label: langLabel.published },
      ],
      type: 'status',
      data: function () {
        const value = Number(router.query.status) || router.query.status;
        if (this.values?.some((i) => i.value === value)) return value;
        else if (value) return t('invalid_value');
        else return undefined;
      },
      style: { width: 130 },
    },
  ];

  return (
    <L.Models_wrapper>
      <FilterFragments
        uploadName={
          <Link href='/upload-model/new'>{langLabel.btn_upload_model || 'Upload 3D model'}</Link>
        }
        totalLabel={
          sellerLists.total <= 1 && sellerLists.total !== 0
            ? langLabel.dashboard_total_model
            : langLabel.dashboard_total_models
        }
        totalData={sellerLists.total}
        searchType='name'
        placeholderSearch={langLabel.dashboard_model_search_placeholder}
        isFilterDate
        isLine
        filterLists={filterLists}
        onFilter={onFilter}
        dataRangePicker={
          router.query.start_date && router.query.end_date
            ? [dayjs(router.query.start_date.toString()), dayjs(router.query.end_date.toString())]
            : undefined
        }
        valueSearch={router.query.name?.toString()}
      />

      <TableComponent
        total={sellerLists.total}
        data={sellerLists.data ?? []}
        setSellerLists={setSellerLists}
        setLoading={setLoading}
        loading={loading}
      />
    </L.Models_wrapper>
  );
};

export default ModelsComponent;
