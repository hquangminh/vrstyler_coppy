import styled from 'styled-components';

export const ShowroomCategory_Wrapper = styled.div`
  .header__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15.5px 0;

    border-bottom: 1px solid var(--color-gray-4);

    h3 {
      font-size: 24px;
      color: var(--color-gray-11);

      .total {
        font-weight: 600;
        color: var(--color-primary-700);
      }
    }

    .btn__group {
      display: flex;
      gap: 5px;
      align-items: center;

      button {
        min-height: 37px;
        font-weight: 500;
      }

      .btn__delete {
        background-color: var(--color-red-6);
        border: none;
      }
    }
  }
`;
