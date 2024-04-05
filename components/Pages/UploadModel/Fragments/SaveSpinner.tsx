import { ConfigProvider, Spin, theme } from 'antd';
import styled from 'styled-components';

export default function UploadModelSaveSpinner() {
  const colorPrimary = theme.useToken().token.colorPrimary;
  return (
    <SpinWrapper>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
            colorBgMask: 'rgb(255 255 255 / 70%)',
            colorWhite: colorPrimary,
          },
        }}>
        <Spin tip='Processing...' fullscreen>
          <div style={{ width: 100, height: 100 }} />
        </Spin>
      </ConfigProvider>
    </SpinWrapper>
  );
}

const SpinWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
`;
