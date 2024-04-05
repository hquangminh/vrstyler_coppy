import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Suggested_wrapper = styled.div`
  text-align: center;

  .title {
    margin-bottom: 20px;
    font-size: 20px;
    letter-spacing: 1.1px;
    color: #0a0a0a;
    font-weight: 600;
  }

  .btn__load {
    min-width: 300px;
    min-height: 42px;
    margin: 30px auto 0;
    font-size: 14px;
    line-height: 22px;
    color: #fff;
    font-weight: 600;
  }

  ${maxMedia.medium} {
    .btn__load {
      display: none;
    }

    .title {
      margin-bottom: 30px;
    }
  }
`;

export const Grid_wrapper = styled.div`
  ${maxMedia.medium} {
    display: flex;
    grid-template-columns: initial;
    margin: 0 -20px;
    padding: 0 20px;
    overflow: scroll hidden;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .product__card--item {
      width: 295px;
      flex-shrink: 0;
    }

    .product_content {
      min-height: initial;
    }
  }
`;
