import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const ExploreFilterPanelWrapper = styled.section<{ height: number }>`
  width: 100%;
  /* max-height: ${({ height }) => height}px; */
  overflow-y: auto;

  position: sticky;
  top: 60px;
  z-index: 99;
  align-self: start;

  ${maxMedia.custom(800)} {
    width: 100%;
    max-height: unset;
    position: unset;
  }

  .explore-filter-panel-btn-reset {
    margin-top: 16px;
    width: 100%;
    height: 41px;
    font-weight: 500;
  }

  .ant-radio-wrapper {
    color: var(--color-gray-7);
    font-weight: 300;
  }
  .ant-radio-wrapper-checked {
    color: var(--color-primary-500);
  }

  .ant-checkbox-wrapper {
    color: var(--color-gray-7);
    font-weight: 300;
    &-checked > span:not([class]) {
      color: var(--color-primary-500);
    }
  }

  .ant-collapse {
    background-color: inherit;
    .ant-collapse-item {
      padding: 16px 0;
      border-bottom: var(--border-1px);
    }
    .ant-collapse-header {
      padding: 0;

      font-size: 18px;
      color: var(--text-title);

      .ant-collapse-expand-icon {
        color: var(--color-gray-7);
        .ant-collapse-arrow {
          right: 0;
        }
      }
    }
    .ant-collapse-content {
      padding-top: 16px;
      overflow-wrap: anywhere;
      .ant-collapse-content-box {
        padding: 0;
        max-height: 230px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-track {
          background: #ffffff;
        }
        &::-webkit-scrollbar-thumb {
          background: var(--color-gray-4);
          border-radius: 4px;
        }

        ${maxMedia.custom(1023)} {
          max-height: 150px;
          overflow-y: auto;
        }
      }
    }

    .ant-collapse-item.--price .ant-collapse-content .ant-collapse-content-box {
      max-height: unset;
      overflow: unset;
    }
  }
`;

export const ExploreFilterPanelItem = styled.div`
  padding: 16px 0;
  border-bottom: var(--border-1px);

  .ant-input-affix-wrapper {
    padding-left: 0;
    &:focus-within {
      box-shadow: none;
    }
  }
`;

export const ExploreFilterBrands = styled.div``;
