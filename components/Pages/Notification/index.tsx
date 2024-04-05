import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AppState } from 'store/type';

import { Divider, Button, Tabs, Select, Spin } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';
import { UpdateNotification, notificationUnread } from 'store/reducer/web';
import urlPage from 'constants/url.constant';

import notificationServices, { GetNotificationProps } from 'services/notification-services';
import Header from './Header';
import NotificationCard from './Fragments/NotificationCard';
import Empty from './Fragments/Empty';
import { UserType } from 'models/user.models';
import { NotificationModel, NotificationType } from 'models/notification.models';

import { maxMedia } from 'styles/__media';
import { Container } from 'styles/__styles';
import styled from 'styled-components';

type Props = { isPopup?: boolean; onClosePopup?: () => void; isOpen?: boolean };
type Filter = { is_read: boolean | null; type?: NotificationType; page: number };
type Data = { notifications: NotificationModel[]; total: number };

const Notification = ({ isPopup = false, onClosePopup, isOpen }: Props) => {
  const router = useRouter();
  const auth = useSelector((state: AppState) => state.auth);
  const { langCode, langLabel, t } = useLanguage();

  const totalUnread: number = useSelector(notificationUnread) ?? 0;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>({ notifications: [], total: 0 });
  const [filter, setFilter] = useState<Filter>({ page: 1, is_read: null });

  const pageSize: number = isPopup ? 5 : 10;

  const dispatch = useDispatch();
  const { width: screenW } = useWindowSize();

  const showFilter: boolean = screenW > 640;

  const getNotification = useCallback(
    async (signal: AbortSignal) => {
      if (((isOpen && filter) || router.pathname === urlPage.notification) && auth?.user.status) {
        try {
          setLoading(true);
          const { page, ...params } = filter;
          const requestProps: GetNotificationProps = {
            params,
            limit: pageSize,
            offset: (filter.page - 1) * pageSize,
            configs: { signal },
          };
          const { data, total, un_read } = await notificationServices.getAllNotification(
            requestProps
          );
          if (un_read && totalUnread !== un_read)
            dispatch(UpdateNotification({ type: 'set', count: un_read }));

          if (data)
            setData((current) => {
              const notifications = filter.page === 1 ? data : current.notifications.concat(data);
              return { notifications, total };
            });
          else setData({ notifications: [], total: 0 });

          setLoading(false);
        } catch (error: any) {
          setLoading(false);
        }
      } else setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth?.user.id, auth?.user.status, dispatch, filter, isOpen, pageSize, router.pathname]
  );

  useEffect(() => {
    const controller = new AbortController();
    getNotification(controller.signal);
    return () => controller.abort();
  }, [getNotification]);

  const onDeleteNotification = async (notification: NotificationModel) => {
    try {
      const { id, is_read } = notification;
      const { error } = await notificationServices.deleteRead(id);
      if (!error) {
        setData({ notifications: [], total: 0 });
        setFilter((f) => ({ ...f, page: 1 }));
        if (!is_read) dispatch(UpdateNotification({ type: 'down' }));
      }
    } catch (error) {}
  };

  const onChangeToRead = () => {
    setData((current) => ({
      ...current,
      notifications: current.notifications.map((i) => ({ ...i, is_read: true })),
    }));
    dispatch(UpdateNotification({ type: 'reset' }));
  };

  const onChangeToDelete = () => {
    setData({ notifications: [], total: 0 });
    dispatch(UpdateNotification({ type: 'reset' }));
  };

  const operations = (
    <Select
      style={{ width: 120 }}
      size='large'
      placeholder='Filter'
      getPopupContainer={(elm) => elm || document.body}
      defaultValue={null}
      value={filter.is_read}
      options={[
        { label: langLabel.all, value: null },
        { label: langLabel.read || 'Read', value: true },
        { label: langLabel.unread || 'Unread', value: false },
      ]}
      onChange={(value) => {
        const is_read = typeof value === 'boolean' ? value : null;
        setData({ notifications: [], total: 0 });
        setFilter((f) => ({ ...f, is_read, page: 1 }));
      }}
    />
  );

  return (
    <Wrapper>
      <Container className={!isPopup ? 'container-mobile' : ''}>
        <Header
          loading={loading}
          onChangeToRead={onChangeToRead}
          onChangeToDelete={onChangeToDelete}
        />
        <Divider />
        <div className='tabName'>
          <Tabs
            style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'initial' }}
            defaultActiveKey='all'
            type='line'
            items={[
              { key: 'all', label: t('all', 'All') },
              { key: NotificationType.REVIEW.toString(), label: t('notification_tab_review') },
              { key: NotificationType.COMMENT.toString(), label: t('notification_tab_comment') },
              {
                key: NotificationType.ORDER.toString(),
                label: t('notification_tab_order'),
                disabled: auth?.user?.type === UserType.CUSTOMER,
              },
            ].filter((i) => !i.disabled)}
            tabBarExtraContent={!isPopup && showFilter ? operations : undefined}
            onChange={(key) => {
              const type = key !== 'all' ? Number(key) : undefined;
              setData({ notifications: [], total: 0 });
              setFilter((f) => ({ ...f, type, page: 1 }));
            }}
          />

          <div className={isPopup ? 'scroll-bar' : ''}>
            {loading && auth?.user?.status && filter.page === 1 ? (
              <div
                className={`loading__wrapper ${
                  router.pathname === urlPage.notification ? 'notification-page' : ''
                }`}>
                <Spin size='default' />
              </div>
            ) : (
              data?.notifications.map((notify) => {
                return (
                  <Fragment key={notify.id}>
                    <NotificationCard
                      dataRender={notify}
                      showFilter={showFilter}
                      setNotification={setData}
                      onDeleteNotification={onDeleteNotification}
                      onClosePopup={onClosePopup}
                    />
                    <Divider />
                  </Fragment>
                );
              })
            )}

            {(!auth?.user?.status || (data.total === 0 && !loading)) && (
              <Empty title={langLabel.notification_empty} />
            )}
          </div>

          {!isPopup && data.notifications.length < data.total && (
            <div className='Notification__LoadMores'>
              <Button
                type='primary'
                loading={loading}
                onClick={() => setFilter((f) => ({ ...f, page: f.page + 1 }))}>
                {t('btn_see_more')}
              </Button>
            </div>
          )}

          {isPopup && (
            <>
              {!data.total && <Divider />}
              <Button
                className='Notification_Btn_See_All'
                type='text'
                onClick={() => router.push(`/${langCode}/notification`)}>
                {langLabel.btn_see_all_notify}
              </Button>
            </>
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

export default Notification;

const Wrapper = styled.main`
  padding: 20px 0 40px;
  .ant-tabs-nav-wrap {
    height: 40px;
  }
  .container-mobile {
    padding: 0 50px;
    ${maxMedia.medium} {
      padding: 0;
    }
    .ant-tabs-nav-wrap {
      height: 65px;
      .ant-tabs-tab {
        padding: 10px 0;
        margin: 0 16px 0 0 !important;
        ${maxMedia.small} {
          margin: 0 12px 0 0 !important;
        }
      }
    }
  }
  ${maxMedia.medium} {
    margin: 0;
    padding-bottom: 80px;
    padding-top: 0;
  }

  .scroll-bar {
    max-height: calc(100vh - 220px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
  }
  margin: 0 auto 80px auto;
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--color-gray-6);
    line-height: 1.5;
  }
  .ant-tabs-tab-active {
    font-size: 14px;
    color: var(--color-primary-700);
    line-height: 1.5;
    font-weight: 400;
  }
  .ant-select-selection-placeholder {
    color: #424153;
    font-size: 14px;
    font-weight: 400;
  }
  .ant-select {
    width: 100px;
    .ant-select-dropdown {
      .ant-select-item {
        font-size: 14px;
        font-weight: 400;
        color: #424153;

        &:hover.ant-select-item-option-active {
          background-color: var(--color-primary-50);
        }
        &.ant-select-item-option-active {
          background-color: transparent;
        }
        &.ant-select-item-option-selected {
          background-color: var(--color-primary-100);
        }
      }
    }
  }
  .ant-select-selection-item {
    color: #424153;
    font-size: 14px;
    line-height: 1.5;
  }
  .Notification__LoadMores {
    margin: 40px 0 40px 0;
    text-align: center;
    .ant-btn {
      font-size: 12px;
      line-height: 1;
      text-transform: uppercase;
    }
    ${maxMedia.small} {
      margin: 15px 0 0 0;
    }
  }
  .Notification_Btn_See_All {
    width: 100%;
    height: 40px;
    font-weight: 400;
    color: var(--color-gray-7);
    background-color: #fff;
    border-top: 1px solid #e3e3e8;
    border-radius: 0;
  }
  .ant-tabs-top > .ant-tabs-nav {
    margin: 0;
    padding: 0 10px;
    ${maxMedia.medium} {
      padding: 0 16px;
    }
  }
  .notification-dropdown-action {
    .ant-dropdown-menu {
      padding: 4px;
      .ant-dropdown-menu-item {
        padding: 8px;
        text-align: left;
        &:has(.ant-divider) {
          padding: 0;
        }
        &:first-child:hover {
          background-color: var(--color-primary-100);
        }
        &:last-child {
          color: #ba3d4f;
          &:hover {
            background-color: var(--color-red-1);
          }
        }
      }
      .ant-dropdown-menu-item-divider {
        margin: 0;
      }
    }
  }

  .loading__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;

    &.notification-page {
      height: 400px;
    }
  }
`;
