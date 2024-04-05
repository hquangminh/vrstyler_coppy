import { useSelector } from 'react-redux';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import isInstanceEnum from 'functions/isInstanceEnum';

import UserLayout from 'components/Pages/User/Layout';
import MyOrdersPage from 'components/Pages/User/MyOrders';
import OrderDetail from 'components/Pages/User/MyOrders/OrderDetail';
import ModalCancelOrder from 'components/Pages/User/MyOrders/Fragments/ModalCancelOrder';
import MyModels from 'components/Pages/User/MyModels';
import MyLikes from 'components/Pages/User/MyLikes';
import MySettings from 'components/Pages/User/MySettings';

import { AppState } from 'store/type';
import { UserPageProps } from 'models/page.models';
import {
  UserPageOrderSubPage,
  UserPageTabModels,
  UserPageTabName,
  UserPageTabOrder,
  UserPageTabSetting,
  UserType,
} from 'models/user.models';

const UserPage = (props: UserPageProps) => {
  const { page = UserPageTabName.MY_ORDERS, pageSub, orderId } = props;
  const auth = useSelector((state: AppState) => state.auth);

  return (
    <>
      <UserLayout tabName={page} auth={auth}>
        {/* Order */}
        {page === 'my-orders' && (
          <>
            {!orderId && <MyOrdersPage tabName={pageSub ?? null} />}
            {orderId && orderId.length > 0 && <OrderDetail orderId={orderId} />}
          </>
        )}

        {/* Models */}
        {page === 'models' && <MyModels tabName={pageSub ?? null} userID={auth?.user.id} />}

        {/* Like */}
        {page === 'likes' && <MyLikes />}

        {/* Setting */}
        {page === 'settings' && <MySettings auth={auth} tabName={pageSub ?? null} />}
      </UserLayout>

      <ModalCancelOrder />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const path = content.query.content ?? [UserPageTabName.MY_ORDERS];
    const [page, pageSub = null, orderId = ''] = path;

    const isOderTab =
      page === UserPageTabName.MY_ORDERS && pageSub && isInstanceEnum(pageSub, UserPageTabOrder);
    const isOrderSubPage =
      pageSub && isInstanceEnum(pageSub, UserPageOrderSubPage) && orderId.length > 0;
    const isSettingTab =
      page === UserPageTabName.SETTINGS && pageSub && isInstanceEnum(pageSub, UserPageTabSetting);
    const isModelTab =
      page === UserPageTabName.MODELS && pageSub && isInstanceEnum(pageSub, UserPageTabModels);
    const isPageSupported =
      (path.length == 1 && isInstanceEnum(page, UserPageTabName)) ||
      (path.length === 2 && (isOderTab || isSettingTab || isModelTab)) ||
      (path.length === 3 && isOrderSubPage);

    if (!isPageSupported) return { notFound: true };

    const language = await DetectLanguage(content);

    return { props: { page, pageSub, orderId, language } };
  },
  { userAllow: [UserType.CUSTOMER, UserType.SELLER] }
);

export default withLanguage(withLayout(UserPage));
