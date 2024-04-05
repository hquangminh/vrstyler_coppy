import styled from 'styled-components';
import { ChangeRemMobileToPC, maxMedia } from 'styles/__media';

export const Wrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

export const SearchBox = styled.div`
  height: 60px;

  border: var(--border-1px);

  .box-search_content {
    display: flex;
    align-items: center;

    height: 100%;
  }

  .ant-input {
    height: 100%;
  }
`;

export const BtnIcon = styled.div`
  display: inline-flex;
  cursor: pointer;

  .my-icon {
    font-size: 20px;
    color: var(--color-gray-7);
  }
`;

export const SearchExpand = styled.div`
  flex: auto;
  overflow-y: auto;
`;

export const SearchRecommend = styled.ul`
  list-style: none;

  ${maxMedia.xsmall} {
    margin-top: ${ChangeRemMobileToPC('xsmall', 3)};
  }

  li {
    padding: 10px 0;

    ${maxMedia.xsmall} {
      padding: 0;

      & + li {
        margin-top: 10px;
      }
    }

    a {
      font-size: 16px;
      line-height: 1.5;
      color: var(--color-gray-8);

      ${maxMedia.xsmall} {
        font-size: ${ChangeRemMobileToPC('xsmall', 1.2)};
        line-height: 1.71;
      }

      span.hl {
        font-weight: 600;
        color: var(--color-gray-10);
      }
    }
  }
`;

export const SearchPopular = styled.div`
  padding-top: 5rem;

  ${maxMedia.xsmall} {
    padding-top: 3rem;
  }

  h4 {
    font-size: 3.2rem;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0.96px;
    color: var(--color-gray-11);

    ${maxMedia.xsmall} {
      font-size: 2.4rem;
      line-height: 1.67;
      letter-spacing: 0.72px;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem 1.5rem;

    margin-top: 3rem;

    ${maxMedia.xsmall} {
      gap: 2rem 1rem;

      margin-top: 2rem;
    }

    .tag-item {
      height: 4.2rem;
      padding: 0 1rem;

      font-size: 1.4rem;
      line-height: 1.57;
      color: var(--color-gray-9);
      border-radius: var(--border-radius-base);
      background-color: var(--color-main-1);

      ${maxMedia.xsmall} {
        font-size: ${ChangeRemMobileToPC('xsmall', 1.2)};
      }
    }
  }
`;
