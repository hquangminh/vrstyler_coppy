import { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';

import { AxiosError } from 'axios';
import { ColumnsType } from 'antd/es/table';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { avtDefault } from 'common/constant';
import sellerServices from 'services/seller-services';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import CalculateReviews from 'components/Fragments/CalculateReviews';
import TableFragment from '../Fragments/Table';
import onCheckProductBrandCategory from '../Fragments/onCheckProductBrandCategory';

import { ReviewModel } from 'models/seller.model';

const pageSize = 10;

type Props = {
  total: number;
  data: ReviewModel[] | null;
  setModalLists: React.Dispatch<
    React.SetStateAction<{ isShow: boolean; data: ReviewModel | null }>
  >;
  setReviewLists: React.Dispatch<
    React.SetStateAction<{ total: number; data: ReviewModel[] | null }>
  >;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
};

const TableComponent = (props: Props) => {
  const { total, data, setModalLists, setReviewLists, setLoading, loading } = props;
  const { langCode, langLabel } = useLanguage();

  const router = useRouter();

  const onFetchReview = useCallback(async () => {
    try {
      setLoading?.(true);

      const page = Number(router.query.page ?? 1);

      const queryParams = {
        start_date: router.query.start_date ? router.query.start_date.toString() : undefined,
        end_date: router.query.end_date ? router.query.end_date.toString() : undefined,
        rate: router.query.rate ? router.query.rate : undefined,
        item_id: router.query.item_id ? router.query.item_id : undefined,
        is_replied: router.query.is_replied ? router.query.is_replied : undefined,
      };

      await sellerServices
        .getReviews(pageSize, (page - 1) * pageSize, queryParams)
        .then(({ data, total }) => setReviewLists({ total, data }));

      setLoading?.(false);
    } catch (error: any) {
      setLoading?.(false);
      if ((error as AxiosError)?.response?.status === 400 && Object.keys(router.query).length) {
        message.destroy();
        router.replace({ query: undefined }, undefined, { shallow: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, setLoading, setReviewLists]);

  useEffect(() => {
    onFetchReview();
  }, [onFetchReview]);

  const columns: ColumnsType<ReviewModel> = [
    {
      title: langLabel.image,
      dataIndex: 'image',
      key: 'image',
      width: 110,
      responsive: ['md'],
      render: (_, record) => (
        <Link href={onCheckProductBrandCategory(record.market_item).link}>
          <MyImage
            className='img'
            src={record.market_item.image}
            alt='Product Image'
            width={74.5}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        </Link>
      ),
    },
    {
      title: langLabel.product_name,
      dataIndex: 'product_name',
      key: 'product_name',
      className: 'product__title',
      width: '30%',
      render: (_, record) => (
        <Link href={onCheckProductBrandCategory(record.market_item).link}>
          {record.market_item.title}
        </Link>
      ),
    },
    {
      title: langLabel.review,
      dataIndex: 'rate',
      key: 'rate',
      responsive: ['md'],
      render: (value) => <CalculateReviews value={value} />,
    },
    {
      title: langLabel.reviewed_by,
      dataIndex: 'review_by',
      key: 'review_by',
      responsive: ['md'],
      render: (_, record) => (
        <div className='buyer__column'>
          <MyImage
            src={record.market_user.image}
            img_error={avtDefault}
            width={24}
            height={24}
            alt='Avatar'
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          {record.market_user.name}
        </div>
      ),
    },
    {
      title: langLabel.reviewed_date,
      dataIndex: 'createdAt',
      key: 'createAt',
      render: (value) => <Moment date={value} langCode={langCode} />,
    },

    {
      title: langLabel.action,
      dataIndex: 'action',
      className: 'action-column',
      align: 'center',
      render: (_, record) => (
        <Icon
          onClick={() =>
            setModalLists({
              isShow: true,
              data: {
                ...record,
                content: record.content
                  ? record.content.replaceAll('\n', '<br/>')
                  : `${langLabel.no_content}`,
              },
            })
          }
          iconName='seller-eye'
        />
      ),
    },
  ];

  return (
    <TableFragment
      columns={columns}
      total={total}
      pageSize={pageSize}
      loading={loading}
      rowKey='id'
      data={data}
      isPagination={true}
    />
  );
};

export default memo(TableComponent);
