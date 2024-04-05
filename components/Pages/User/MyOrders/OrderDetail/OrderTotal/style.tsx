import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const OrderTotal_wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 35px 40px;
  background-color: #f6f7f8;

  ${maxMedia.small} {
    grid-template-columns: 100%;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
      font-size: 12px;
      color: var(--color-gray-9);

      span {
        color: var(--color-gray-11);
        font-weight: 500;
      }
    }
  }

  .total__price {
    min-width: 372px;
  }

  .total__table {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .table__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    &:not(:last-child) {
      padding-bottom: 1.4rem;
      border-bottom: 1px solid var(--color-gray-6);
    }

    h4,
    p {
      font-size: 16px;
      line-height: 1;
      color: var(--color-gray-9);
    }

    h4 {
      color: var(--color-gray-11);
      font-weight: 500;
      white-space: nowrap;
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
        font-size: 18px;
        font-weight: 500;
        color: var(--color-red-6);
      }
    }

    &--payment {
      p {
        display: inline-flex;
        align-items: center;
        gap: 5px;

        .my-icon {
          svg {
            height: 16px;
            width: auto;
          }

          &.visa {
            color: #1a2adf;
          }
        }
        span:not(class) {
          line-height: 1;
        }
      }
    }
  }

  .total__btn {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
    margin-top: 34px;

    button {
      min-width: 164px;
      height: 37px;
      border-color: var(--color-main-6);
      font-weight: 600;
    }

    .btn__left {
      color: var(--color-main-6);
    }
    .btn__right {
      &.hover,
      &.active {
        color: #fff;
      }
    }
  }

  ${maxMedia.medium} {
    flex-direction: column;
    padding: 35px 20px;
    gap: 24px;

    .total__price {
      min-width: initial;
    }
  }

  ${maxMedia.medium} {
    padding-bottom: 30px;
  }
`;
