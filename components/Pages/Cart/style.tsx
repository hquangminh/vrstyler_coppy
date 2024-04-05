import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Wrapper = styled.div`
  padding: 70px 0 50px;

  ${maxMedia.custom(768)} {
    padding-top: 30px;
  }

  .cart_header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    height: 46px;

    font-size: 16px;
    font-weight: 500;
    color: var(--text-title);
    background-color: var(--color-gray-3);

    border-radius: 2px;

    span {
      padding: 2px;
      border-radius: 3px;
      background-color: #ffc751;
      font-size: 14px;
      color: var(--text-caption);
    }
  }

  .loading {
    position: absolute;
    top: 10%;
    left: 48.8%;
  }
`;
export const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 30px;

  ${maxMedia.medium} {
    flex-direction: column;

    & > div {
      width: 100%;
    }
  }
`;
