import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import { Badge, Dropdown } from 'antd';

import useWindowSize from 'hooks/useWindowSize';

import notificationServices from 'services/notification-services';

import { AppState } from 'store/type';
import { UpdateNotification } from 'store/reducer/web';

import Notification from 'components/Pages/Notification';
import Icon from 'components/Fragments/Icons';
import { IconAction } from 'components/Layout/Header/style';

import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

const NotificationWrapper = styled.div`
  .scroll-bar > div:not(.ant-divider) .icon__filter {
    color: black !important;
  }
`;
const Wrapper = styled.div`
  width: 400px;
  background-color: #fff;
  box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);

  main {
    padding: 0;
    margin: 0;
    & > div {
      padding: 0;
    }
  }

  .Notification_Page .Notification__Info {
    padding: 10px;
  }
  .ant-tabs {
    .ant-tabs-nav {
      padding: 0 10px;
    }
    .ant-tabs-tab {
      padding: 10px 0;
      margin: 0 16px 0 0;
      ${maxMedia.small} {
        margin: 0 12px 0 0;
      }
    }
    .ant-tabs-ink-bar {
      display: none;
    }
  }
`;

const HeaderNotification = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { width: screenW } = useWindowSize();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const auth = useSelector((state: AppState) => state.auth);
  const notificationTotal: number =
    useSelector((state: AppState) => state.web.notificationTotal) ?? 0;

  useEffect(() => {
    const getNotification = async () => {
      await notificationServices
        .getCountNotificationUnread()
        .then((res) => dispatch(UpdateNotification({ type: 'set', count: res.total })))
        .catch((err) => console.error('Get Notification', err));
    };

    if (auth?.user.status) getNotification();
    else UpdateNotification({ type: 'reset' });
  }, [auth?.user.id, auth?.user.status, dispatch]);

  return (
    <NotificationWrapper ref={ref}>
      <Dropdown
        placement='bottomRight'
        arrow={{ pointAtCenter: true }}
        dropdownRender={() => (
          <Wrapper>
            <Notification isPopup onClosePopup={() => setIsOpen(false)} isOpen={isOpen} />
          </Wrapper>
        )}
        trigger={['click']}
        open={screenW < 992 ? false : isOpen}
        disabled={router.pathname === '/notification'}
        destroyPopupOnHide
        onOpenChange={setIsOpen}
        getPopupContainer={() => ref.current ?? document.body}>
        <IconAction className='noti' onClick={() => screenW < 992 && router.push('/notification')}>
          <Badge count={notificationTotal}>
            <Icon iconName='bell-notification' />
          </Badge>
        </IconAction>
      </Dropdown>
    </NotificationWrapper>
  );
};

export default HeaderNotification;
