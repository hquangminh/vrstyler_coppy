import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/type';
import { CreateOrderActionRedux } from 'store/reducer/order';

import styled from 'styled-components';
import { Button, Input, message, Modal, ModalProps, Radio, Typography } from 'antd';

import orderServices from 'services/order-services';

const reasons = [
  'Want to change the product in the order',
  'See other models are better?',
  'The payment procedure is too complicated',
  'Find cheaper prices elsewhere',
  "Change my mind, Don't want to buy anymore.",
  'Other',
];

const ModalCancelOrder = () => {
  const dispatch = useDispatch();

  const [reason, setReason] = useState<string>('');
  const [reasonCustom, setReasonCustom] = useState<string>('');
  const [messValidate, setMessageValidate] = useState<string>('');

  const orderAction = useSelector((state: AppState) => state.order);

  useEffect(() => {
    setMessageValidate('');
  }, [orderAction?.type]);

  const onCancel = () => {
    dispatch(CreateOrderActionRedux({ type: null }));
  };

  const onOk = async () => {
    if (!reason) {
      setMessageValidate('Please choose a reason');
      return;
    }

    if (reason === 'Other' && !reasonCustom.trim()) {
      setMessageValidate('Please enter your reason for canceling your order');
      return;
    }

    try {
      const { error } = await orderServices.cancelOrder(
        orderAction?.order?.id || '',
        reason !== 'Other' ? reason : reasonCustom
      );
      if (!error) {
        dispatch(
          CreateOrderActionRedux({
            type: 'cancel-success',
            order: {
              ...orderAction?.order,
              id: orderAction?.order?.id || '',
              payment_note: reason !== 'Other' ? reason : reasonCustom,
            },
          })
        );
        message.success('Order has been successfully canceled');
      } else message.error('Failed order cancellation');
    } catch (error) {
      message.error('Failed order cancellation');
    }
  };

  const modalProps: ModalProps = {
    title: (
      <>
        Canceling order{' '}
        <span style={{ color: 'var(--color-primary-700)' }}>#{orderAction?.order?.order_no}</span>
      </>
    ),
    open: orderAction?.type === 'cancel',
    centered: true,
    width: 400,
    destroyOnClose: true,
    footer: (
      <CancelOrder__Btn>
        <Button shape='round' onClick={onOk}>
          Order Cancellation
        </Button>
        <Button type='primary' shape='round' onClick={onCancel}>
          Not now
        </Button>
      </CancelOrder__Btn>
    ),

    onCancel: onCancel,
  };

  return (
    <Modal {...modalProps}>
      <CancelOrder__Wrapper>
        <h3 className='title'>Choose a Reason to Cancel the Order</h3>

        <Radio.Group
          className='list__reason'
          onChange={(e) => {
            setMessageValidate('');
            setReason(e.target.value);
          }}>
          {reasons.map((item, index) => {
            return (
              <Radio key={index} value={item}>
                {item}
              </Radio>
            );
          })}
        </Radio.Group>

        {reason === 'Other' && (
          <Input.TextArea
            onChange={(e) => {
              e.target.value.trim() && setMessageValidate('');
              setReasonCustom(e.target.value);
            }}
          />
        )}

        {messValidate && <Typography.Text type='danger'>{messValidate}</Typography.Text>}
      </CancelOrder__Wrapper>
    </Modal>
  );
};

export default ModalCancelOrder;

const CancelOrder__Wrapper = styled.div`
  .title {
    font-size: 14px;
    letter-spacing: 0.5px;
    color: var(--color-primary-700);
    font-weight: 600;
  }
  .list__reason {
    margin-top: 20px;
    .ant-radio-wrapper {
      display: block;
      font-size: 13px;

      & + .ant-radio-wrapper {
        margin-top: 5px;
      }
    }
  }
  .ant-input {
    margin-top: 20px;
  }
  .ant-typography.ant-typography-danger {
    display: inline-block;
    margin-top: 10px;
    font-size: 12px;
    font-style: italic;
  }
`;
const CancelOrder__Btn = styled.div`
  padding: 5px 0;
  text-align: center;

  .ant-btn {
    min-width: 170px;
    height: 38px;
  }
`;
