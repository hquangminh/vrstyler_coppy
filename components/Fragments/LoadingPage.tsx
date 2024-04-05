import { Flex, Spin } from 'antd';
import styled, { css } from 'styled-components';

type Props = {
  fixed?: boolean;
  blur?: boolean;
};

const LoadingPage = (props: Props) => {
  const { fixed = true, blur = false } = props;

  return (
    <SpinningWrapper align='center' justify='center' $fixed={fixed} $blur={blur}>
      <Spin />
    </SpinningWrapper>
  );
};

export default LoadingPage;

const SpinningWrapper = styled(Flex)<{ $fixed: boolean; $blur: boolean }>`
  ${(props) => {
    if (props.$fixed)
      return css`
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
      `;
    else
      return css`
        max-height: 300px;
      `;
  }}

  width: 100vw;
  height: 100vh;
  background-color: ${(props) =>
    props.$blur ? 'rgba(var(--color-white-rgb), 70%)' : 'var(--color-gray-1)'};
  backdrop-filter: ${(props) => (props.$blur ? 'blur(2px)' : 'unset')};
`;
