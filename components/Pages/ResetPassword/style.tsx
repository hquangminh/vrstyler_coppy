import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const ResetPass_wrapper = styled.div`
  .title__wrapper {
    margin-bottom: 3rem;
  }

  p {
    margin: 10rem 0;
    font-size: 1.6rem;
    line-height: 2.4rem;
    text-align: center;

    span {
      font-weight: 600;
      color: var(--color-gray-11);
    }
  }

  .ant-form-item {
    margin-bottom: 3rem;
  }
`;

export const ResetPasswordResult__Wrapper = styled.div`
  flex: 1;
  max-width: 54.6rem;
  margin: 0 auto;
  color: var(--text-title);
  text-align: center;

  & > .my-icon {
    font-size: 80px;
    margin: 5rem 0 2.6rem;
  }

  .wrapper {
    padding: 0 5.4rem;
  }

  .checkoutResult {
    &_title {
      font-size: 32px;
      line-height: 1.3;
      font-weight: 500;
      color: var(--color-main-6);
      letter-spacing: 1.44px;
    }
    &_subTitle {
      font-size: 16px;
      font-weight: 600;
    }
    &_caption {
      margin-top: 1.5rem;

      font-size: 14px;
    }
    &_btnGroup {
      display: flex;
      justify-content: center;
      gap: 1rem;

      margin-top: 30px;

      .ant-btn {
        height: 42px;
        width: 160px;

        font-weight: 600;
      }

      &_backHome {
        color: var(--color-primary-700);
        border-color: var(--color-primary-700);
      }
    }
  }

  ${maxMedia.small} {
    max-width: 100%;
    padding: 0 2rem;

    .wrapper {
      padding: 0;
    }

    & > .my-icon {
      margin-top: 20px;
      margin-bottom: 30px;
    }

    .checkoutResult_btnGroup {
      margin-top: 20px;
    }
  }
`;
