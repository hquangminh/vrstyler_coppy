import { useSelector } from 'react-redux';
import { AppState } from 'store/type';

import styled from 'styled-components';
// import { InstagramFilled } from '@ant-design/icons';

import Icon from './Icons';

import { maxMedia } from 'styles/__media';

type SizeType = 'small' | 'medium' | 'large';
type Props = {
  size?: SizeType;
  color?: string;
  bgColor?: string;
};

const SocialInBanner = (props: Props) => {
  const { size = 'medium', color, bgColor } = props;
  const settings = useSelector((state: AppState) => state.web.setting);

  return (
    <Wrapper className='banner_social' $size={size} $myColor={color} $bgColor={bgColor}>
      {settings?.facebook && (
        <li>
          <a href={settings.facebook} target='__blank' aria-label="Visit VRStyler's Facebook">
            <Icon iconName='facebook' />
          </a>
        </li>
      )}
      {settings?.behance && (
        <li>
          <a href={settings.behance} target='__blank' aria-label="Visit VRStyler's Behance">
            <Icon iconName='behance' />
          </a>
        </li>
      )}
      {settings?.pinterest && (
        <li>
          <a href={settings.pinterest} target='__blank' aria-label="Visit VRStyler's Pinterest">
            <Icon iconName='pinterest' />
          </a>
        </li>
      )}
      {settings?.artstation && (
        <li>
          <a href={settings.artstation} target='__blank' aria-label="Visit VRStyler's Artstation">
            <Icon iconName='artstation' />
          </a>
        </li>
      )}
      {/* {settings?.twitter && (
        <li>
          <a href={settings.twitter} target='__blank'>
            <Icon iconName='twitter' />
          </a>
        </li>
      )} */}
      {/* {settings?.instagram && (
        <li>
          <a href={settings.instagram} target='__blank'>
            <InstagramFilled />
          </a>
        </li>
      )} */}
      {/* {settings?.youtube && (
        <li>
          <a href={settings.youtube} target='__blank'>
            <Icon iconName='youtube' />
          </a>
        </li>
      )} */}
    </Wrapper>
  );
};

export default SocialInBanner;

const Wrapper = styled.ul<{ $size: SizeType; $myColor?: string; $bgColor?: string }>`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translate(-50%);
  z-index: 2;

  list-style: none;
  color: ${(props) => props.$myColor || 'var(--color-gray-11)'};

  &::before,
  &:after {
    content: '';
    width: 0.5px;
    height: 3.3rem;
    background-color: currentColor;
  }
  &:before {
    position: absolute;
    top: ${(props) => (props.$size === 'small' ? -1.2 : -1.8)}rem;
    left: 50%;
    transform: translate(-50%, -100%);
  }
  &:after {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, ${(props) => (props.$size === 'small' ? 1.2 : 1.8)}rem);
  }

  li {
    width: ${(props) => (props.$size === 'small' ? 2.2 : props.$size === 'large' ? 3.6 : 2.65)}rem;
    height: ${(props) => (props.$size === 'small' ? 2.2 : props.$size === 'large' ? 3.6 : 2.65)}rem;

    border-radius: 50%;
    background-color: ${(props) => props.$bgColor || 'rgb(10 10 10 / 0.1)'};

    & + li {
      margin-top: ${(props) => (props.$size === 'small' ? 1.2 : 1.8)}rem;
    }

    a {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 100%;
    }

    .my-icon,
    .anticon {
      width: ${(props) => (props.$size === 'small' ? 1.2 : 1.4)}rem;
      height: auto;
      color: ${(props) => props.$myColor || 'var(--color-gray-11)'};
    }
  }

  ${maxMedia.medium} {
    display: none;
  }
`;
