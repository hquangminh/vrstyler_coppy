import { createGlobalStyle, css } from 'styled-components';
import { pretendard } from '@/fonts';

const MyScrollbar = css`
  /* width */
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #ebecf0;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-6);
    border-radius: 3px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-gray-6);
    border-radius: 3px;
  }
`;

const GlobalCss = css`
  html {
    font-size: 62.5%; // 10px
    @media (max-width: 1024px) {
      font-size: 59.375%; // 9.5px
    }
    @media (max-width: 720px) {
      font-size: 53.125%; // 8.5px
    }
    @media (max-width: 640px) {
      font-size: 50%; // 8px
    }
    @media (max-width: 480px) {
      font-size: 43.75%; // 7px
    }
    @media (max-width: 360px) {
      font-size: 37.5%; // 6px
    }
  }

  body {
    width: 100% !important;

    font-family: ${pretendard.style.fontFamily}, var(--font-family-sans-serif);
    font-size: 1.4rem;
    line-height: 1.5714285714285714;

    overflow-x: hidden;
    overflow-y: auto;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  // prettier-ignore
  h1, h2, h3, h4, h5, h6, p, span, ul, li {
  margin: 0;
  padding: 0;
}

  * {
    margin: 0;
    padding: 0;
  }

  a:hover {
    color: currentColor;
    text-decoration: none;
  }

  [disabled] {
    pointer-events: none;
  }

  img {
    max-width: 100%;
    display: inline-block;
  }

  .text-truncate-line {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
  }

  .my-scrollbar {
    ${MyScrollbar}
  }

  // Seller Models fix scroll table when click show dropdown action
  .menu-action {
    .ant-dropdown-menu {
      .ant-dropdown-menu-item {
        font-weight: 500;
        color: var(--color-gray-7);
        &:not([aria-disabled='true']):hover {
          color: var(--color-primary-700);
        }
        &-disabled {
          opacity: 0.5;
        }

        .anticon {
          padding: 0;
          font-size: 14px;
          color: currentColor;

          svg {
            width: 1em;
            height: 1em;
          }
        }
      }
    }
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .scroll-disabled {
    overflow: hidden;
    touch-action: none;
  }
  .scrollbar-show-on-hover {
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 4px;
    }
    &:hover::-webkit-scrollbar-thumb {
      background: #ccc;
    }
  }

  .skeleton-background {
    background: var(--background-skeleton);
  }

  .skeleton-animation-1 {
    position: relative;
    overflow: hidden;
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 2s infinite;
      content: '';
    }
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  }
  .skeleton-animation-2 {
    position: relative;
    overflow: hidden;
    background: var(--background-skeleton);
    &::after {
      position: absolute;
      inset: 0 -150%;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        rgba(190, 190, 190, 0.2) 25%,
        rgba(129, 129, 129, 0.24) 37%,
        rgba(190, 190, 190, 0.2) 63%
      );
      animation: ant-skeleton-loading 1.4s ease infinite;
      content: '';
    }
  }

  //Product List
  .ProductList__Grid {
    display: grid;
    grid-template-columns: 100%;
    gap: 20px;

    @media screen and (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
    }
    @media screen and (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    @media screen and (min-width: 1441px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
    }
    @media screen and (min-width: 1921px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`;

const CustomAntDesignCss = css`
  /* Ant Typography */
  .ant-typography {
    i {
      font-style: italic;
    }
  }

  /* Ant Message */
  .ant-message {
  }

  /* Ant Menu */
  .ant-menu {
    .ant-menu-submenu.ant-zoom-big-leave {
      display: none;
    }
  }

  /* Ant Select */
  .ant-select .select-custom-scroll .rc-virtual-list-holder {
    ${MyScrollbar}
  }
  .ant-select-selection-item {
    display: inline-flex;
    align-items: center;

    .ant-select-selection-item-remove {
      display: inline-flex;
    }
  }

  /* Ant Table */
  .ant-table-thead {
    .ant-table-column-sorters {
      .ant-table-column-sorter {
        display: inline-flex;
        .ant-table-column-sorter-inner {
          margin-bottom: 2px;
        }
      }
    }
  }
  .ant-table-tbody {
    .ant-table-cell {
      vertical-align: middle;
      line-height: 1;
    }
  }

  /* Ant Popconfirm */
  .ant-popconfirm {
    .ant-popover-message {
      .anticon {
        margin-top: 1px;
      }
    }
    .ant-popover-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  /* Ant Input */
  .ant-input-affix-wrapper {
    .ant-input-suffix {
      .ant-input-clear-icon {
        display: inline-flex;
      }
    }
  }

  /* Ant Picker */
  .ant-picker-range {
    .ant-picker-range-separator {
      .ant-picker-separator {
        display: inline-flex;
      }
    }
  }

  /* Ant Avatar */
  .ant-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    img {
      border-radius: inherit;
    }
  }

  /* Ant Modal */
  .ant-modal-close-x {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-modal-confirm .ant-modal-confirm-btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .ant-modal-wrap.no-header .ant-modal-close,
  .ant-modal-wrap.no-header .ant-modal-header {
    display: none;
  }
  .ant-modal-wrap.reset-style {
    .ant-modal-content {
      background-color: transparent;
      .ant-modal-body {
        padding: 0;
      }
      .ant-modal-footer {
        display: none;
      }
    }
  }

  /* Ant Pagination */
  .ant-pagination {
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link,
    .ant-pagination-jump-prev .ant-pagination-item-link,
    .ant-pagination-jump-prev .ant-pagination-item-container,
    .ant-pagination-jump-next .ant-pagination-item-link,
    .ant-pagination-jump-next .ant-pagination-item-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-pagination-item-ellipsis {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  /* Ant Form */
  .ant-form {
    .ant-form-item {
      margin-bottom: 12px;
      .ant-form-item-label {
        padding-bottom: 2px;
        & > label,
        .ant-form-item-required {
          flex-direction: row-reverse;
          height: auto;
          &::before {
            margin-left: 2px;
          }
          &::after {
            display: none;
          }
          .ant-form-item-tooltip {
            position: absolute;
            transform: translateX(calc(100% + 5px));
          }
        }
      }
      .ant-form-item-control {
        .ant-form-item-explain {
          margin-top: 2px;
          min-height: 0;
          .ant-form-item-explain-error {
            font-size: 80%;
          }
        }
      }
    }
  }

  /* Ant Notification */
  .ant-notification {
    z-index: 999999999;
  }

  /* Ant Button */
  .ant-btn:has(> a:not(:empty)) {
    a::after {
      position: absolute;
      inset: -1px;
      background: transparent;
      content: '';
    }
    &.ant-btn-loading {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .ant-btn-loading-icon {
        display: flex;
        align-items: center;
      }
    }
  }

  /* Ant Upload */
  .ant-upload-picture-card-wrapper {
    .ant-upload.ant-upload-select {
      .ant-upload {
        overflow: hidden;
      }
    }
  }

  /* Ant Breadcrumb */
  .ant-breadcrumb {
    .ant-breadcrumb-link {
      a {
        text-decoration: none;
      }
    }

    &.my-breadcrumb {
      padding: 20px 0;
      font-size: 14px;
      color: var(--color-gray-7);
      word-break: break-word;
      li:last-child {
        font-weight: 500;
        color: var(--color-primary-700);
      }
      a:hover {
        color: rgba(var(--color-primary-rgb-700), 70%);
        text-decoration: underline;
      }

      @media (max-width: 640px) {
        font-size: 14px;
      }
    }
  }

  /* Ant Rate */
  .ant-rate {
    display: inline-flex;

    &.not-hover {
      .ant-rate-star {
        & > div:hover,
        & > div:focus {
          transform: unset;
        }
      }
    }

    .ant-rate-star {
      display: inline-flex;
      &:not(:last-child) {
        margin-right: 3px;
      }
      & > div {
        display: inline-flex;
      }
      .ant-rate-star-first,
      .ant-rate-star-second {
        display: inline-flex;
        height: fit-content;
      }
      .anticon {
        display: inline-flex;
        height: fit-content;
      }
    }
  }

  /* Ant Steps */
  .ant-steps {
    .ant-steps-item {
      .ant-steps-item-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        .ant-steps-icon {
          display: inline-flex;
          .my-icon {
            width: 3rem;
          }
        }
      }

      &.ant-steps-item-active .ant-steps-icon .my-icon {
        color: rgba(var(--color-primary-rgb-700), 80%);
      }

      &.ant-steps-item-finish .ant-steps-icon .my-icon {
        color: var(--color-primary-700);
      }
    }
  }
`;

const Variables = css`
  :root {
    --font-pretendard: ${pretendard.style.fontFamily};
    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

    --color-main-1: #e6f4f5;
    --color-main-2: #dae7e8;
    --color-main-3: #c1d8db;
    --color-main-4: #95c6cf;
    --color-main-5: #6db2c2;
    --color-main-6: #499fb6;
    --color-main-7: #32788f;
    --color-main-8: #1f5469;
    --color-main-9: #113342;
    --color-main-10: #07151c;

    --color-main-rgb-1: 230, 244, 245;
    --color-main-rgb-2: 218, 231, 232;
    --color-main-rgb-3: 193, 216, 219;
    --color-main-rgb-4: 149, 198, 207;
    --color-main-rgb-5: 109, 178, 194;
    --color-main-rgb-6: 73, 159, 182;
    --color-main-rgb-7: 50, 120, 143;
    --color-main-rgb-8: 31, 84, 105;
    --color-main-rgb-9: 17, 51, 66;
    --color-main-rgb-10: 7, 21, 28;

    --color-primary-25: #f3fbfb;
    --color-primary-50: #e2f8f9;
    --color-primary-100: #b7edf0;
    --color-primary-200: #8ae1e8;
    --color-primary-300: #61d4de;
    --color-primary-400: #49cbd7;
    --color-primary-500: #3fc1d1;
    --color-primary-600: #3bb1bf;
    --color-primary-700: #369ca5;
    --color-primary-800: #32878e;
    --color-primary-900: #2a6464;

    --color-primary-rgb-25: 243, 251, 251;
    --color-primary-rgb-50: 226, 248, 249;
    --color-primary-rgb-100: 183, 237, 240;
    --color-primary-rgb-200: 138, 225, 232;
    --color-primary-rgb-300: 97, 212, 222;
    --color-primary-rgb-400: 73, 203, 215;
    --color-primary-rgb-500: 63, 193, 209;
    --color-primary-rgb-600: 59, 177, 191;
    --color-primary-rgb-700: 54, 156, 165;
    --color-primary-rgb-800: 50, 135, 142;
    --color-primary-rgb-900: 42, 100, 100;

    --color-gray-1: #ffffff;
    --color-gray-2: #fafafa;
    --color-gray-3: #f5f5f5;
    --color-gray-4: #f0f0f0;
    --color-gray-5: #d9d9d9;
    --color-gray-6: #bfbfbf;
    --color-gray-7: #8c8c8c;
    --color-gray-8: #595959;
    --color-gray-9: #434343;
    --color-gray-10: #262626;
    --color-gray-11: #1f1f1f;
    --color-gray-12: #141414;
    --color-gray-13: #000000;

    --color-gray-rgb-1: 255, 255, 255;
    --color-gray-rgb-2: 250, 250, 250;
    --color-gray-rgb-3: 245, 245, 245;
    --color-gray-rgb-4: 240, 240, 240;
    --color-gray-rgb-5: 217, 217, 217;
    --color-gray-rgb-6: 191, 191, 191;
    --color-gray-rgb-7: 140, 140, 140;
    --color-gray-rgb-8: 89, 89, 89;
    --color-gray-rgb-9: 67, 67, 67;
    --color-gray-rgb-10: 38, 38, 38;
    --color-gray-rgb-11: 31, 31, 31;
    --color-gray-rgb-12: 20, 20, 20;
    --color-gray-rgb-13: 0, 0, 0;

    --color-red-1: #faebeb;
    --color-red-2: #eddfdf;
    --color-red-3: #e0b6b8;
    --color-red-4: #d48a90;
    --color-red-5: #c7616d;
    --color-red-6: #ba3d4f;
    --color-red-7: #94293d;
    --color-red-8: #6e192c;
    --color-red-9: #470d1b;
    --color-red-10: #21060d;

    --color-red-rgb-1: 250, 235, 235;
    --color-red-rgb-2: 237, 223, 223;
    --color-red-rgb-3: 224, 182, 184;
    --color-red-rgb-4: 212, 138, 144;
    --color-red-rgb-5: 199, 97, 109;
    --color-red-rgb-6: 186, 61, 79;
    --color-red-rgb-7: 148, 41, 61;
    --color-red-rgb-8: 110, 25, 44;
    --color-red-rgb-9: 71, 13, 27;
    --color-red-rgb-10: 33, 6, 13;

    --primary: var(--color-main-6);
    --primary-rgb: var(--color-main-rgb-6);
    --secondary: #707991;
    --text-title: var(--color-gray-11);
    --text-caption: var(--color-gray-9);
    --color-white: var(--color-gray-1);
    --color-white-rgb: var(--color-gray-rgb-1);
    --color-icon: var(--color-gray-7);
    --color-icon-rgb: var(--color-gray-rgb-7);
    --color-yellow: #ffc751;

    --border-1px: 1px solid var(--color-gray-4);
    --border-radius-base: 4px;
    --color-line: var(--color-gray-4);
    --color-line-rgb: var(--color-gray-rgb-4);
    --box-shadow: rgb(0 0 0 / 8%) 0px 2px 8px 0px;
    --background-skeleton: rgba(190, 190, 190, 0.2);

    --userPage_backgroundColorMain: #f7f7f7;

    //Order
    --order-new-background: rgba(255, 192, 67, 0.2);
    --order-new-color: #fa0;
    --order-success-background: rgba(73, 159, 182, 0.2);
    --order-success-color: var(--color-primary-700);
    --order-fail-background: rgba(186, 61, 79, 0.2);
    --order-fail-color: var(--color-red-6);
    --order-cancel-background: var(--color-gray-4);
    --order-cancel-color: var(--color-red-6);

    // Modeling Service
    --vrs-modeling-service-primary: #3fc1d1;
    --vrs-modeling-service-primary-rgb: 63, 193, 209;
    --vrs-modeling-service-dark: #003746;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${Variables}
  ${GlobalCss}
  ${CustomAntDesignCss}
`;

export default GlobalStyle;
