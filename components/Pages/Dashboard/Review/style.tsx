import styled from 'styled-components';

export const ReviewComponent_wrapper = styled.div`
  .buyer__column {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    line-height: 20px;

    .ant-avatar {
      color: var(--color-gray-9);

      span {
        font-size: 14px;
      }
    }
  }

  .rate__column {
    .ant-rate {
      gap: 5px;
    }
  }

  .action-column {
    .my-icon {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .product__title {
    word-break: break-word;
    .ant-select-clear {
      &::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        width: 20px;
        height: 20px;
        background-color: #fff;
        z-index: -1;
      }
    }
  }
`;
