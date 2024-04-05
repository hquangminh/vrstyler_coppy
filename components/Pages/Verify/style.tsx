import styled from 'styled-components';

export const VerifyAccount__Wrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  padding: 20rem 0;
  text-align: center;

  .VerifyAccount__Content {
    width: 100%;
    max-width: 460px;
  }
  .VerifyAccount__IconSucceeded,
  .VerifyAccount__IconFaild {
    font-size: 90px;
    margin-top: 5rem;
  }
  .VerifyAccount__Title {
    font-size: 32px;
    font-weight: 600;
    color: var(--color-primary-700);
    &.--error {
      color: var(--color-red-6);
    }
  }
  .VerifyAccount__Caption {
    margin-top: 5rem;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-caption);

    span {
      font-weight: 500;
    }
  }
  .VerifyAccount__BtnGroup {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    margin-top: 5rem;

    .ant-btn {
      margin-top: 0;
    }
    .VerifyAccount__BtnClose {
      color: var(--color-primary-700);
      border-color: var(--color-primary-700);
    }
  }
  .ant-btn {
    width: 100%;
    height: 4.2rem;
    font-weight: 600;
  }
  .VerifyAccount__BtnVerify,
  .VerifyAccount__BtnClose {
    margin-top: 5rem;
  }
`;
