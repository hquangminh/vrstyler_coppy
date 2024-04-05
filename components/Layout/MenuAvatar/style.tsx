import styled from 'styled-components';
import { ChangeRemMobileToPC } from 'styles/__media';

export const MenuMobile_Wrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
`;
export const MenuMobile_Header = styled.div`
  padding: 16px 16px 0;
  .divider {
    border-bottom: 1px solid #e3e3e8;
    margin: 16px 0;
  }
  .my-icon {
    font-size: 20px;
    cursor: pointer;
    &.logo-main svg {
      height: 24px;
      width: auto;
      color: var(--color-gray-13);
    }
  }
  .avatar {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;

    .avatar_left {
      & > img {
        border-radius: 50%;
        object-fit: cover;
      }

      .avatar-info-title {
        display: grid;
        .avatar-type {
          color: #7f7f8d;
          line-height: 1.4;
          font-size: 14px;
        }
        .avatar-name {
          color: #161723;
          line-height: 1.4;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    .avatar_right {
      .btn_close {
        width: 34px;
        height: 34px;
        span {
          font-size: 12px;
          flex-grow: 0;
          color: #b3b3b3;
        }
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
`;
export const MenuMobile_Header_No_Active = styled.div`
  display: flex;
  justify-content: right;
  height: 71px;
  padding: 16px 16px 0;
  border-bottom: var(--border-1px);

  .avatar_right {
    .btn_close {
      width: 34px;
      height: 34px;
      span {
        font-size: 12px;
        flex-grow: 0;
        color: #b3b3b3;
      }
      &:hover {
        background-color: transparent;
      }
    }
  }
`;
export const MenuMobile_Content = styled.div`
  padding: 16px;
  .ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    font-size: ${ChangeRemMobileToPC('medium', 1.6)};
    right: 0;
  }
  .menu_list {
    border-right: none !important;
  }
  .ant-collapse-content-box {
    ul {
      list-style: none;
      li {
        color: var(--color-gray-8);
        &.active {
          color: var(--color-primary-700);
        }
        & + li {
          margin-top: 2rem;
        }
        a,
        span {
          font-size: ${ChangeRemMobileToPC('medium', 1.6)};
          font-weight: 500;
          color: inherit;
          opacity: 0.9;
          cursor: pointer;
        }
      }
    }
  }
`;

export const UserCollapse = styled.div`
  border-bottom: var(--border-1px);

  .ant-collapse {
    border: 0;
    background-color: var(--color-gray-1);
    .ant-collapse-item {
      border: 0;
    }
    .ant-collapse-header {
      padding: 2rem 0;

      .ant-collapse-header-text {
        display: inline-flex;
      }
      .user-avatar {
        display: inline-flex;
        align-items: center;
        gap: 1rem;

        .ant-avatar {
          width: 6rem;
          height: 6rem;
        }
        h4 {
          font-size: ${ChangeRemMobileToPC('medium', 2)};
          font-weight: 600;
          letter-spacing: 1.1px;
          color: var(--color-gray-9);
          max-width: 70%;
        }
      }
    }
    .ant-collapse-content {
      border-color: var(--color-line);
    }
  }
`;

export const MenuBtnAction = styled.div`
  padding: 2rem 0;
  border-bottom: var(--border-1px);
  text-align: center;

  .ant-btn {
    width: 100%;
    height: ${ChangeRemMobileToPC('medium', 4.8)};

    font-size: ${ChangeRemMobileToPC('medium', 1.6)};
    font-weight: 600;
  }
`;

export const MenuList = styled.nav`
  .ant-menu-item-icon {
    color: #424153;
  }
  .text_language {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    line-height: 1.4;
    font-size: 16px;
  }
  .my_icon_language {
    padding-left: 8px;
    svg {
      color: var(--color-gray-13);
      font-size: 24px;
    }
  }
  .ant-menu-submenu {
    margin-block: 0;
    margin-inline: 0;
    margin-top: 8px;
    padding: 0px !important;
  }
  .ant-menu-submenu-arrow {
    display: none;
  }
  .arrow_dropdown {
    font-size: 16px;
    color: #b3b3b3;
    margin-left: 4px;
    transition: transform 0.3s ease;
  }
  .arrow_dropdown_active {
    transform: rotate(90deg);
  }
  .ant-menu-submenu-title {
    padding-inline: 0;
    margin-inline: 0;
    margin-block: 0;
    padding: 0px !important;
    color: #424153 !important;
  }

  .ant-menu-item {
    height: 40px;
    margin-block: 0;
    margin-inline: 0;
    margin-bottom: 8px;
    width: 100%;
    padding-inline-start: 8px !important;
    width: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.ant-menu-item-only-child {
      height: 30px;
      margin-bottom: 0;
      & + .ant-menu-item-only-child {
        margin-top: 8px;
      }
    }
    @media (hover: none) {
      background-color: transparent !important;
    }
  }
  .ant-menu-item:first-child {
    margin-top: 0 !important;
  }
  .ant-menu-submenu-arrow {
    inset-inline-end: 30px;
  }
  .label {
    margin-right: auto;
  }
  .active {
    background-color: #d8e6e4;
    color: var(--color-primary-700);
    &:hover,
    &:active {
      background-color: #d8e6e4 !important;
      color: var(--color-primary-700) !important;
    }
  }

  .ant-menu-item-divider:first-child {
    margin-top: 0;
    margin-bottom: 16px;
    color: #e3e3e8;
  }
  .ant-menu-item-divider {
    margin: 8px 0 7px 0;
    color: #e3e3e8;
  }
  .ant-menu-title-content {
    font-size: 16px;
    color: #424153;
    line-height: 1.4;
    a {
      line-height: inherit;
      display: inline-block;
    }
  }
  .ant-menu-sub {
    border-radius: 8px !important;
    background-color: #f4f5f8 !important;
    flex-grow: 0;
    padding: 12px 16px !important;
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  }

  .language-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menu_list {
    max-width: 100%;
  }
  .hide {
    display: none !important;
  }
  .ant-collapse {
    border: 0;
    background-color: var(--color-gray-1);

    .ant-collapse-item {
      border-bottom: var(--border-1px);
      .ant-collapse-header {
        padding: 2rem 0;
      }
      .ant-collapse-content {
        border-top: 0;

        &-box {
          padding-top: 0;
        }
      }
    }
  }
  .collapse-item-no-content .ant-collapse-content .ant-collapse-content-box {
    padding: 0;
  }
  .collapse-item-no-content.active .ant-collapse-header .ant-collapse-header-text a {
    color: var(--color-primary-700);
  }
  .my_icon {
    font-size: 24px !important;
  }

  .check-icon-language {
    margin-left: auto;
    color: #369ca5;
    svg {
      font-size: 16px;
      flex-grow: 0;
    }
  }
  .active_language {
    padding-inline: 8px;
    background-color: #fbffff !important;
  }

  .custom_class:hover {
    transition: background-color 0.3s;
    background-color: #fbffff !important;
    border-radius: 8px;
  }

  .ant-menu-submenu-title {
    width: 100%;
    &:hover,
    &:active {
      background-color: transparent !important;
      color: #424153;
    }
  }
  .ant-menu-submenu-open {
    .ant-menu-submenu-title {
      background-color: #f4f5f8 !important;
    }
  }
`;

export const SocialList = styled.ul`
  text-align: center;
  margin-top: 32px;

  .banner_social {
    position: unset;
    transform: unset;
    display: inline-flex;
    gap: 20px;

    &::before,
    &:after {
      display: none;
    }
  }

  li + li {
    margin-top: 0;
  }

  li {
    height: 40px;
    width: 40px;
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: inherit;

      border-radius: 50%;
      background-color: var(--color-gray-4);

      .my-icon,
      .anticon {
        height: 1.9rem;
        width: auto;
        color: #424153;
      }
    }
  }
`;
