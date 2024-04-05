import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Footer_Wrapper = styled.footer`
  padding: 5rem 0 80px;
  background-color: var(--color-primary-700);
  ${maxMedia.xsmall} {
    padding: 5rem 0;
  }
`;
export const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 7.5rem;

  ${maxMedia.xsmall} {
    gap: 6rem;
  }
`;
export const MenuSection = styled.div`
  flex: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  max-width: 900px;

  ${maxMedia.custom(800)} {
    flex: unset;
    justify-content: space-between;
    width: 100%;
  }
  ${maxMedia.xsmall} {
    flex-direction: column;
    align-items: center;
    gap: 6rem 0;
  }
`;
export const MenuGroup = styled.div`
  flex: 1;

  ${maxMedia.custom(800)} {
    flex: unset;
  }
  ${maxMedia.xsmall} {
    text-align: center;
  }

  h2 {
    font-weight: 600;
    font-size: 20px;
    line-height: 3rem;
    color: var(--color-white);

    & + h3 {
      margin-top: 27px;
    }
  }
`;
export const MenuItem = styled.h3`
  & + h3 {
    margin-top: 8px;
  }
  a {
    font-weight: 300;
    font-size: 14px;
    line-height: 2.4rem;
    color: rgb(var(--color-gray-rgb-1), 0.8);
  }

  a:hover {
    color: white;
    transition: all 0.2s linear;
  }
`;
export const Social = styled.div`
  ${maxMedia.custom(800)} {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
  }

  .logo {
    .my-icon svg {
      height: 24px;
      width: auto;
      color: var(--color-gray-1);
    }
  }

  .banner_social {
    position: unset;
    transform: unset;

    display: flex;
    align-items: center;
    gap: 8px;

    margin-top: 2.7rem;

    &::before,
    &:after {
      display: none;
    }

    li {
      width: 32px;
      height: 32px;
      margin: 0;
      border: 1px solid var(--color-gray-1);
      transition: all 200ms ease-in-out;

      &:not(:hover) {
        background-color: transparent;
      }

      .my-icon {
        width: 14px;
      }
    }
  }
`;
export const Certify = styled.ul`
  margin-top: 40px;
  list-style: none;
  img {
    width: 100px;
  }
`;
