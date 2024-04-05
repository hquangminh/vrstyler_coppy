import { memo, useEffect, useState } from 'react';
import Link from 'next/link';

import { ColumnsType } from 'antd/es/table';
import { Rate } from 'antd';

import showNotification from 'common/functions/showNotification';
import sellerServices from 'services/seller-services';
import useLanguage from 'hooks/useLanguage';

import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import TableFragment from '../Fragments/Table';
import onCheckProductBrandCategory from '../Fragments/onCheckProductBrandCategory';

import { ReviewModel } from 'models/seller.model';

import * as L from './style';

const TableComponent = () => {
  const { langCode, langLabel } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [latestReview, setLatestReview] = useState<ReviewModel[] | null>(null);

  useEffect(() => {
    const onFetchLatestReview = async () => {
      try {
        const resp = await sellerServices.getLatestReview(5);

        if (!resp.error) {
          setLatestReview(resp.data.market_reviews);
          setLoading(false);
        }
      } catch (error: any) {
        setLoading(false);
        showNotification('error', {
          key: 'latest_review',
          message: 'Latest review failed',
          description: error.data?.message,
        });
      }
    };
    onFetchLatestReview();
  }, []);

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
            width={74.5}
            height={56}
            alt=''
            style={{ objectFit: 'cover', borderRadius: 5 }}
          />
        </Link>
      ),
    },
    {
      title: langLabel.product_name,
      dataIndex: 'productName',
      key: 'productName',
      className: 'text-truncate',
      width: '40%',
      responsive: ['md'],
      render: (_, record) => (
        <Link href={onCheckProductBrandCategory(record.market_item).link}>
          {record.market_item.title}
        </Link>
      ),
    },
    {
      title: langLabel.reviewed_date,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => <Moment date={value} langCode={langCode} />,
    },
    {
      title: langLabel.reviewed_by,
      key: 'reviewBy',
      dataIndex: 'reviewBy',
      responsive: ['md'],
      render: (_, record) => (
        <div className='reivewby__column'>
          <MyImage
            src={record.market_user?.image || ''}
            img_error='/static/images/avatar-default.png'
            alt=''
            width={24}
            height={24}
            style={{ borderRadius: '50%' }}
          />

          <span className='review_by_title text-truncate'>{record.market_user.name} </span>
        </div>
      ),
    },
    {
      title: langLabel.review,
      key: 'rate',
      dataIndex: 'rate',
      responsive: ['md'],
      render: (value) => <Rate defaultValue={value} disabled={true} />,
    },
  ];

  return (
    <L.Table__wrapper>
      <h3 className='title'>{langLabel.latest_review}</h3>

      <TableFragment
        rowKey='id'
        columns={columns}
        loading={loading}
        isPagination={false}
        data={latestReview}
      />
    </L.Table__wrapper>
  );
};

export default memo(TableComponent);
