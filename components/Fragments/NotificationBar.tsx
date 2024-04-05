import { CSSProperties } from 'react';
import Link from 'next/link';

import { useDispatch } from 'react-redux';
import { HideNotificationBar } from 'store/reducer/web';

import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

import { Container } from 'styles/__styles';

type Props = {
  style?: CSSProperties;
  className?: string;
};

const NotificationBar = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <Wrapper className={props.className} style={props.style}>
      <Container>
        <div className='message'>
          Your account has not updated its email address{' '}
          <Link href='/user/settings/email'>[Update now]</Link>
        </div>
      </Container>

      <span className='btn_close' onClick={() => dispatch(HideNotificationBar())}>
        <CloseOutlined />
      </span>
    </Wrapper>
  );
};

export default NotificationBar;

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  position: relative;
  min-height: 40px;
  padding: 5px 20px;
  background-color: var(--color-primary-50);

  .btn_close {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    justify-content: center;

    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 12px;
    color: #ffffff;
    background-color: var(--color-primary-600);
    cursor: pointer;
  }

  .message {
    font-size: 13px;
    color: var(--text-caption);
    font-weight: 400;

    a {
      color: var(--text-title);
      font-weight: 600;
      transition: none;
    }
  }

  &.change-theme {
    background-color: #ffffff;

    .message {
      color: rgba(var(--primary-rgb-700), 0.8);

      a {
        color: rgba(var(--primary-rgb-700), 0.96);
      }
    }
  }
`;
