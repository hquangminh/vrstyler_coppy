import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Wrapper = styled.div`
  flex: auto;
  border: var(--border-1px);
`;
export const ProductItem = styled.div`
  &:not(:last-child) {
    border-bottom: var(--border-1px);
  }

  .Cart_Product_Container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px;

    & > div {
      display: flex;
      align-items: center;
      gap: 2rem;

      &:last-child {
        gap: 20px;
      }
    }
    a {
      flex: none;
    }
    img {
      border-radius: 4px;
      object-fit: cover;
      cursor: pointer;
      ${maxMedia.small} {
        width: 64px;
        height: 48px;
      }
    }
    h5 {
      margin-right: 8px;
      word-break: break-word;
      a {
        font-size: 15px;
        font-weight: 500;
        color: var(--text-caption);

        &:hover {
          color: var(--color-primary-700);
        }
      }
    }
    p {
      font-size: 16px;
      font-weight: 500;
      line-height: 1;
      color: var(--color-gray-8);
    }
    .product-actions {
      display: inline-flex;
      .my-icon {
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: var(--color-red-6);
        }
      }
    }

    &.unavailable {
      border-color: #d9d9d9;
      color: #ff4d4f;
      background-color: rgba(0, 0, 0, 0.04);
      opacity: 0.6;

      .text__unavailable {
        display: block;
        margin-top: 5px;
      }
    }
  }
`;
