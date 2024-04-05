import { memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { urlGoToProfile } from 'common/functions';
import { CheckOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';

import useLanguage from 'hooks/useLanguage';
import { onLogout } from 'lib/utils/auth';
import { avtDefault } from 'common/constant';
import urlPage from 'constants/url.constant';
import { OpenMenuAvatar } from 'store/reducer/modal';
import { SelectAuthInfo } from 'store/reducer/auth';

import Icon from './Icons';
import MyImage from './Image';

import { UserType } from 'models/user.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const Wrapper = styled.div<{ $isHome?: boolean }>`
  display: flex;
  align-items: center;

  height: 4.2rem;
  border-radius: 3rem;
  transition: background-color 0.16s ease 0s;

  .avatar {
    display: flex;
    border: 0.5px solid #f1f1f1;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;

    ${maxMedia.medium} {
      width: 24px;
      height: 24px;
    }
  }

  .ant-dropdown-menu {
    padding: 16px;
    min-width: 220px;
    margin-top: 0.9rem;
    border-radius: 1rem;
    .ant-dropdown-menu-item-divider {
      margin: 8px 0;
    }
    .Menu_Item_Language .ant-dropdown-menu-title-content {
      display: inline-flex;
      justify-content: space-between;
      padding-right: 16px;
    }
    .ant-dropdown-menu-item,
    .ant-dropdown-menu-submenu-title {
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 8px;
      &:hover {
        background-color: var(--color-gray-3);
      }
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &.header-dropdown-user-info {
        padding: 0;
        .ant-dropdown-menu-title-content {
          padding: 8px;
        }
      }
      .ant-dropdown-menu-item-icon {
        font-size: 20px;
        color: var(--color-gray-9);
      }
      .ant-dropdown-menu-title-content {
        color: var(--color-gray-8);
      }
    }
  }
  .Menu_Language_Dropdown {
    min-width: 216px;
    .ant-dropdown-menu-item {
      flex-direction: row-reverse;
      &.active {
        background-color: var(--color-gray-5);
      }
      .ant-dropdown-menu-item-icon {
        font-size: 16px;
      }
    }
  }
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.32px;
  color: var(--color-gray-11);
  .ant-avatar {
    height: 40px;
    flex: 0 0 40px;
  }
  .user_name {
    color: #161723;
    font-weight: 500;
  }
`;

type Props = { isHome?: boolean; isMobile?: boolean };

const HeaderUser = (props: Props) => {
  const { isHome, isMobile } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const i18n = useLanguage();
  const user = useSelector(SelectAuthInfo);

  const ref = useRef(null);

  const handelGoToProfile = () => {
    const profileUrl = user ? urlGoToProfile(user.type, user.nickname) : '';
    if (profileUrl) router.push(profileUrl);
  };

  const onChangePage = (url: string) => {
    if (url !== router.asPath) router.push(url);
  };

  const menuLogin: ItemType = {
    key: 'login',
    label: i18n.t('login'),
    icon: <Icon iconName='login-outline' />,
    className: user ? 'hide' : undefined,
    onClick: () => onChangePage('/login'),
  };

  const menuLogout: ItemType = {
    key: 'logout',
    label: i18n.t('logout'),
    icon: <Icon iconName='logout' />,
    className: !user ? 'hide' : undefined,
    onClick: () => onLogout(),
  };

  const menuLanguage: ItemType = {
    key: 'language',
    label: (
      <>
        {i18n.t('header_language')}
        <span>{i18n.langCode}</span>
      </>
    ),
    icon: <Icon iconName='global-outline' />,
    className: 'Menu_Item_Language',
    children: i18n.languages?.map((i) => ({
      key: i.language_code,
      label: i.language_name,
      icon: i18n.langCode === i.language_code ? <CheckOutlined /> : undefined,
      className: i18n.langCode === i.language_code ? 'active' : undefined,
      onClick: () => i18n.handleChangeLanguage(i.language_code),
    })),
    popupClassName: 'Menu_Language_Dropdown',
  };

  const menu: MenuProps['items'] = [
    {
      key: 'user',
      label: (
        <UserInfo>
          <Avatar src={user ? user.image : '/static/images/avatar-default.png'} />
          <Typography.Paragraph className='user_name mb-0 text-truncate-line'>
            {user?.name}
          </Typography.Paragraph>
        </UserInfo>
      ),
      className: 'header-dropdown-user-info' + (!user ? ' hide' : ''),
      onClick: handelGoToProfile,
    },
    {
      type: 'divider',
      style: { marginBlock: 8, marginTop: 0 },
      className: !user ? 'hide' : undefined,
    },
    menuLogin,
    {
      key: 'dashboard',
      label: i18n.t('header_user_menu_seller_channel'),
      icon: <Icon iconName='showroom' />,
      className: !user || user.type === UserType.CUSTOMER ? 'hide' : undefined,
      onClick: () => onChangePage('/dashboard'),
    },
    {
      type: 'divider',
      className: !user || user.type === UserType.CUSTOMER ? 'hide' : undefined,
    },
    {
      key: 'my-orders',
      label: i18n.t('header_user_menu_my_profile'),
      icon: <Icon iconName='user-outline-circle' />,
      className:
        !user || user.type === UserType.SHOWROOM || user.type === UserType.VRSTYLER
          ? 'hide'
          : undefined,
      onClick: () => onChangePage('/user/my-orders'),
    },
    {
      key: 'models',
      label: i18n.t('header_user_menu_my_model'),
      icon: <Icon iconName='model-box' />,
      className:
        !user || user.type === UserType.SHOWROOM || user.type === UserType.VRSTYLER
          ? 'hide'
          : undefined,
      onClick: () => onChangePage('/user/models'),
    },
    {
      key: 'homepage',
      label: i18n.t('header_menu_homepage'),
      icon: <Icon iconName='showroom-dashboard-home' />,
      className: !user || user.type !== UserType.SHOWROOM ? 'hide' : undefined,
      onClick: () => onChangePage(`/showroom/${user?.nickname}`),
    },
    menuLanguage,
    { type: 'divider', className: !user ? 'hide' : undefined },
    {
      key: 'notification',
      label: i18n.t('header_user_menu_notification'),
      icon: <Icon iconName='bell-notification' />,
      className: !user ? 'hide' : undefined,
      onClick: () => onChangePage('/notification'),
    },
    {
      key: 'setting',
      label: i18n.t('header_user_menu_setting'),
      icon: <Icon iconName='setting-outline' />,
      className:
        !user || user.type === UserType.SHOWROOM || user.type === UserType.VRSTYLER
          ? 'hide'
          : undefined,
      onClick: () => onChangePage('/user/settings'),
    },
    { type: 'divider', className: !user ? 'hide' : undefined },
    menuLogout,
  ];

  const modelingMenu: MenuProps['items'] = [
    menuLogin,
    {
      key: 'dashboard',
      label: i18n.t('dashboard_title'),
      icon: <Icon iconName='dashboard' />,
      className: !user ? 'hide' : undefined,
      onClick: () => onChangePage(urlPage.modeling_order),
    },
    menuLanguage,
    {
      type: 'divider',
      className: !user ? 'hide' : undefined,
    },
    menuLogout,
  ];

  return (
    <Wrapper ref={ref} $isHome={isHome}>
      {isMobile ? (
        <div onClick={() => dispatch(OpenMenuAvatar())}>
          <Avatar src={user ? user.image : ''} />
        </div>
      ) : (
        <Dropdown
          menu={{
            items: (router.pathname === '/modeling' ? modelingMenu : menu).filter(
              (i) => !i?.className?.split(' ').includes('hide')
            ),
            triggerSubMenuAction: 'click',
            getPopupContainer: () => ref.current ?? document.body,
          }}
          overlayStyle={{ width: '268px' }}
          trigger={['click']}
          placement='bottomRight'
          getPopupContainer={() => ref.current ?? document.body}>
          <span>
            <Avatar src={user ? user.image : ''} />
          </span>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default HeaderUser;

const Avatar = memo(function Avatar({ src }: { src: string }) {
  return (
    <MyImage
      className='avatar'
      src={src}
      img_error={avtDefault}
      alt='Avatar'
      width={32}
      height={32}
    />
  );
});
