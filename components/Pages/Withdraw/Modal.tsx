import { memo, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Modal } from 'antd';

import { formatNumber, handlerMessage } from 'common/functions';
import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';

import sellerServices from 'services/seller-services';

import { ParamWithdraw } from 'models/seller.model';

import styled from 'styled-components';

type Props = {
  data: ParamWithdraw | null;
  isShow: boolean;
  setModalLists: React.Dispatch<
    React.SetStateAction<{ isShow: boolean; data: ParamWithdraw | null }>
  >;
};

const ModalComponent = (props: Props) => {
  const { data, isShow, setModalLists } = props;
  const router = useRouter();
  const { langCode, t } = useLanguage();

  const [loading, setLoading] = useState(false);

  const onFetchCreate = async () => {
    setLoading(true);
    try {
      const resp = await sellerServices.createWithdraw(data as ParamWithdraw);

      if (!resp.error) {
        router.push(`/${langCode}/dashboard/withdraw`);
        handlerMessage(t('withdraw_message_request_success'), 'success');
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response.data?.error_code === 'INSUFFICIENT_BALANCE') {
        router.push(urlPage.dashboard_withdraw);
      }
    }
  };
  const { langLabel } = useLanguage();

  return (
    <ModalComponent_wrapper id='modalComponentWrapper'>
      <Modal
        title={<h3>{langLabel.btn_preview || 'Preview'}</h3>}
        centered
        destroyOnClose={true}
        open={isShow}
        width={572}
        onCancel={() => setModalLists({ isShow: false, data: null })}
        getContainer={() => document.getElementById('modalComponentWrapper') || document.body}
        footer={
          <Button
            type='primary'
            className='btn__submit mt-0'
            loading={loading}
            onClick={onFetchCreate}>
            {langLabel.btn_submit || 'Submit'}
          </Button>
        }>
        <div className='inner'>
          <div className='box'>
            <h4 className='title__small'>{langLabel.bank_name}</h4>
            <p className='description'>{data?.bank_name}</p>
          </div>
          <div className='box'>
            <h4 className='title__small'>{langLabel.swift_code}</h4>
            <p className='description'>{data?.swift_code}</p>
          </div>
          <div className='box'>
            <h4 className='title__small'>{langLabel.account_name}</h4>
            <p className='description'>{data?.account_name}</p>
          </div>
          <div className='box'>
            <h4 className='title__small'> {langLabel.account_number}</h4>
            <p className='description'>{data?.card_number}</p>
          </div>
          <div className='box'>
            <h4 className='title__small'> {langLabel.amount}</h4>
            <p className='description'>{formatNumber(data?.amount || 0, '$')}</p>
          </div>
        </div>
      </Modal>
    </ModalComponent_wrapper>
  );
};

const ModalComponent_wrapper = styled.main`
  .ant-modal-title {
    h3 {
      font-size: 18px;
      font-weight: 500;
      line-height: normal;
    }
  }
  .inner {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .box {
      .title__small {
        font-size: 14px;
        color: var(--color-gray-7);
        margin-bottom: 3px;
        line-height: normal;
        font-weight: 400;
      }

      .description {
        font-size: 14px;
        color: var(--color-gray-9);
        font-weight: 500;
        line-height: normal;
      }
    }
  }
`;

export default memo(ModalComponent);
