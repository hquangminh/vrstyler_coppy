import { ReactNode } from 'react';
import useLanguage from 'hooks/useLanguage';
import { Result } from 'antd';
import styled from 'styled-components';
import Icon from './Icons';

type Props = {
  size?: 'small' | 'medium' | 'large';
  button?: ReactNode;
};

const CartEmpty = (props: Props) => {
  const { size = 'medium' } = props;
  const { langLabel } = useLanguage();

  return (
    <Wrapper size={size}>
      <Result
        title={langLabel.cart_empty_title}
        icon={<Icon iconName='cart-empty' />}
        extra={props.button}
      />
    </Wrapper>
  );
};

export default CartEmpty;

const Wrapper = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  .ant-result-icon {
    margin-bottom: 20px;

    .my-icon {
      width: unset;
      max-width: ${(props) => (props.size === 'small' ? 11 : props.size === 'medium' ? 20 : 30)}rem;
      color: var(--color-primary-200);
    }
  }

  .ant-result-title {
    font-size: ${(props) => (props.size === 'small' ? 14 : props.size === 'medium' ? 16 : 20)}px;
    font-weight: 600;
    line-height: 1.38;
    color: var(--text-caption);
  }

  .ant-result-extra {
    margin-top: 2rem;

    .ant-btn {
      min-width: 180px;
      height: 42px;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
