import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import { Skeleton, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import urlPage from 'constants/url.constant';

import useLanguage from 'hooks/useLanguage';

import { formatNumber } from 'common/functions';
import showNotification from 'common/functions/showNotification';

import { SelectAuthInfo } from 'store/reducer/auth';
import sellerServices from 'services/seller-services';

import Icon from 'components/Fragments/Icons';
import FilterFragments from '../Fragments/HeaderTable';
import ChartComponent from './Chart';
import TableComponent from './Table';

import { TotalAmountType } from 'models/seller.model';
import { UserType } from 'models/user.models';

import * as L from './style';

const DashboardComponent = () => {
  const { langLabel, t } = useLanguage();
  const userInfo = useSelector(SelectAuthInfo);

  const [loading, setLoading] = useState(true);
  const [totalLists, setTotalLists] = useState<TotalAmountType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerServices.getTotalAmount();

        if (!resp.error) {
          setTotalLists(resp.data);
          setLoading(false);
        }
      } catch (error: any) {
        showNotification('error', {
          key: 'total_failed',
          message: 'Total amount failed',
          description: error.data?.message,
        });
        setLoading(false);
      }
    })();
  }, []);

  return (
    <L.DashboardComponent_wrapper>
      <Skeleton loading={loading}>
        <FilterFragments
          uploadName={
            userInfo?.type !== UserType.VRSTYLER ? (
              <Link href='/withdraw'>{t('btn_withdraw_money')}</Link>
            ) : undefined
          }
          totalLabel={t('dashboard_general_revenue_total', 'Total revenue') + ': {{total}}'}
          totalData={formatNumber(totalLists?.total ?? 0, '$')}
        />

        <L.TotalDate>
          <div className='table_wrapper'>
            <table>
              <tbody>
                <tr className='header'>
                  <th>
                    <div>
                      <p style={{ color: '#2f54eb' }}>{langLabel.dashboard_balance_available}</p>
                    </div>
                    <div className='body'> {formatNumber(totalLists?.available ?? 0, '$')}</div>
                  </th>
                  <th>
                    <div className='link_wrapper'>
                      <p style={{ color: '#faad14' }}>{langLabel.dashboard_balance_pending}</p>
                      <Tooltip
                        overlayStyle={{
                          width: '192px',
                        }}
                        title={t('dashboard_balance_pending_tooltip')}
                        placement='bottom'>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </div>
                    <div className='body'> {formatNumber(totalLists?.holding ?? 0, '$')}</div>
                  </th>
                  <th>
                    <div className='link_wrapper'>
                      <p style={{ color: '#fa541c', paddingRight: '10px' }}>
                        {langLabel.dashboard_withdraw_request}
                      </p>
                      {userInfo?.type !== UserType.VRSTYLER && (
                        <Link
                          className='link'
                          href={{ pathname: urlPage.dashboard_withdraw, query: { status: 3 } }}
                          shallow>
                          <Icon iconName='link-dashboard-seller' />
                        </Link>
                      )}
                    </div>
                    <div className='body'> {formatNumber(totalLists?.request ?? 0, '$')}</div>
                  </th>
                  <th>
                    <div className='link_wrapper'>
                      <p style={{ color: '#52c41a', paddingRight: '10px' }}>
                        {langLabel.withdraw_title}
                      </p>
                      {userInfo?.type !== UserType.VRSTYLER && (
                        <Link
                          className='link'
                          href={{ pathname: urlPage.dashboard_withdraw, query: { status: 1 } }}
                          shallow>
                          <Icon iconName='link-dashboard-seller' />
                        </Link>
                      )}
                    </div>
                    <div className='body'>{formatNumber(totalLists?.withdraw ?? 0, '$')}</div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='table_wrapper-two'>
            <table className='header_two'>
              <thead>
                <tr>
                  <th>
                    <div>
                      <p>{langLabel.today}</p>
                      <Link
                        href={{
                          pathname: urlPage.dashboard_order,
                          query: { start_date: dayjs().format(), end_date: dayjs().format() },
                        }}
                        shallow>
                        <Icon className='link' iconName='link-dashboard-seller' />
                      </Link>
                    </div>
                    <div className='body'>
                      {formatNumber(
                        totalLists?.total_amount_day.aggregate.sum.total_earn ?? 0,
                        '$'
                      )}
                    </div>
                  </th>
                  <th>
                    <div>
                      <p>{langLabel.current_month}</p>
                      <Link
                        href={{
                          pathname: urlPage.dashboard_order,
                          query: {
                            start_date: dayjs().startOf('month').format(),
                            end_date: dayjs().endOf('month').format(),
                          },
                        }}
                        shallow>
                        <Icon className='link' iconName='link-dashboard-seller' />
                      </Link>
                    </div>
                    <div className='body'>
                      {formatNumber(
                        totalLists?.total_amount_month.aggregate.sum.total_earn ?? 0,
                        '$'
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </L.TotalDate>

        <div className='chart__box'>
          <ChartComponent />
        </div>

        <TableComponent />
      </Skeleton>
    </L.DashboardComponent_wrapper>
  );
};

export default DashboardComponent;
