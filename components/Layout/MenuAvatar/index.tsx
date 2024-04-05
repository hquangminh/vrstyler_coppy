import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Menu, MenuProps } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';
import { onLogout } from 'lib/utils/auth';
import { avtDefault } from 'common/constant';
import urlPage from 'constants/url.constant';
import categoryServices from 'services/category-services';
import { AppState } from 'store/type';
import { SaveCategory } from 'store/reducer/web';
import { CloseMenuAvatar } from 'store/reducer/modal';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';

import { UserType } from 'models/user.models';
import { PageProps } from 'models/page.models';

import * as SC from './style';

const MenuAvatar = (props: PageProps) => {
  const { auth } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const { width } = useWindowSize();
  const { languages, langCode, langLabel, t, handleChangeLanguage } = useLanguage();

  const visible = useSelector((state: AppState) => state.modal.menuAvatar);
  const categories = useSelector((state: AppState) => state.web.categories);

  const [open, setOpen] = useState<boolean>(false);

  // Get Category
  useEffect(() => {
    const fetchCategory = async () => {
      await categoryServices.getAllCategory().then((res) => dispatch(SaveCategory(res.data)));
    };
    !categories && fetchCategory();
  }, [categories, dispatch]);

  useEffect(() => {
    if (visible || (visible && width > 991)) dispatch(CloseMenuAvatar());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, dispatch]);

  useEffect(() => {
    if (visible) document.body.style.overflowY = 'hidden';
    else document.body.style.removeProperty('overflow-y');
  }, [visible]);

  const onChangePage = (page: string = '') => {
    if (page !== router.asPath) router.push({ pathname: page });
    dispatch(CloseMenuAvatar());
  };

  const menuMain: MenuProps['items'] = [
    { type: 'divider', className: !auth?.user ? 'hide' : undefined },
    {
      key: 'login',
      label: langLabel.login || 'Login',
      icon: <Icon iconName='login-outline' className='my_icon' />,
      className: auth?.token ? 'hide' : '',
      onClick: () => onChangePage('/login'),
    },
    {
      key: 'my-orders',
      label: langLabel.header_user_menu_my_profile,
      icon: <Icon iconName='user-outline-circle' className='my_icon' />,
      className: !auth?.user || auth?.user.type === UserType.SHOWROOM ? 'hide' : '',
      onClick: () => onChangePage('/user/my-orders'),
    },
    {
      key: 'models',
      label: langLabel.header_user_menu_my_model,
      icon: <Icon iconName='model-box' className='my_icon' />,
      className: !auth?.user || auth?.user.type === UserType.SHOWROOM ? 'hide' : '',
      onClick: () => onChangePage('/user/models'),
    },
    {
      key: 'homepage',
      label: langLabel.header_menu_homepage,
      icon: <Icon iconName='showroom-dashboard-home' className='my_icon' />,
      className: !auth?.user || auth?.user.type !== UserType.SHOWROOM ? 'hide' : '',
      onClick: () => onChangePage(`/showroom/${auth?.user?.nickname}`),
    },
    {
      key: 'language',
      label: (
        <div className='text_language' onClick={() => setOpen(!open)}>
          {t('header_language')}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{langCode}</span>
            <span className={'arrow_dropdown ' + (open ? 'arrow_dropdown_active' : '')}>
              <RightOutlined />
            </span>
          </div>
        </div>
      ),
      icon: <Icon iconName='global-outline' className='my_icon_language' />,
      className: 'Menu_Item_Language',
      children: languages?.map((i) => ({
        key: i.language_code,
        label: (
          <div className='language-label'>
            <span className='language-name'>{i.language_name}</span>
            {langCode === i.language_code && (
              <span className='check-icon-language'>
                <CheckOutlined />
              </span>
            )}
          </div>
        ),
        className: langCode === i.language_code ? 'active_language' : undefined,
        onClick: () => handleChangeLanguage(i.language_code),
      })),
    },
    { type: 'divider', className: !auth?.user ? 'hide' : undefined },
    {
      key: 'notification',
      label: langLabel.header_user_menu_notification,
      icon: <Icon iconName='bell-notification' className='my_icon' />,
      className: !auth?.user ? 'hide' : '',
      onClick: () => onChangePage('/notification'),
    },
    {
      key: 'setting',
      label: langLabel.header_user_menu_setting,
      icon: <Icon iconName='setting-outline' className='my_icon' />,
      className: !auth?.user || auth?.user.type === UserType.SHOWROOM ? 'hide' : '',
      onClick: () => onChangePage('/user/settings'),
    },
    { type: 'divider', className: !auth?.user ? 'hide' : undefined },
    {
      key: 'logout',
      label: langLabel.logout,
      icon: <Icon iconName='logout' className='my_icon' />,
      className: !auth ? 'hide' : undefined,
      onClick: () => onLogout(),
    },
  ];

  const menuModeling: MenuProps['items'] = [
    { type: 'divider', className: !auth?.user ? 'hide' : undefined },
    {
      key: 'login',
      label: langLabel.login || 'Login',
      icon: <Icon iconName='login-outline' className='my_icon' />,
      className: auth ? 'hide' : '',
      onClick: () => onChangePage('/login'),
    },
    {
      key: 'dashboard',
      label: t('dashboard_title'),
      icon: <Icon iconName='dashboard' className='my_icon' />,
      className: !auth ? 'hide' : undefined,
      onClick: () => onChangePage(urlPage.modeling_order),
    },
    {
      key: 'language',
      label: (
        <div className='text_language' onClick={() => setOpen(!open)}>
          {t('header_language')}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{langCode}</span>
            <span className={'arrow_dropdown ' + (open ? 'arrow_dropdown_active' : '')}>
              <RightOutlined />
            </span>
          </div>
        </div>
      ),
      icon: <Icon iconName='global-outline' className='my_icon_language' />,
      className: 'Menu_Item_Language',
      children: languages?.map((i) => ({
        key: i.language_code,
        label: (
          <div className='language-label'>
            <span className='language-name'>{i.language_name}</span>
            {langCode === i.language_code && (
              <span className='check-icon-language'>
                <CheckOutlined />
              </span>
            )}
          </div>
        ),
        className: langCode === i.language_code ? 'active_language' : undefined,
        onClick: () => handleChangeLanguage(i.language_code),
      })),
    },
    { type: 'divider', className: !auth ? 'hide' : undefined },
    {
      key: 'logout',
      label: langLabel.logout,
      icon: <Icon iconName='logout' className='my_icon' />,
      className: !auth ? 'hide' : undefined,
      onClick: () => onLogout(),
    },
  ];

  return (
    <Drawer
      placement='right'
      closable={false}
      width='100%'
      styles={{ body: { padding: 0 } }}
      open={visible}
      onClose={() => dispatch(CloseMenuAvatar())}>
      <SC.MenuMobile_Wrapper>
        {!auth ? (
          <SC.MenuMobile_Header_No_Active>
            <div className='avatar_right'>
              <Button
                className='btn_close'
                type='text'
                onClick={() => dispatch(CloseMenuAvatar())}
                icon={<Icon iconName='close-medium' />}
              />
            </div>
          </SC.MenuMobile_Header_No_Active>
        ) : (
          <SC.MenuMobile_Header>
            <div className='avatar'>
              <Flex gap={14} align='center' className='avatar_left'>
                <MyImage
                  src={auth.user.image}
                  img_error={avtDefault}
                  alt='Avatar'
                  width={40}
                  height={40}
                />
                <div className='avatar-info-title'>
                  <span className='avatar-name text-truncate'>{auth?.user?.name}</span>
                  <span className='avatar-type text-truncate'>
                    {auth.user.type === UserType.SELLER ? 'Seller' : null}
                    {auth.user.type === UserType.SHOWROOM ? 'Showroom' : null}
                  </span>
                </div>
              </Flex>
              <div className='avatar_right'>
                <Button
                  className='btn_close'
                  type='text'
                  onClick={() => dispatch(CloseMenuAvatar())}
                  icon={<Icon iconName='close-medium' />}
                />
              </div>
            </div>
          </SC.MenuMobile_Header>
        )}

        <SC.MenuMobile_Content>
          <SC.MenuList>
            <Menu
              items={router.pathname === urlPage.modeling_homepage ? menuModeling : menuMain}
              className='menu_list'
              mode='inline'
            />
          </SC.MenuList>
        </SC.MenuMobile_Content>
      </SC.MenuMobile_Wrapper>
    </Drawer>
  );
};

export default MenuAvatar;
