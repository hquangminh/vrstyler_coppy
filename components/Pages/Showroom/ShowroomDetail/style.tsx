import styled from 'styled-components';
import { minMedia } from 'styles/__media';

export const ShowroomDetailComponent_wrapper = styled.div`
  position: relative;

  &.is__preview::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .custom__product--card {
    background-color: var(--color-gray-3);
  }

  .custom__breadcrumb {
    padding: 30px 0;

    li:last-child {
      color: var(--color-primary-700);
      font-weight: 500;
    }
  }
`;

export const AllProductsComponent_wrapper = styled.div`
  padding: 24px 0 32px 0;

  .ProductList__Grid {
    @media screen and (min-width: 1441px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
  }

  .explore-layout {
    padding: 0;
    gap: 71px;
  }

  .product_name a {
    color: var(--color-gray-9);
  }

  ${minMedia.custom(1441)} {
    .ProductList__Grid {
      gap: 20px;
    }
  }
`;

export const ViewComponent_wrapper = styled.div<{ isPreview?: boolean }>`
  padding: 24px 0 32px 0;

  .ant-spin-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .custom__product--card {
    pointer-events: ${(props) => (props.isPreview ? 'none' : 'auto')};
  }

  .big__banner {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;
