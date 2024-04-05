import styled from 'styled-components';

export const Forgot_wrapper = styled.div`
  width: 100%;

  .btn_login {
    margin-top: 0;
  }

  .group__btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    a {
      color: #a3a3a3;
      font-size: 14px;
      line-height: 2.2rem;
      &:hover {
        color: var(--color-primary-700);
      }
    }
  }

  .back-login {
    text-align: initial;
    margin-top: 0;
  }
`;

export const SendToMail_Wrapper = styled.div`
  p {
    font-size: 16px;
    line-height: 24px;
    text-align: center;

    span {
      font-weight: 600;
      color: var(--color-gray-11);
    }
  }
  .btn_login {
    margin-top: 20px;
  }
`;
