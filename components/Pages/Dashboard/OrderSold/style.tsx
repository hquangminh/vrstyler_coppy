import styled from 'styled-components';

export const ProductInteraction = styled.div`
  .order__column {
    color: var(--text-caption);

    &:hover {
      text-decoration: underline;
      color: var(--color-primary-700);
    }

    &::before {
      transition: 0.1s;
    }

    &::before {
      display: block;
      content: attr(title);
      font-weight: bold;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }

  .buyer__column {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    line-height: 20px;

    .ant-avatar {
      color: #fa541c;

      span {
        font-size: 14px;
      }
    }
  }

  .sale__date__column {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
