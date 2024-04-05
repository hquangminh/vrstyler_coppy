import styled from 'styled-components';

export const ScreenShot_wrapper = styled.div<{ aspect?: number }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  aspect-ratio: ${({ aspect }) => aspect};

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .dots__fake {
    position: absolute;
    bottom: 12px;
    display: flex;
    gap: 10px;
    justify-content: center;
    width: 100%;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-gray-6);

      &.active {
        background: var(--color-gray-4);
      }
    }
  }

  .product__lists {
    .title {
      margin-bottom: 4px;
      font-size: 24px;
      color: var(--color-gray-13);
    }

    .inner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
  }
`;
