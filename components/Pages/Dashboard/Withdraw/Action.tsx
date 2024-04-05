import { useRouter } from 'next/router';

import { Badge, Modal } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { formatNumber } from 'common/functions';

import Moment from 'components/Fragments/Moment';

import styled from 'styled-components';

type Props = {
  isView: boolean;
  setIsView: any;
  data: any;
};

const Action = (props: Props) => {
  const { isView, setIsView, data = {} } = props;
  const { langCode, langLabel, t } = useLanguage();
  const router = useRouter();

  const modalProps = {
    title: langLabel.detail_information,
    open: isView,
    centered: true,
    width: 572,
    footer: '',
    onCancel: () => {
      setIsView(false);
      if (router.query.id) {
        router.replace({ query: undefined }, undefined, { shallow: true });
      }
    },
  };

  return (
    <ActionWrapper {...modalProps}>
      <div className='box'>
        <div className='item'>
          <h5 className='title'>{langLabel.number_id}</h5>
          <p>{data?.order_no}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.bank_name}</h5>
          <p>{data?.bank_name}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.swift_code}</h5>
          <p>{data?.swift_code}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.account_name}</h5>
          <p>{data?.account_name}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.account_number}</h5>
          <p>{data?.card_number}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.amount}</h5>
          <p>{formatNumber(data?.amount, '$')}</p>
        </div>
        <div className='item'>
          <h5 className='title'>{langLabel.status}</h5>
          {data?.status === 1 && <Badge color={'#52C41A'} text={t('success')} />}
          {data?.status === 2 && <Badge color={'#F5222D'} text={t('failure')} />}
          {data?.status === 3 && (
            <Badge color={'#FA8C16'} text={t('dashboard_withdraw_filter_order_status_pending')} />
          )}
        </div>

        {data?.transaction_id && (
          <div className='item'>
            <div className='transaction_id'>
              <h5 className='title'>{langLabel.transaction_id}</h5>
              <p>{data?.transaction_id}</p>
            </div>
          </div>
        )}

        {data?.reason && (
          <div className='item'>
            <h5 className='title'>{t('reason')}</h5>
            <p>{data?.reason}</p>
          </div>
        )}

        {data?.updatedAt && (
          <div className='item'>
            <h5 className='title'>{t('updated_date')}</h5>
            {data?.updatedAt && (
              <p>
                <Moment date={data.updatedAt} langCode={langCode} showTime />
              </p>
            )}
          </div>
        )}

        {data?.status === 3 && (
          <div className='item'>
            <h5 className='title'>{t('created_date')}</h5>
            {data?.createdAt && (
              <p>
                <Moment date={data.createdAt} langCode={langCode} showTime />
              </p>
            )}
          </div>
        )}
      </div>
    </ActionWrapper>
  );
};

const ActionWrapper = styled(Modal)`
  .ant-modal-title {
    font-size: 18px;
    font-weight: 500;
  }

  .item {
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    .title {
      margin-bottom: 3px;
      font-weight: 400;
      font-size: 14px;
      color: var(--color-gray-7);
      line-height: normal;
    }

    p {
      font-weight: 500;
      font-size: 14px;
      color: #303030;
      line-height: normal;
    }
  }
`;

export default Action;
