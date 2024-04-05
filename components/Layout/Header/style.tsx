import styled from 'styled-components';
import { maxMedia, minMedia } from 'styles/__media';

export const Wrapper = styled.header<{ $top: number; $isHome?: boolean }>`
  width: 100%;
  border-bottom: 0.5px solid;
  background-color: ${(props) => (props.$isHome ? 'transparent' : 'var(--color-gray-1)')};

  position: sticky;
  top: ${(props) => (typeof props.$top === 'number' ? props.$top : 0)}px;
  left: 0;
  z-index: 100;

  .header_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;

    height: 100%;
    ${maxMedia.custom(1200)} {
      gap: 25px;
    }
  }
`;

export const Header__Nav = styled.nav<{ $isHome?: boolean }>`
  height: 72px;
  ${maxMedia.small} {
    height: 60px;
  }
`;

export const Logo = styled.div<{ $isHome?: boolean }>`
  line-height: 1;

  .my-icon svg {
    height: 24px;
    width: auto;
    color: ${(props) => (props.$isHome ? '#ffffff' : 'var(--color-gray-13)')};
  }
  .my-icon.--black svg g {
    fill: var(--text-title);
  }
  a {
    display: inline-block;
    line-height: 1;
  }
`;

export const SearchBox = styled.div<{ $isHome?: boolean }>`
  width: 100%;
  max-width: 320px;
  ${maxMedia.custom(1500)} {
    max-width: 250px;
  }
  .ant-input-affix-wrapper {
    width: 100%;
    padding: 6px 10px;
    border-radius: 4px;
    border-color: var(--color-gray-${(props) => (props.$isHome ? '4' : '6')});
    background-color: transparent;
    cursor: auto;

    &:hover {
      border-color: var(--color-gray-${(props) => (props.$isHome ? '4' : '6')});
    }

    .ant-input {
      background-color: transparent;
      &::placeholder {
        color: var(--color-gray-${(props) => (props.$isHome ? '4' : '6')});
      }
    }
    .ant-input-suffix {
      .my-icon {
        font-size: 18px;
        color: var(--color-gray-${(props) => (props.$isHome ? '5' : '7')});
      }
    }
  }
`;

export const IconActionGroup = styled.div<{ $isHome?: boolean }>`
  &:empty {
    display: none;
  }

  display: flex;
  align-items: center;
  gap: 12px;

  ${maxMedia.medium} {
    gap: 20px;
  }

  ${(props) => (props.$isHome ? 'span.my-icon, span.anticon { color:#ffffff; }' : '')}
`;

export const IconAction = styled.div<{ $isHome?: boolean; $disable?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${minMedia.custom(1200)} {
    padding: 1rem;
    border-radius: 50%;
    transition: background-color 0.16s ease 0s;
    cursor: pointer;
    pointer-events: ${(props) => (props.$disable ? 'none ' : '')};

    &:hover,
    &.ant-dropdown-open {
      background-color: rgba(var(--color-gray-rgb-13), 5%);
    }
  }

  .my-icon {
    font-size: 24px;
    color: ${(props) => (props.$isHome ? '#fff' : 'var(--color-gray-7)')};
  }

  &.cart,
  &.noti {
    .ant-badge-count {
      top: -0.2rem;
      right: -0.3rem;
    }
  }

  &.btn-open-menu {
    cursor: pointer;
    ${minMedia.medium} {
      display: none;
    }
  }
`;

export const Left = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  gap: 5.6rem;

  ${maxMedia.custom(1200)} {
    gap: 2rem;
  }
`;

export const Right = styled.div<{ $isHome?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex: auto;
  .btn_become_a_seller {
    ${maxMedia.custom(1200)} {
      padding: 4px 8px;
    }
  }
`;
export const UserInfo = styled.div`
  .ant-avatar {
    width: 32px;
    height: 32px;
    ${maxMedia.small} {
      width: 20px;
      height: 20px;
    }
    background-color: transparent;
    cursor: pointer;
    overflow: hidden;
    border: 0.5px solid #f1f1f1;

    &:not(:has(.my-icon)) {
      border: 0.5px solid #f1f1f1;
    }
    img {
      object-fit: cover;
      ${maxMedia.small} {
        width: 20px;
        height: 20px;
      }
    }
  }
`;
