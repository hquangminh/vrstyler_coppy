import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const DashboardComponent_wrapper = styled.div`
  .chart__box {
    margin: 44px 0px 54px 0;
  }
`;

export const TotalDate = styled.div`
  .table_wrapper {
    padding: 32px 0;
    border: 1px solid var(--color-gray-4);
    table {
      width: 100%;
      text-align: left;
      table-layout: fixed;
      border: 0;
    }
  }
  .anticon-info-circle {
    color: var(--color-gray-7);
    font-size: 20px;
  }
  th {
    padding: 0 32px;
    border-right: 1px solid var(--color-gray-4);
    ${maxMedia.medium} {
      display: inline-block;
      padding: 5px;
      width: 100%;
    }
  }

  td {
    padding: 20px;
  }

  .header {
    height: 84px;
    div {
      position: relative;
    }

    p {
      color: var(--text-title);
      font-size: 16px;
      font-weight: 500;
      display: inline;
    }
    .link_wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .link {
      cursor: pointer;
      font-size: 13px;
      color: #303030;
      font-weight: 500;
      text-decoration: underline;
      svg {
        width: 24px;
        height: 24px;
        color: var(--color-gray-7);
      }
      ${maxMedia.small} {
        position: initial;
      }
    }
  }

  .table_wrapper-two {
    border: 1px solid var(--color-gray-4);
    margin-top: 24px;
    padding: 32px 0;
    table {
      width: 100%;
      text-align: center;
      table-layout: fixed;
      border: 0;
    }
  }
  .header_two {
    height: 84px;
    div {
      position: relative;
    }
    .link {
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      font-size: 13px;
      color: #303030;
      font-weight: 500;
      text-decoration: underline;
      svg {
        width: 24px;
        height: 24px;
        color: var(--color-gray-7);
      }

      ${maxMedia.small} {
        position: initial;
        margin-top: 15px;
      }
    }

    p {
      color: var(--color-gray-11);
      font-size: 14px;
      font-weight: 500;
    }
  }

  .body {
    padding-top: 12px;
    color: #303030;
    font-size: 32px;
    font-weight: 500;
    ${maxMedia.small} {
      padding-top: 0;
    }
  }
`;

export const Table__wrapper = styled.div`
  .title {
    font-size: 18px;
    color: var(--text-title);
    font-weight: 500;
    margin-bottom: 15px;
  }

  .reivewby__column {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    line-height: 20px;
    color: #303030;

    .ant-avatar {
      color: #303030;
      flex-shrink: 0;
    }
    .review_by_title {
      font-size: 14px;
    }
  }

  table {
    border: 0 !important;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding: 16px 16px;
  }

  .ant-table-thead {
    .ant-table-cell {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-gray-11);
    }
    tr {
      border-bottom: 1px solid red;

      td {
        border-bottom: 1px solid #f0f0f0;
      }

      th {
        background-color: #fff !important;
        border: 0;
        border-bottom: 1px solid #f0f0f0;

        &::before {
          content: none;
          display: none;
        }
      }
    }
  }
`;
