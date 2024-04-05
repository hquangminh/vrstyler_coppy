import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Login_Wrapper = styled.div`
  padding: 15rem 0 5rem;
  position: relative;
  background-color: var(--color-gray-1);
  border-radius: 5px;

  ${maxMedia.medium} {
    min-height: auto;
  }
`;

export const Login_Form = styled.div`
  max-width: 420px;
  margin: 0 auto;
  flex: 1;

  .title__wrapper {
    margin-bottom: 5rem;
    text-align: center;

    h1 {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: 1.44px;
      color: var(--color-primary-700);
    }
  }

  .subtitle {
    font-size: 14px;
    line-height: 1.8rem;
    color: #434343;
    text-transform: capitalize;
  }

  .ant-form-item + .ant-form-item {
    margin-top: 2rem;
  }

  .ant-form-item-control-input-content {
    .ant-input {
      height: 38px;
    }
  }

  .ant-form-item-label label {
    color: #434343;
  }

  .ant-input,
  .ant-input-affix-wrapper > input.ant-input {
    border-radius: var(--border-radius-base);
    &:hover,
    &:focus {
      border-color: var(--color-main-6);
    }
  }

  .ant-input-affix-wrapper {
    height: 38px;

    .ant-input {
      height: initial;
    }
  }

  .ant-checkbox-checked {
    &::after {
      border: none;
    }
    .ant-checkbox-inner {
      background-color: var(--color-main-6);
    }
  }

  .remember_forgotPW {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 0.8rem;

    .rememberAcount {
      span:last-child {
        font-size: 14px;
        line-height: 1.5;
        color: var(--color-gray-7);
      }

      a {
        font-size: 14px;
        color: var(--color-main-6);
      }
    }

    &.accept__terms {
      justify-content: center;
    }

    .forgotPW {
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-main-6);
      cursor: pointer;
    }
  }

  .btn_login {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: 38px;
    margin-top: 1.7rem;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.57;
  }

  .no-account,
  .have-account,
  .back-login {
    margin-top: 17px;
    font-size: 16px;
    font-weight: 300;
    line-height: 1.5;
    color: #a3a3a3;
    text-align: center;

    span {
      color: var(--color-main-6);
      cursor: pointer;
    }
  }

  .back-login {
    font-weight: 400;
    text-align: right;
    span {
      color: var(--color-gray-8);
    }

    ${maxMedia.medium} {
      text-align: center;
    }
  }

  .ant-tooltip {
    max-width: 410px;
    .ant-tooltip-inner {
      font-weight: 300;
      background-color: var(--color-gray-9);
    }

    ${maxMedia.xsmall} {
      max-width: 280px;
    }
  }

  ${maxMedia.small} {
    max-width: initial;
  }
`;
