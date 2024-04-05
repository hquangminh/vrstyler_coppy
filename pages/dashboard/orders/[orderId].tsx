import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import DashboardLayout from 'components/Layout/Dashboard';
import OrderSoldDetail from 'components/Pages/Dashboard/OrderSold/OrderSoldDetail';

import { PageProps } from 'models/page.models';
import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';

type Props = PageProps & { orderID?: string };

const Index = (props: Props) => {
  const title = `Order Detail | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.ORDER}>
        <OrderSoldDetail orderID={props.orderID} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: Props = {
      language: await DetectLanguage(content),
      orderID: content.query.orderId?.toString(),
    };
    return { props };
  },
  { userAllow: [UserType.SELLER, UserType.SHOWROOM, UserType.VRSTYLER] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
