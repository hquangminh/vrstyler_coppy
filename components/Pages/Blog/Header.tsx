import { ConfigProvider, Input } from 'antd';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';

import Icon from 'components/Fragments/Icons';

import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSearch: (value: string) => void;
};
const HelpCenterHeader = (props: Props) => {
  const { langLabel } = useLanguage();
  const { width: screenW } = useWindowSize();

  return (
    <Wrapper>
      <div className='blog__text'>
        <p>{langLabel.blog_banner_title}</p>
        <h1>{langLabel.blog_banner_caption}</h1>
      </div>
      <ConfigProvider
        theme={{
          components: { Input: { activeBg: '#ffffff', hoverBg: '#ffffff' } },
          token: { borderRadiusLG: 6, controlHeight: 40, controlHeightLG: 50 },
        }}>
        <Input
          size={screenW < 992 ? 'middle' : 'large'}
          placeholder={langLabel.blog_search_placeholder}
          prefix={<Icon iconName='search' style={{ width: 20 }} />}
          onChange={(e) => props.onSearch(e.target.value)}
        />
      </ConfigProvider>
    </Wrapper>
  );
};
export default HelpCenterHeader;

const Wrapper = styled.section`
  text-align: center;
  position: relative;
  .blog__text {
    position: relative;
    margin-top: 50px;
    background-image: url('/static/images/blog/background-top.png');
    width: 100%;
    height: 241px;
    border-radius: 16px;
    background-size: cover;
    background-repeat: no-repeat;
    ${maxMedia.medium} {
      margin-top: 20px;
      padding-top: 47px 0;
      background-image: url('/static/images/blog/background-top-mobile.png');
      width: 100%;
      height: 161px;
      flex-grow: 0;
    }
    ${maxMedia.small} {
      margin-top: 20px;
      padding-top: 47px 0;
      background-image: url('/static/images/blog/background-top-mobile.png');
      width: 100%;
      height: 161px;
      flex-grow: 0;
    }
    ${maxMedia.xsmall} {
      width: 100%;
      height: 161px;
      flex-grow: 0;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-gray-1);
      line-height: normal;
      ${maxMedia.medium} {
        font-size: 14px;
        font-weight: 400px;
        letter-spacing: 1.21px;
      }
      ${maxMedia.small} {
        font-size: 11px;
        font-weight: 300px;
        letter-spacing: 1.21px;
      }
      ${maxMedia.xsmall} {
        font-size: 11px;
        font-weight: 300px;
        letter-spacing: 1.21px;
      }
    }
    h1 {
      font-size: 48px;
      font-weight: 400;
      color: var(--color-gray-1);
      line-height: normal;
      ${maxMedia.medium} {
        font-size: 32px;
        font-weight: 400;
      }
      ${maxMedia.small} {
        font-size: 16px;
        font-weight: 400;
      }
      ${maxMedia.small} {
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
  .ant-input-affix-wrapper {
    width: 610px;
    padding-inline: 15px;
    border: none;
    box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    transform: translate(-50%, -50%);

    ${maxMedia.medium} {
      min-width: 300px;
      max-width: 60%;
    }
    .ant-input-prefix {
      margin-right: 8px;
    }
    .ant-input {
      color: var(--color-gray-7);
    }
  }
`;
