import styled from 'styled-components';
import { maxMedia, minMedia } from 'styles/__media';

export const Models_wrapper = styled.div`
  .status {
    margin: 0;
    border: none;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    text-align: center;
    line-height: normal;

    &-1 {
      background-color: #e3e3e8;
      color: rgba(0, 0, 0, 0.88);
    }

    &-2 {
      background-color: #e6fffb;
      color: #08979c;
    }

    &-3 {
      background-color: #fff1f0;
      color: #ff4d4f;
    }
  }
  .Column__Product_Name {
    max-width: 270px;
    a {
      display: inline-block;
      max-width: 100%;
      line-height: 1.2;
    }
  }

  .information {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .anticon {
      position: relative;
      top: -1px;
    }
  }

  .my-icon {
    color: var(--color-gray-7);
    font-size: 14px;
  }

  .img {
    object-fit: cover;
  }
  .ant-badge-status-text {
    margin: 5px;
    color: #424153 !important;
    font-size: 12px !important;
  }
`;

export const Header_wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 40px;

  .header__title {
    font-size: 24px;
    color: var(--color-gray-11);

    span {
      color: var(--color-primary-700);
      font-weight: 600;
    }
  }

  .header__box--btn {
    display: flex;
    gap: 20px;

    button {
      border-radius: 4px;
      height: 37px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: -20px;
    bottom: -20px;
    width: calc(100% + 40px);
    border-radius: 20px;
    border-bottom: 1px solid var(--color-gray-4);
  }

  ${maxMedia.medium} {
    margin-right: 20px;
  }

  ${maxMedia.small} {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const Reaction_wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .item {
    cursor: pointer;
  }

  .my-icon svg {
    width: auto;
    height: 20px;
  }
`;

export const MenuAction_wrapper = styled.div`
  display: flex;
  gap: 28px;
  margin: 0 auto;
  width: fit-content;

  .anticon {
    padding: 5px;
    color: var(--color-gray-7);

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .icon {
    background-color: transparent;
    transition: 0.3s;
    cursor: pointer;
    border-radius: 0;

    ${minMedia.medium} {
      &--dropdown:hover,
      &--dropdown:focus,
      &--dropdown:has(.ant-dropdown:not(.ant-dropdown-hidden)) {
        background-color: var(--color-gray-6);
        color: var(--color-gray-1);
        border-radius: 5px;
      }
    }
  }
`;
