import styled from 'styled-components';

export const ShowroomCardWrapper = styled.div`
  .content {
    margin-top: 32px;
  }

  .card__vip,
  .banner {
    .note {
      h3 {
        font-weight: 500;
        font-size: 20px;
        color: var(--color-gray-11);
        margin-bottom: 4px;
      }

      ul {
        padding-left: 20px;
        margin-left: 5px;

        li {
          list-style-type: disc;
          color: var(--color-gray-9);
          font-size: 14px;
        }
      }

      h4 {
        margin-top: 16px;
        font-weight: 500;
        font-size: 16px;
        color: var(--color-gray-9);
        margin-bottom: 8px;
      }
    }

    .required {
      margin-top: 16px;
      font-size: 14px;
      color: var(--color-red-6);
    }

    .btn__action {
      margin-top: 32px;
      min-width: 213px;
      height: 48px;
    }
  }
`;
