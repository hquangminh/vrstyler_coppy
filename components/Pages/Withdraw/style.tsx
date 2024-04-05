import styled from 'styled-components';

export const Withdraw_wrapper = styled.main`
  min-height: 100vh;
  padding: 35px 0;

  background-image: url('/static/images/checkout/background-top.png'),
    url('/static/images/checkout/background-bottom.png');
  background-repeat: no-repeat;
  background-position: top left, bottom right;
  background-size: 26.613vw auto, 28.82vw auto;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;

    .ant-input-number-status-error {
      &,
      &:focus {
        border-color: initial !important;
        border-inline-end-width: 0 !important;
        box-shadow: initial !important;

        &.ant-input-number-input {
          border-color: #ff4d4f;
          box-shadow: 0 0 0 2px rgba(11, 99, 86, 0.16);
        }
      }
      .ant-input-number-input {
        border-color: #ff4d4f;

        &:focus {
          border-color: #ff4d4f;
        }
      }
    }

    .ant-input-number-input {
      padding-right: 90px;
      height: 40px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border: 1px solid #d9d9d9;

      &:focus {
        border-color: #57aeb3;
        box-shadow: 0 0 0 2px rgba(11, 99, 86, 0.16);
      }
    }

    .ant-input {
      height: 40px;
    }

    .ant-input-affix-wrapper {
      height: 40px;
      .ant-input {
        height: initial;
      }
    }

    label {
      font-size: 14px;
      color: var(--text-title);
      font-weight: 500;
    }
  }

  .note {
    padding: 0 5px;
    font-size: 14px;
    color: var(--color-red-7);
    .ant-badge-status-error {
      margin-right: 5px;
      background-color: var(--color-red-7);
      width: 2px;
      height: 2px;
    }
  }

  .btn__submit,
  .btn__cancel {
    height: 41px;
    margin: 0 10px;
    margin-top: 32px;
    min-width: 147px;
    border-radius: 4px;
    font-weight: 500;
  }

  .btn__cancel {
    background: var(--color-gray-7);
    color: #fff;
  }

  .btn__withdraw--group {
    .ant-input-number-group-wrapper {
      position: relative;
    }

    .ant-input-number {
      border-top-right-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
      border-width: 0;
    }

    .ant-input-number-group-addon {
      background: transparent;

      &:first-child {
        padding: 0 15px;
      }

      &:last-child {
        padding: 0;
        border: none;

        .btn__draw {
          box-shadow: none;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          height: 40px;
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 1;
          background: transparent;
          color: var(--color-primary-700);
          border: 0;
          font-weight: 500;

          &.disable {
            cursor: initial;
          }

          &.ant-tooltip-disabled-compatible-wrapper {
            display: flex !important;
            padding: 0 !important;
          }
        }
      }
    }
  }
`;
