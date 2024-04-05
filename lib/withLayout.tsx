import React, { CSSProperties, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import axios from 'axios';
import { FloatButton } from 'antd';

import { AppState } from 'store/type';
import { CloseCart, CloseSearch, CloseSellerRegister } from 'store/reducer/modal';
import { ClearAuthRedux, SaveAuthRedux } from 'store/reducer/auth';
import {
  HideNotificationBar,
  MovePageEnd,
  MovePageStart,
  ShowNotificationBar,
} from 'store/reducer/web';

import useRouterChange from 'hooks/useRouterChange';
import useDetectMobile from 'hooks/useDetectMobile';

import Header from 'components/Layout/Header';
import MenuAvatar from 'components/Layout/MenuAvatar';
import MenuMobile from 'components/Layout/MenuMobile';
import SearchDrawer from 'components/Layout/Search';
import Footer from 'components/Layout/Footer';
import CartPreview from 'components/Layout/CartPreview';
import SalesRegistration from 'components/Pages/SalesRegistration';
import LoadingPage from 'components/Fragments/LoadingPage';
import BannerFreeFragment from 'components/Fragments/BannerFree';
import NotSupportSmallScreen from 'components/Pages/Dashboard/Fragments/NotSupportSmallScreen';

import { ContainerSize } from 'models';
import { PageProps } from 'models/page.models';
import { UserType } from 'models/user.models';

type PropsLayoutType = {
  header?: { page?: 'modeling-service'; show?: boolean; isSearch?: boolean; style?: CSSProperties };
  footer?: { show?: boolean; containerSize?: ContainerSize; style?: CSSProperties };
};

export default function withLayout<T>(
  BaseComponent: React.ComponentType<T & PageProps>,
  propsLayout?: PropsLayoutType
) {
  const App = (props: T & PageProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isMobile = useDetectMobile();
    const isMovingPage = useSelector((state: AppState) => state.web.movingPage);
    const isNotificationBar = useSelector((state: AppState) => state.web.notificationBar);

    const { header, footer } = propsLayout ?? {};

    const showFooter = typeof footer?.show !== 'undefined' ? footer.show : true;
    const showHeader = typeof header?.show !== 'undefined' ? header.show : true;
    const isSearchHeader = typeof header?.isSearch !== 'undefined' ? header.isSearch : true;
    const allowRegisterSeller = props.auth && props.auth.user.type === UserType.CUSTOMER;

    if (props.auth?.token)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + props.auth.token;

    useEffect(() => {
      // Reset Redux
      dispatch(CloseCart());
      dispatch(CloseSearch());
      dispatch(CloseSellerRegister());
    }, [dispatch]);

    useEffect(() => {
      if (props.auth) {
        dispatch(SaveAuthRedux(props.auth));
        if (!props.auth.user.email && typeof isNotificationBar !== 'boolean')
          dispatch(ShowNotificationBar());
        else if (props.auth.user.email) dispatch(HideNotificationBar());
      } else dispatch(ClearAuthRedux());
    }, [dispatch, isNotificationBar, props.auth]);

    // Remove payment_intent_client_secret when not checkout
    useEffect(() => {
      if (router.pathname !== '/checkout') localStorage.removeItem('payment_intent_client_secret');
    }, [router]);

    //Show loading page when change page
    useRouterChange(
      (_, { shallow }) => {
        if (!shallow) dispatch(MovePageStart());
      },
      () => dispatch(MovePageEnd())
    );

    if (isMobile && router.pathname.startsWith('/dashboard')) return <NotSupportSmallScreen />;

    return (
      <>
        {isMovingPage && <LoadingPage blur />}

        {showHeader && (
          <Header {...props} isSearch={isSearchHeader} style={header?.style} page={header?.page} />
        )}

        <BaseComponent {...props} />

        {showFooter && <Footer style={footer?.style} containerSize={footer?.containerSize} />}
        {isMobile && <MenuAvatar {...props} />}
        {isMobile && <MenuMobile />}

        <BannerFreeFragment />
        <CartPreview />
        <SearchDrawer />
        {allowRegisterSeller && <SalesRegistration />}
        <FloatButton.BackTop
          visibilityHeight={600}
          duration={1000}
          style={{ right: '30px', bottom: '30px' }}
        />
      </>
    );
  };

  return App;
}
