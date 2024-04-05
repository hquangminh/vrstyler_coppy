import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const BestSeller_wrapper = styled.section`
  padding: 100px 0 50px;

  ${maxMedia.small} {
    padding: 50px 0;
  }

  .product_list_scroll {
    overflow-x: auto;

    ${maxMedia.medium} {
      margin: 0 -20px;
    }
  }

  .btn__explore {
    display: block;
    width: 212px;
    height: 50px;
    margin: 60px auto 0;
    font-size: 14px;
    font-weight: 600;
    &.a {
      &.hover,
      &.active {
        color: #fff;
      }
    }

    ${maxMedia.small} {
      margin-top: 30px;
    }
  }
`;

export const Tabs_wrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 4rem;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 7.3rem;
    list-style: none;
    overflow-x: auto;
    ${maxMedia.xsmall} {
      justify-content: space-between;
    }
  }
  li {
    font-size: 14px;
    line-height: 1.57;
    color: var(--color-gray-7);

    cursor: pointer;

    &.--active {
      font-weight: 600;
      color: var(--color-primary-700);
    }

    ${maxMedia.xsmall} {
      flex: none;
    }
  }
`;

export const Grid_wrapper = styled.div<{ $itemCount: number }>`
  min-height: 20rem;
  overflow: hidden;

  & > div {
    min-width: 40%;
  }

  ${maxMedia.medium} {
    grid-template-columns: repeat(${(props) => props.$itemCount}, 354px);
    gap: 20px;
    width: max-content;
    padding: 0 20px;
  }
`;
