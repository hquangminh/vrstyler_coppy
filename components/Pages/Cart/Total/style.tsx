import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const CartTotal_Wrapper = styled.div`
  width: 46rem;

  .cartTotal_btnPay {
    justify-content: center;
    width: 100%;
    height: 42px;
    margin-top: 14px;
    font-weight: 600;
  }

  .ant-typography.err__code {
    display: block;
    margin-top: 10px;
    font-size: 10px;

    &.err__payment {
      margin-top: -10px;
      font-size: 12px;
    }
  }
`;
export const CartTotal_Content = styled.div`
  padding: 0 15px 20px 15px;

  border: solid var(--color-line);
  border-width: 0 0.5px 0.5px;

  ${maxMedia.small} {
    padding: 0 15px 15px;
  }
`;
export const CartTotal_PriceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem 0;

  color: var(--text-title);

  border-top: 0.5px solid var(--color-line);

  &:first-child {
    border: none;
  }

  &.--total p:last-child {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-red-6);
  }

  p:first-child {
    font-size: 16px;
    color: var(--text-title);
  }
  p:last-child {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-gray-8);
  }
`;
export const CartTotal_Coupon = styled.div`
  padding: 1rem 0;

  border-top: 0.5px solid rgba(var(--color-line-rgb), 60%);

  .ant-checkbox-wrapper {
    user-select: none;

    span + span {
      font-size: 12px;
      color: var(--color-gray-7);
    }
  }
  .cartTotal_coupon_content {
    gap: 1rem;

    .cartTotal_coupon_input {
      margin-top: 10px;
      display: flex;
      gap: 10px;
      height: 33px;

      .ant-input {
        height: 100%;

        border: none;
        background-color: var(--color-main-1);
      }
      .ant-btn {
        height: 100%;
        padding: 0 18px;

        font-size: 14px;
        font-weight: 500;
        color: var(--text-caption);
        border: none;
        background-color: var(--color-yellow);

        &:disabled {
          opacity: 0.4;
        }
      }
    }
  }
`;

export const Cart_Information = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #303030;
  background-color: var(--color-primary-50);
`;

export const CurrentCoupon = styled.div`
  padding-top: 20px;
  padding-bottom: 10px;
  color: #303030;
  font-size: 14px;

  .anticon {
    color: #8c8c8c;
    position: relative;
    top: 2px;
    cursor: pointer;
    font-size: 16px;
  }

  .coupon__discount {
    font-weight: 500;
  }
`;
