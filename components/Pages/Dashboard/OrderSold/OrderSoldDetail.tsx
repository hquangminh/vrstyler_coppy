import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { Button, ConfigProvider, Flex, Result, Spin, Table, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

import useLanguage from 'hooks/useLanguage';
import { dateFormat } from 'lib/helpers/formatDate';
import { message } from 'lib/utils/message';
import urlPage from 'constants/url.constant';
import { formatNumber } from 'common/functions';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import sellerServices from 'services/seller-services';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';
import HeaderPage from 'components/Pages/User/Fragments/HeaderPage';

import { SellerOrder } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import styled from 'styled-components';

const OrderSoldDetail = ({ orderID }: { orderID?: string }) => {
  const { langCode, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<SellerOrder | null>(null);

  const onFetchOrderDetail = useCallback(async () => {
    if (orderID) {
      setLoading(true);
      await sellerServices
        .getOrderDetail(orderID)
        .then(({ data }) => setOrderDetail(data))
        .catch(() => message.destroy())
        .finally(() => setLoading(false));
    }
  }, [orderID]);

  useEffect(() => {
    onFetchOrderDetail();
  }, [onFetchOrderDetail]);

  if (loading)
    return (
      <Flex justify='center' align='center' style={{ height: 500 }}>
        <Spin />
      </Flex>
    );
  else if (!orderDetail)
    return (
      <Result
        status='404'
        title='Oops!'
        subTitle={t('modeling_order_not_found_title')}
        extra={
          <Button type='primary'>
            <Link href={`/${langCode}${urlPage.dashboard_order}`}>Back orders</Link>
          </Button>
        }
      />
    );

  const products =
    orderDetail.market_items_boughts ??
    orderDetail.market_order.market_items_boughts_aggregate.nodes;
  const isCheckShowIconSort = orderDetail && !isArrayEmpty(products);

  const columns: ColumnsType<ProductModel> = [
    {
      title: t('image'),
      dataIndex: 'image',
      key: 'image',
      width: 110,
      render: (image) => (
        <MyImage
          className='img'
          src={image}
          alt=''
          width={74.5}
          height={56}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: t('product_name'),
      dataIndex: 'title',
      key: 'title',
      className: 'product__title',
      sorter: isCheckShowIconSort ? (a, b) => a.title.localeCompare(b.title) : undefined,
      showSorterTooltip: false,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      sorter: isCheckShowIconSort ? (a, b) => a.price - b.price : undefined,
      showSorterTooltip: false,
      render: (price) => formatNumber(price, '$'),
    },
  ];

  const total =
    orderDetail.subtotal ??
    orderDetail.market_order.market_items_boughts_aggregate.aggregate.sum.price;
  const fee =
    orderDetail.fee ??
    orderDetail.market_order.market_items_boughts_aggregate.aggregate.sum.price -
      orderDetail.market_order.market_items_boughts_aggregate.aggregate.sum.total_earn;
  const earn =
    orderDetail.total_earn ??
    orderDetail.market_order.market_items_boughts_aggregate.aggregate.sum.total_earn;

  return (
    <OrderSoldDetailWrapper>
      <HeaderPage className='header-page' title={t('my_profile_order_detail_title')} isBack />

      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: '#e3e3e8',
              cellPaddingInline: 12,
              headerBg: '#f4f5f8',
              footerBg: 'transparent',
            },
          },
          token: { borderRadius: 0, fontWeightStrong: 400 },
        }}>
        <Table
          rowKey='id'
          columns={columns}
          loading={loading}
          dataSource={products}
          scroll={{ x: orderDetail ? 992 : undefined }}
          pagination={false}
          title={() => (
            <Header
              order_no={orderDetail.market_order.order_no}
              createdAt={orderDetail.market_order.createdAt}
              totalProduct={products.length}
            />
          )}
          footer={() => (
            <Footer
              total={total}
              fee={fee}
              earn={earn}
              paygate={orderDetail.market_order.paygate}
            />
          )}
        />
      </ConfigProvider>
    </OrderSoldDetailWrapper>
  );
};

const Header = (props: { order_no: string; createdAt: string; totalProduct: number }) => {
  const { langCode, t } = useLanguage();
  return (
    <HeaderWrapper>
      <Icon iconName='order' />
      <Flex vertical gap={2}>
        <Flex gap={20}>
          <p>
            <span>{t('order_id')}: </span>
            <span>#{props.order_no}</span>
          </p>
          <p>
            <span>{t('date')}: </span>
            {dateFormat(props.createdAt, langCode)}
          </p>
        </Flex>
        <p>
          <span>{t('amount')}: </span>
          {props.totalProduct}
        </p>
      </Flex>
    </HeaderWrapper>
  );
};

const Footer = (props: { total: number; fee: number; earn: number; paygate: string }) => {
  const { t } = useLanguage();
  return (
    <TotalOrderWrapper>
      <div className='total__table'>
        <div className='table__item'>
          <h4>{t('total') || 'Total'}</h4>
          <p>{formatNumber(props.total, '$')}</p>
        </div>

        <div className='table__item table__item--payment'>
          <h4>{t('paygate')}</h4>
          <p>
            <span className='title__icon-wrapper'>
              {props.paygate === 'paypal' && 'Paypal'}
              {props.paygate === 'stripe' && 'Stripe'}
            </span>
          </p>
        </div>

        <div className='table__item'>
          <h4>
            {t('fee', 'Fee')}
            <Tooltip
              title={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('dashboard_order_fee_tooltip').replace(
                      '{{link}}',
                      'http://vrstyler.com/help-center/faqs--f0f08e59-645f-42bb-8608-8f814a70e438/how-much-do-user-have-to-pay-for-the-purchasesoldwithdrawal-costs-on-vrstyler--6056650c-8266-4393-8ecd-7a3bdbee2389'
                    ),
                  }}
                />
              }>
              <InfoCircleOutlined />
            </Tooltip>
          </h4>
          <p>
            {props.fee > 0 ? '- ' : ''}
            {formatNumber(props.fee, '$')}
          </p>
        </div>

        <div className='table__item table__item--amount'>
          <h4>{t('dashboard_order_revenue_label', 'Order revenue')}</h4>
          <p>{formatNumber(props.earn, '$')}</p>
        </div>
      </div>
    </TotalOrderWrapper>
  );
};

const OrderSoldDetailWrapper = styled.div`
  .header-page {
    padding-block: 24px;
  }
  .ant-table {
    .ant-table-title,
    .ant-table-footer {
      padding: 12px 24px;
    }
    .ant-table-title {
      background-color: #fbffff;
    }
    .ant-table-footer {
      padding-block: 24px;
    }
    .ant-table-title,
    .ant-table-container {
      border: 1px solid #e3e3e8;
    }
    .ant-table-container {
      border-block-width: 0;
    }
    .ant-table-cell {
      padding: 16px 12px;

      .img {
        border-radius: 4px;
      }
    }
  }
  .product__title {
    line-height: inherit;
  }
`;
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .my-icon {
    font-size: 24px;
    color: var(--color-primary-700);
  }

  p {
    font-size: 12px;

    span {
      color: var(--text-title);
      font-weight: 500;
      & + span {
        font-size: 400;
        color: var(--color-primary-700, #369ca5);
      }
    }
  }
`;
const TotalOrderWrapper = styled.div`
  min-width: 372px;

  width: fit-content;
  margin-left: auto;

  .total__table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .table__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    &:not(:last-child) {
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-gray-4);
    }

    h4,
    p {
      font-size: 14px;
      line-height: 1;
      color: var(--color-gray-9);
    }

    h4 {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--color-gray-11);
      font-weight: normal;
      white-space: nowrap;
      .anticon {
        color: #8c8c8c;
      }
    }

    &--coupons {
      p {
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0.77px;
      }
    }

    &--amount {
      h4 {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      p {
        font-size: 16px;
        font-weight: 500;
        color: #ce3c5c;
      }
    }
  }
`;

export default OrderSoldDetail;
