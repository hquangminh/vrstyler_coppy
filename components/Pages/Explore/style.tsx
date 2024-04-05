import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Wrapper = styled.main`
  padding-bottom: 100px;

  .loading-first {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-drawer-header-title {
    flex-direction: row-reverse;
    align-items: center;
    .ant-drawer-close {
      margin-right: 0;
      margin-left: 20px;
    }
  }
  .ant-drawer-content {
    padding-bottom: 80px;
    .ant-drawer-body {
      padding: 0 20px;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: #ffffff;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--color-gray-6);
        border-radius: 4px;
      }
    }
  }
`;

export const Explore__Pagination = styled.div`
  margin-top: 30px;
  .ant-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Explore__Layout = styled.div`
  .explore-layout {
    display: grid;
    grid-template-columns: 270px auto;
    grid-template-columns: 270px minmax(10px, 1fr);
    /* display: flex;
    justify-content: flex-end; */
    gap: 56px;

    ${maxMedia.custom(1023)} {
      grid-template-columns: 200px minmax(10px, 1fr);
    }

    ${maxMedia.custom(800)} {
      display: block;
    }
  }
`;

export const Explore__ButtonFilter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;

  display: flex;
  gap: 16px;

  padding: 16px 20px;
  width: 100%;
  background-color: #fff;

  .ant-btn {
    flex: auto;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
  }
  .explore-btn-reset {
    color: var(--color-red-6);
    &:hover {
      color: var(--color-red-6);
    }
  }
  .explore-btn-open-close-panel {
    color: #fff;
    border: none;
    background-color: var(--color-primary-500);
    &:hover {
      color: #fff;
    }
  }
`;

// export const FlashDeal__Wrapper = styled.div`
//   margin-top: 20px;
// `;
