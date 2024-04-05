import Link from 'next/link';
import styled from 'styled-components';
import { Button, ConfigProvider, Flex } from 'antd';

import useLanguage from 'hooks/useLanguage';

import { Container } from 'styles/__styles';

const NotSupportSmallScreen = () => {
  const i18n = useLanguage();

  return (
    <Container>
      <Wrapper justify='center' align='center'>
        <div className='screen'>
          <img src='/static/images/screen-above-992.png' alt='' loading='lazy' />
          <p>{i18n.t('not_support_viewport_less_than_992')}</p>
          <ConfigProvider theme={{ components: { Button: { borderRadius: 4 } } }}>
            <Button type='primary'>
              <Link href='/'>{i18n.t('btn_go_home')}</Link>
            </Button>
          </ConfigProvider>
        </div>
      </Wrapper>
    </Container>
  );
};

export default NotSupportSmallScreen;

const Wrapper = styled(Flex)`
  height: 100vh;
  .screen {
    text-align: center;
    img {
      width: 120px;
      height: 100%;
    }
    p {
      padding: 16px 0 32px 0;
      font-size: 16px;
      font-weight: 400;
      color: var(--color-gray-9);
    }
  }
`;
