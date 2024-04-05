import { CSSProperties, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Badge, Button, ConfigProvider, Input, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';
import useWindowScroll from 'hooks/useWindowScroll';
import useDetectMobile from 'hooks/useDetectMobile';

import checkoutServices from 'services/checkout-services';

import { AppState } from 'store/type';
import { OpenCart, OpenMenuMobile, OpenSearch, OpenSellerRegister } from 'store/reducer/modal';
import { GetCart, ResetCartRedux } from 'store/reducer/cart';

import NotificationBar from 'components/Fragments/NotificationBar';
import HeaderUser from 'components/Fragments/HeaderUser';
import Icon from 'components/Fragments/Icons';
import HeaderMenu from './Fragments/Menu';
import HeaderNotification from './Fragments/Notification';

import { UserType } from 'models/user.models';
import { PageProps } from 'models/page.models';

import { Container } from 'styles/__styles';
import * as SC from './style';

type Props = PageProps & {
  page?: 'modeling-service';
  isSearch: boolean;
  style?: CSSProperties;
};

const Header = (props: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { langCode, langLabel } = useLanguage();
  const { width: screenW } = useWindowSize();
  const pageYOffset = useWindowScroll();
  const isMobile = useDetectMobile();

  const [topFixed, setTopFixed] = useState<number | undefined>(0);
  const [showModal, setShowModal] = useState(false);

  const auth = useSelector((state: AppState) => state.auth);
  const cartCount: number = useSelector((state: AppState) => state.cart.products?.length ?? 0);
  const isNotificationBar = useSelector((state: AppState) => state.web.notificationBar);

  const isLogged = typeof auth?.token === 'string';
  const isHome: boolean = router.pathname === '/' && pageYOffset < 100;
  const showSearch: boolean = props.page !== 'modeling-service';
  const showCart: boolean =
    props.page !== 'modeling-service' &&
    props.auth !== null &&
    props.auth !== undefined &&
    ![UserType.SHOWROOM, UserType.VRSTYLER].includes(props.auth.user.type);
  const showNotify: boolean = isLogged && screenW > 991 && props.page !== 'modeling-service';
  const showBecomeSeller: boolean =
    screenW > 991 && auth?.user?.type === 1 && props.page !== 'modeling-service';
  const showUpload: boolean =
    screenW > 991 && isLogged && auth?.user?.type !== 1 && props.page !== 'modeling-service';

  useEffect(() => {
    setTopFixed(document?.getElementsByClassName('header--noti-bar')[0]?.clientHeight);
  }, [screenW, isNotificationBar]);

  //Get Cart
  useEffect(() => {
    const onGetCart = async () => {
      await checkoutServices
        .getCart()
        .then((res) => dispatch(GetCart(res.data || [])))
        .catch(() => dispatch(ResetCartRedux()));
    };

    if (props.auth?.token && props.auth?.user?.status && showCart) onGetCart();
    else dispatch(ResetCartRedux());
  }, [dispatch, props.auth, showCart]);

  const checkSellerActive = async () => {
    if (props.auth?.user?.status) {
      dispatch(OpenSellerRegister());
    } else {
      setShowModal(true);
      Modal.confirm({
        icon: null,
        closable: true,
        style: { top: 60 },
        width: 384,
        open: showModal,
        title: langLabel.register_sale_fail_title,
        content: langLabel.register_sale_fail_description,
        okText: langLabel.btn_yes || 'Yes',
        cancelText: langLabel.btn_no || 'No',
        onCancel: () => setShowModal(false),
        onOk: () => {
          router.push('/verify');
        },
      });
    }
  };

  return (
    <SC.Wrapper
      $isHome={isHome}
      $top={topFixed ? -topFixed : 0}
      style={{ ...props.style, borderColor: !isHome ? 'var(--color-gray-4)' : 'transparent' }}>
      {isNotificationBar && <NotificationBar className='header--noti-bar' />}

      <SC.Header__Nav $isHome={isHome}>
        <Container
          className='header_box'
          size={props.page === 'modeling-service' ? 'default' : 'large'}>
          <SC.Left>
            <SC.IconAction
              className='btn-open-menu'
              $isHome={isHome}
              onClick={() => dispatch(OpenMenuMobile())}>
              <Icon iconName={'menu'} />
            </SC.IconAction>

            <SC.Logo $isHome={isHome}>
              <Link href={`/${langCode}`} aria-label='Logo'>
                <Icon
                  iconName={isHome ? 'logo-white' : 'logo-main'}
                  className={'logo' + (props.page === 'modeling-service' ? ' --black' : '')}
                />
              </Link>
            </SC.Logo>

            {screenW > 991 && <HeaderMenu isHome={isHome} />}
          </SC.Left>

          <SC.Right $isHome={isHome}>
            {screenW > 1400 && props.isSearch && showSearch && (
              <SC.SearchBox $isHome={isHome} onClick={() => dispatch(OpenSearch())}>
                <Input
                  placeholder={langLabel.header_search_placeholder}
                  suffix={<Icon iconName='search' />}
                  disabled
                />
              </SC.SearchBox>
            )}

            <SC.IconActionGroup $isHome={isHome}>
              {screenW > 0 && screenW <= 1400 && props.isSearch && showSearch && (
                <SC.IconAction onClick={() => dispatch(OpenSearch())}>
                  <Icon iconName='search' />
                </SC.IconAction>
              )}

              {showBecomeSeller && (
                <ConfigProvider theme={{ token: { colorPrimary: '#ffa351' } }}>
                  <Button
                    type='primary'
                    onClick={checkSellerActive}
                    className='btn_become_a_seller'>
                    {langLabel.header_become_seller}
                  </Button>
                </ConfigProvider>
              )}

              {showNotify && <HeaderNotification />}

              {showUpload && (
                <SC.IconAction className='upload' onClick={() => router.push('/upload-model/new')}>
                  <UploadOutlined className='my-icon' />
                </SC.IconAction>
              )}
            </SC.IconActionGroup>

            {showCart && (
              <SC.IconAction
                $isHome={isHome}
                $disable={router.pathname === '/cart'}
                onClick={() => router.pathname !== '/cart' && dispatch(OpenCart())}>
                <Badge count={cartCount}>
                  <Icon iconName='shopping-cart' />
                </Badge>
              </SC.IconAction>
            )}

            <HeaderUser isHome={isHome} isMobile={isMobile} />
          </SC.Right>
        </Container>
      </SC.Header__Nav>
    </SC.Wrapper>
  );
};

export default Header;
