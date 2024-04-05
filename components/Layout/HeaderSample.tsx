import { CSSProperties, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import { ContainerSize } from 'models';

import styled from 'styled-components';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

type Props = {
  style?: CSSProperties;
  button?: ReactNode;
  containerSize?: ContainerSize;
  logoURL?: string;
  title?: string;
};

const HeaderSample = (props: Props) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  return (
    <Wrapper style={props.style}>
      <Container
        className='d-flex align-items-center justify-content-between custom__container'
        size={props.containerSize}>
        <div className='lists'>
          <Icon iconName='logo-main' onClick={() => router.push(props.logoURL || '/')} />
          <ul className='menu__lists'>
            <li> {langLabel[props.title || '']}</li>
          </ul>
        </div>

        <div className='gotoview'>
          <Link href='/' legacyBehavior>
            <a>
              <span className='vrstyler-text'>{langLabel.btn_go_to_vr_styler}</span>
              <Icon iconName='arrow-right-line' />
            </a>
          </Link>
        </div>
        {props.button}
      </Container>
    </Wrapper>
  );
};
export default HeaderSample;

const Wrapper = styled.header`
  padding: 11px 0;
  background-color: #fefefe;
  border-bottom: var(--border-1px);

  top: 0;
  z-index: 9;

  .lists {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  a,
  li {
    color: #424153;
    font-size: 16px;
  }

  .gotoview {
    a {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }

    .my-icon {
      font-size: 24px;
      color: transparent;
    }
  }

  .my-icon.logo-main {
    cursor: pointer;
    svg {
      width: auto;
      height: 24px;
    }
  }

  .ant-btn {
    height: 37px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-gray-7);
  }
  ${maxMedia.small} {
    .vrstyler-text {
      display: none;
    }
  }

  ${maxMedia.medium} {
    a,
    li {
      font-size: 14px;
    }

    .gotoview {
      a {
        font-size: 12px;
      }

      .my-icon {
        font-size: 22px;
      }
    }
  }
`;
