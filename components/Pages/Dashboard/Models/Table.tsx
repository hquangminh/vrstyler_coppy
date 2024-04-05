import { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { AxiosError } from 'axios';
import { Badge, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import useLanguage from 'hooks/useLanguage';

import { decimalPrecision, formatNumber } from 'common/functions';
import capitalizeFirstLetter from 'common/functions/capitalizeFirstLetter';

import sellerServices from 'services/seller-services';
import { message } from 'lib/utils/message';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import onCheckProductBrandCategory from '../Fragments/onCheckProductBrandCategory';
import DashboardTooltip from '../Fragments/Tooltip';
import MenuAction from '../Fragments/MenuAction';
import TableFragment from '../Fragments/Table';

import { ProductModel } from 'models/product.model';

import * as L from './style';

type Props = {
  total: number;
  data: ProductModel[] | null;
  setSellerLists: any;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};

const pageSize = 10;

const TableComponent = (props: Props) => {
  const { total, data, setSellerLists, setLoading, loading } = props;
  const router = useRouter();

  const { langCode, langLabel, t } = useLanguage();

  const onFetchSellerProduct = useCallback(async () => {
    try {
      setLoading?.(true);

      const querySortBy = router.query.sort_by;
      const page = Number(router.query.page ?? 1);

      const queryParams = {
        status: router.query.status ? Number(router.query.status) : undefined,
        sort_type: router.query.sort_type,
        sort_by: router.query.sort_by,
        start_date: router.query.start_date?.toString(),
        end_date: router.query.end_date?.toString(),
        name: router.query.name?.toString().trim(),
      };

      if (querySortBy && typeof querySortBy === 'string') {
        queryParams.sort_by = querySortBy.split('-')[0];
        queryParams.sort_type = querySortBy.split('-')[1];
      }

      await sellerServices
        .getMyModes(pageSize, (page - 1) * pageSize, queryParams)
        .then(({ data, total }) => setSellerLists({ data, total }))
        .finally(() => setLoading?.(false));
    } catch (error: any) {
      setLoading?.(false);
      if ((error as AxiosError)?.response?.status === 400 && Object.keys(router.query).length) {
        message.destroy();
        router.replace({ query: undefined }, undefined, { shallow: true });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, setLoading, setSellerLists]);

  useEffect(() => {
    onFetchSellerProduct();
  }, [onFetchSellerProduct]);

  const renderReviews = (count: number, avg: number) => {
    const label = capitalizeFirstLetter(t('review'));
    const labels = capitalizeFirstLetter(t('reviews'));

    if (count) return `${count} ${count > 1 ? labels : label}: ${decimalPrecision(avg, 1)}/5`;
    else return count + ' ' + label;
  };

  const columns: ColumnsType<ProductModel> = [
    {
      title: langLabel.image,
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (value, record) => (
        <Link href={onCheckProductBrandCategory(record).link}>
          <MyImage
            className='img'
            src={value ?? ''}
            alt=''
            width={74.5}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        </Link>
      ),
    },
    {
      title: langLabel.product_name,
      dataIndex: 'title',
      key: 'title',
      className: 'Column__Product_Name',
      render: (value, record) => (
        <Link href={onCheckProductBrandCategory(record).link} title={value}>
          {value}
        </Link>
      ),
    },
    {
      title: langLabel.published_date,
      dataIndex: 'publish_date',
      key: 'publish_date',
      width: 150,
      render: (value) => (value ? <Moment date={value} langCode={langCode} /> : null),
    },
    {
      title: langLabel.status,
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        const { activeCategory, activeBrand } = onCheckProductBrandCategory(record);

        return (
          <>
            <div>
              {activeCategory && activeBrand && value === 1 && (
                <Tag className='status status-2'>{langLabel.published}</Tag>
              )}
              {value === 5 && <Tag className='status status-1'>{langLabel.draft}</Tag>}
              {(value === 7 || (value === 1 && (!activeCategory || !activeBrand))) && (
                <Tag className='status status-3'>{langLabel.hide}</Tag>
              )}
            </div>
            {!activeCategory && value !== 5 && (
              <div style={{ marginTop: '12px' }}>
                <Badge
                  color={'#FAAD14'}
                  text={t('dashboard_model_hidden_because_category_inactive_tooltip')}
                />
              </div>
            )}
            {!activeBrand && value !== 5 && (
              <div style={{ marginTop: '12px' }}>
                <Badge
                  color={'#FAAD14'}
                  text={t('dashboard_model_hidden_because_brand_inactive_tooltip')}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      title: langLabel.price,
      dataIndex: 'price',
      key: 'price',
      render: (value) => (value === 0 ? 'Free' : formatNumber(value, '$')),
    },
    {
      title: t('sold'),
      key: 'sold',
      render: (_, recode) => recode.market_items_boughts_aggregate?.aggregate.count,
    },
    {
      title: langLabel.interaction,
      key: 'interaction',
      width: 170,
      render: (_, record) => (
        <L.Reaction_wrapper>
          <DashboardTooltip
            title={
              record.like_count > 1
                ? `${record.like_count} ${capitalizeFirstLetter(t('likes'))}`
                : `${record.like_count} ${capitalizeFirstLetter(t('like'))}`
            }>
            <div>
              <Icon iconName='seller-like' />
            </div>
          </DashboardTooltip>

          <DashboardTooltip
            title={
              record.viewed_count > 1
                ? `${record.viewed_count} ${capitalizeFirstLetter(t('views'))}`
                : `${record.viewed_count} ${capitalizeFirstLetter(t('view'))}`
            }>
            <div>
              <Icon iconName='seller-eye' />
            </div>
          </DashboardTooltip>

          <DashboardTooltip
            title={renderReviews(
              record.summary_review.aggregate.count ?? 0,
              record.summary_review.aggregate.avg.rate ?? 0
            )}>
            <div>
              <Icon iconName='seller-star' />
            </div>
          </DashboardTooltip>

          <DashboardTooltip
            title={
              record.summary_comment.aggregate.count > 1
                ? `${record.summary_comment.aggregate.count} ${capitalizeFirstLetter(
                    t('comments')
                  )}`
                : `${record.summary_comment.aggregate.count} ${capitalizeFirstLetter(t('comment'))}`
            }>
            <div>
              <Icon iconName='seller-message' />
            </div>
          </DashboardTooltip>
        </L.Reaction_wrapper>
      ),
    },
    {
      title: langLabel.action,
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <L.MenuAction_wrapper>
            <MenuAction
              data={record}
              handleView={() => router.push(onCheckProductBrandCategory(record).link)}
              handleEdit={() => router.push(`/upload-model/${record.id}`)}
            />
          </L.MenuAction_wrapper>
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
