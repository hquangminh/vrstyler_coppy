import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, Divider, Menu } from 'antd';
import urlPage from 'constants/url.constant';

import useLanguage from 'hooks/useLanguage';
import { onLogout } from 'lib/utils/auth';
import { SelectAuthInfo } from 'store/reducer/auth';

import Icon from 'components/Fragments/Icons';

import { DashboardPage, DashboardPageEnum } from 'models/dashboard.models';
import styled from 'styled-components';
import { UserType } from 'models/user.models';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: #fff;

  position: sticky;
  top: 0;
  align-self: start;

  width: 250px;
  height: 100vh;
  padding: 20px 0;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
  .my-icon {
    margin-left: 28px;
  }
  .custom-avatar {
    width: auto;
    position: relative;
    cursor: pointer;
    padding-right: 42px;
    background: transparent;
    height: 48px;
    font-size: 175px;
  }

  .ant-menu.ant-menu-root {
    flex: auto;
    border: none;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #ccc;
    }

    .ant-menu-item:first-child {
      margin-top: 0;
    }

    .ant-menu-item {
      margin: 0;
      padding: 0 !important;
      height: 48px;
      line-height: 48px;
      background-color: transparent;
      border-radius: 0;
      width: 100%;
      &.ant-menu-item:not(:first-child) {
        margin-top: 24px;
      }
      &.ant-menu-item-selected {
        color: inherit;
        &:after {
          opacity: 0;
        }
      }
      &.ant-menu-item-active {
        background-color: transparent;
        overflow: unset;
        &:after {
          right: unset;
          left: 0;
          border-right-width: 4px;
          transform: translateX(-32px);
          opacity: 1;
        }
        .ant-menu-item-icon {
          color: var(--color-primary-700);
        }
        .ant-menu-title-content {
          color: var(--color-primary-700);
        }
      }
      &.ant-menu-item-only-child {
        height: fit-content;
        .ant-menu-title-content {
          margin-left: 0;
          color: var(--color-primary-700);
        }
        .ant-divider {
          margin: 0;
          border-color: var(--color-gray-6);
        }
      }

      .ant-menu-item-icon {
        font-size: 24px;
        color: var(--color-gray-11);
      }
      .ant-menu-title-content {
        margin-left: 16px;
        font-size: 16px;
      }
    }
    .ant-menu-submenu {
      margin-top: 24px;
      &.ant-menu-submenu-open .ant-menu-submenu-title,
      &.ant-menu-submenu-open .ant-menu-submenu-title .anticon,
      .ant-menu-submenu-title:hover .arrow-top-radius {
        color: var(--color-primary-700);
      }
      .ant-menu-submenu-title {
        margin: 0;
        padding: 0 !important;
        height: 48px;
        line-height: 48px;
        background-color: transparent;
        .ant-menu-item-icon {
          font-size: 24px;
        }
        .ant-menu-title-content {
          margin-left: 16px;
          font-size: 16px;
        }
        .my-icon {
          color: inherit;
          &:hover {
            color: inherit;
          }
        }
      }
      .ant-menu-sub.ant-menu-inline {
        background-color: transparent;
      }
      .ant-menu-item {
        padding: 0;
        padding-left: 16px !important;
        margin-top: 8px !important;
        &:first-child {
          margin-top: 16px;
        }
      }
    }
  }
`;
const Logout = styled.div`
  .ant-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 16px;
    background-color: transparent;
    padding: 0;
    width: 100%;
    height: 48px;
    border-radius: 0;
    &-icon {
      margin-inline-end: 0 !important;
    }
    .my-icon {
      font-size: 24px;
      color: inherit;
    }
  }
`;

type Props = {
  menuActive?: DashboardPage;
};

const DashboardSidebar = (props: Props) => {
  const router = useRouter();
  const { t } = useLanguage();
  const UserInfo = useSelector(SelectAuthInfo);

  const MenuLink = (props: { label: string; link: string }) => (
    <Link
      style={router.pathname.endsWith(props.link) ? { pointerEvents: 'none' } : {}}
      href={props.link}
      shallow={!router.pathname.endsWith(props.link)}
      prefetch>
      {props.label}
    </Link>
  );

  return (
    <Wrapper>
      <Icon iconName='logo-main' className='custom-avatar' onClick={() => router.push('/')} />

      <Menu
        mode='inline'
        defaultOpenKeys={
          props.menuActive?.startsWith('SHOWROOM')
            ? [DashboardPageEnum.SHOWROOM, props.menuActive]
            : undefined
        }
        defaultSelectedKeys={
          props.menuActive?.startsWith('SHOWROOM')
            ? [DashboardPageEnum.SHOWROOM, props.menuActive]
            : undefined
        }
        activeKey={props.menuActive}
        expandIcon={(props) => (
          <Icon
            style={{ transform: `rotateX(${!props.isOpen ? 180 : 0}deg)` }}
            iconName='arrow-top-radius'
          />
        )}
        items={[
          {
            key: DashboardPageEnum.DASHBOARD,
            label: <MenuLink label={t('dashboard_title')} link={urlPage.dashboard} />,
            icon: <Icon iconName='dashboard' />,
          },
          {
            key: DashboardPageEnum.MODEL,
            label: <MenuLink label={t('dashboard_slider_model')} link={urlPage.dashboard_model} />,
            icon: <Icon iconName='model-box' />,
          },
          {
            key: DashboardPageEnum.ORDER,
            label: <MenuLink label={t('dashboard_slider_order')} link={urlPage.dashboard_order} />,
            icon: <Icon iconName='chart' />,
          },
          {
            key: DashboardPageEnum.WITHDRAW,
            label: (
              <MenuLink label={t('dashboard_slider_withdraw')} link={urlPage.dashboard_withdraw} />
            ),
            icon: <Icon iconName='profile' />,
            disabled: UserInfo?.type === UserType.VRSTYLER,
          },
          {
            key: DashboardPageEnum.REVIEW,
            label: (
              <MenuLink label={t('dashboard_slider_review')} link={urlPage.dashboard_review} />
            ),
            icon: <Icon iconName='seller-star' />,
          },
          { key: 'divider', label: <Divider />, disabled: UserInfo?.type !== UserType.SHOWROOM },
          {
            key: DashboardPageEnum.SHOWROOM,
            label: t('dashboard_slider_showroom'),
            icon: <Icon iconName='showroom' />,
            disabled: UserInfo?.type !== UserType.SHOWROOM,
            children: [
              {
                key: DashboardPageEnum.SHOWROOM_THEME,
                label: (
                  <MenuLink
                    label={t('dashboard_slider_theme')}
                    link={urlPage.dashboard_showroom_theme}
                  />
                ),
                icon: <Icon iconName='showroom-dashboard-theme' />,
              },
              {
                key: DashboardPageEnum.SHOWROOM_CARD,
                label: (
                  <MenuLink
                    label={t('dashboard_slider_card')}
                    link={urlPage.dashboard_showroom_card}
                  />
                ),
                icon: <Icon iconName='showroom-dashboard-card' />,
              },
              {
                key: DashboardPageEnum.SHOWROOM_CATEGORY,
                label: (
                  <MenuLink
                    label={t('dashboard_slider_category')}
                    link={urlPage.dashboard_showroom_category}
                  />
                ),
                icon: <Icon iconName='showroom-dashboard-category' />,
              },
            ],
          },
          {
            key: DashboardPageEnum.SETTING,
            label: (
              <MenuLink label={t('dashboard_slider_setting')} link={urlPage.dashboard_setting} />
            ),
            icon: <Icon iconName='setting' />,
            disabled: UserInfo?.type !== UserType.SHOWROOM,
          },
        ].filter((i) => !i.disabled)}
      />
      <Logout>
        <Button icon={<Icon iconName='logout' />} type='text' onClick={onLogout}>
          {t('logout')}
        </Button>
      </Logout>
    </Wrapper>
  );
};

export default DashboardSidebar;
