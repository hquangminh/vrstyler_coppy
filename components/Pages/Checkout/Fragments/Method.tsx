import { PaymentElement } from '@stripe/react-stripe-js';
import { Radio } from 'antd';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  /* eslint-disable no-unused-vars */
  method?: 'stripe' | 'paypal';
  onChangeMethod: (method: 'stripe' | 'paypal') => void;
  onStripeLoaded: () => void;
};

export const CheckoutMethod = (props: Props) => {
  const { method, onChangeMethod, onStripeLoaded } = props;
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <div className='checkout-section-header'>
        <h4>{langLabel.payment_method}</h4>
        <div className='checkout-method-commit'>
          {langLabel.checkout_secure_connection} <Icon iconName='lock-fill' />
        </div>
      </div>

      <div className='checkout-method-option'>
        <Radio
          value='stripe'
          checked={method === 'stripe'}
          onChange={() => onChangeMethod('stripe')}>
          <span className='d-flex align-items-center'>
            {langLabel.checkout_credit_method} <Icon iconName='stripe-text' />
          </span>
        </Radio>
        {method === 'stripe' && <PaymentElement onReady={onStripeLoaded} />}
        <Radio
          value='paypal'
          checked={method === 'paypal'}
          onChange={() => onChangeMethod('paypal')}>
          <Icon iconName='paypal-text' />
        </Radio>
        {method === 'paypal' && (
          <div className='checkout-method-option-content'>
            {langLabel.checkout_paypal_method_caption}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
export default CheckoutMethod;

const Wrapper = styled.div`
  margin-bottom: 20px;

  .checkout-method-option {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    border: solid 1px var(--color-gray-5);

    ${maxMedia.small} {
      margin-top: 10px;
    }

    .ant-radio-wrapper {
      margin-right: 0;
      padding: 15px 10px;

      font-size: 14px;
      font-weight: 500;
      color: var(--text-caption);
      background-color: var(--color-gray-3);
      &:first-child {
        border-bottom: solid 1px var(--color-gray-5);
      }
      & > span:not([class]) {
        display: flex;
        span {
          gap: 4px;
        }
      }
      .my-icon.stripe-text {
        font-size: 42px;
        width: auto;
      }
      .my-icon.paypal-text {
        height: 42px;
        svg {
          height: 16px;
          width: auto;
        }
      }
    }
  }
  .checkout-method-option-content {
    padding: 20px;
    font-size: 14px;
    border-top: solid 1px var(--color-gray-5);
  }
  .StripeElement {
    padding: 30px 20px;
    border-bottom: solid 1px var(--color-gray-5);
  }
`;
