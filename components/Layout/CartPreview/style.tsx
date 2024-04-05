import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const CartPreview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 40.6rem;
  height: 100%;
  position: relative;
  overflow: hidden;

  ${maxMedia.xsmall} {
    width: 100vw;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-bottom: var(--border-1px);
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  background-color: var(--color-gray-1);
  z-index: 1;

  h3 {
    font-size: 16px;
    text-align: center;
    color: var(--text-title);
    font-weight: 500;

    .Cart__Count {
      margin-left: 8px;
      padding: 2px;
      border-radius: 3px;
      background-color: #ffc751;
      font-size: 14px;
      color: var(--text-caption);
    }
  }

  .ant-badge-count {
    min-width: 1.4rem;
    margin-left: 0.7rem;
    border-radius: 0.3rem;
    color: var(--color-gray-1);
    background-color: var(--color-red-6);
    font-weight: 600;
  }

  .btn-close--mobile {
    display: none;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 10px;

    ${maxMedia.custom(640)} {
      display: inline-block;
    }

    svg {
      fill: var(--gray-2);
    }
  }
`;

export const Content = styled.div`
  flex: auto;
  overflow: hidden;
`;

export const CartEmpty = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductList = styled.div`
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const Checkout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  position: -webkit-sticky;
  bottom: 0;

  h4 {
    padding: 2rem;
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    color: var(--gray-2);
    border-top: var(--border-1px);

    span {
      font-size: 18px;
      line-height: 2.4rem;
      color: var(--color-red-6);
    }
  }

  .ant-btn {
    min-height: 56px;
    font-weight: 500;
    text-transform: uppercase;
    border: none;
    border-radius: 0;
    color: #fff !important;
  }
`;
