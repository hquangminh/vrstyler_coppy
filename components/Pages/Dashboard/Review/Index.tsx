import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import { App } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';

import { deleteItemInObject } from 'common/functions';
import cleanObject from 'functions/cleanObject';

import sellerServices from 'services/seller-services';
import reviewServices from 'services/review-services';

import FilterFragments from '../Fragments/HeaderTable';
import TableComponent from './Table';
import ModalComponent from './Modal';

import { ReviewModel, TypeFilter } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import * as L from './style';

const pageSize = 10;

const ReviewComponent = () => {
  const router = useRouter();
  const { message: messageApp } = App.useApp();
  const { langLabel, t } = useLanguage();

  const [modalLists, setModalLists] = useState<{ isShow: boolean; data: ReviewModel | null }>({
    isShow: false,
    data: null,
  });
  const [reviewLists, setReviewLists] = useState<{ total: number; data: ReviewModel[] | null }>({
    total: 0,
    data: null,
  });
  const [pageProduct, setPageProduct] = useState(1);
  const [filterProduct, setFilterProduct] = useState({ name: '' });
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [loadingOption, setLoadingOption] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productLists, setProductLists] = useState<{
    total: number;
    data: { value: string; label: string }[] | null;
  }>({
    total: 0,
    data: null,
  });

  const selectRef = useRef<any>(null);

  const onCheckViewDetail = useCallback(() => {
    if (router.query.view) {
      reviewServices
        .getReviewDetail(router.query.view.toString())
        .then(({ data }) => setModalLists({ isShow: true, data }))
        .catch(() => {
          message.destroy();
          messageApp.error(t('dashboard_review_not_found_title'));

          const queryCleaned = cleanObject({ ...router.query, view: undefined });
          router.replace({ query: queryCleaned }, undefined, { shallow: true });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.view]);

  useEffect(() => {
    onCheckViewDetail();
  }, [onCheckViewDetail]);

  const onFilter = ({ type, value }: { type: TypeFilter; value: any }) => {
    setProductLists((prevState) => ({ ...prevState, isLoad: false }));
    setPageProduct(1);
    let query = { ...router.query };
    query.page = '1';

    if (type === 'date') {
      query.start_date = value && Array.isArray(value) ? value[0]?.format() : null;
      query.end_date = value && Array.isArray(value) ? value[1]?.format() : null;
    } else query[type] = value;

    router.push({ pathname: router.pathname, query: cleanObject(query) }, undefined, {
      shallow: true,
    });
  };

  const onFetchSellerProduct = async (body?: { name: string }) => {
    setLoadingOption(true);
    try {
      const resp = await sellerServices.searchMyModes(pageSize, 0, body ?? null);

      if (!resp.error) {
        setProductLists((prevState) => ({
          ...prevState,
          total: resp.total,
          data: resp.data?.map((item: ProductModel) => ({ value: item.id, label: item.title })),
        }));
        setLoadingOption(false);
        selectRef?.current?.scrollTo(0, 0);
      }
    } catch (error: any) {
      setLoadingOption(false);
    }
  };

  const onScroll = async (e: any) => {
    if ((productLists.data?.length || 0) >= productLists.total || loadingLoad) return;

    e.persist();
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setPageProduct((prevState) => prevState + 1);
    }
  };

  const onFetchSellerProductLoad = useCallback(
    async (body?: { name: string }) => {
      setLoadingLoad(true);
      try {
        const resp = await sellerServices.searchMyModes(
          pageSize,
          (pageProduct - 1) * pageSize,
          body ?? null
        );
        if (!resp.error && resp.data?.length) {
          setProductLists((prevState) => ({
            total: resp.total,
            data: prevState.data
              ? [
                  ...prevState.data,
                  ...resp.data?.map((item: ProductModel) => ({
                    value: item.id,
                    label: item.title,
                  })),
                ]
              : resp.data?.map((item: ProductModel) => ({ value: item.id, label: item.title })),
          }));
        }
        setLoadingLoad(false);
      } catch (error) {
        setLoadingLoad(false);
      }
    },
    [pageProduct]
  );

  const onSearch = (value: string) => {
    if (value.trim() !== filterProduct.name) {
      setFilterProduct({ name: value.trim() });
      setPageProduct(1);
    }
  };

  const onClear = () => {
    setFilterProduct({ name: '' });
  };

  useEffect(() => {
    if (pageProduct === 1) return;
    onFetchSellerProductLoad();
  }, [onFetchSellerProductLoad, pageProduct]);

  useEffect(() => {
    if (Object.getOwnPropertyNames(deleteItemInObject(filterProduct)).length !== 0) {
      onFetchSellerProduct(filterProduct);
      return;
    }
    onFetchSellerProduct();
  }, [filterProduct]);

  const filterLists = [
    {
      placeholder: langLabel.filter_by || 'Filter by',
      values: [
        { value: 'true', label: langLabel.reply },
        { value: 'false', label: langLabel.unreply },
      ],
      type: 'is_replied',
      data: function () {
        const value = router.query.is_replied;
        if (this.values?.some((i) => i.value === value)) return value;
        else if (value) return t('invalid_value');
        else return undefined;
      },
    },
    {
      placeholder: langLabel.dashboard_review_point_filter_placeholder,
      values: [
        { value: 1, label: '1 star' },
        { value: 2, label: '2 stars' },
        { value: 3, label: '3 stars' },
        { value: 4, label: '4 stars' },
        { value: 5, label: '5 stars' },
      ],
      type: 'rate',
      data: function () {
        const value = Number(router.query.rate) || router.query.rate;
        if (this.values?.some((i) => i.value === value)) return value;
        else if (value) return t('invalid_value');
        else return undefined;
      },
    },
    {
      placeholder: langLabel.dashboard_review_product_filter_placeholder,
      values: productLists.data ?? [],
      type: 'item_id',
      data: function () {
        const value = router.query.item_id;
        if (this.values?.some((i) => i.value === value)) return value;
        else if (this.values.length > 0 && value) return t('invalid_value');
        else return undefined;
      },
      total: productLists.total - (productLists.data?.length ?? 0),
      selectType: 'search',
      onScroll,
      onSearch,
      onClear,
      selectRef,
      loadingLoad,
      loadingOption,
    },
  ];

  return (
    <L.ReviewComponent_wrapper>
      <FilterFragments
        totalData={reviewLists.total}
        totalLabel={
          reviewLists.total <= 1 && reviewLists.total !== 0
            ? langLabel.dashboard_total_review
            : langLabel.dashboard_total_reviews
        }
        isFilterDate
        isLine
        placeholderSearch='Search your product'
        filterLists={filterLists}
        onFilter={onFilter}
        dataRangePicker={
          router.query.start_date && router.query.end_date
            ? [dayjs(router.query.start_date as string), dayjs(router.query.end_date as string)]
            : undefined
        }
      />

      <TableComponent
        total={reviewLists.total}
        data={reviewLists.data}
        setModalLists={setModalLists}
        setReviewLists={setReviewLists}
        setLoading={setLoading}
        loading={loading}
      />

      <ModalComponent
        modalLists={modalLists}
        setModalLists={setModalLists}
        setReviewLists={setReviewLists}
      />
    </L.ReviewComponent_wrapper>
  );
};

export default ReviewComponent;
