import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';
import { PageProps } from 'models/page.models';

import DashboardLayout from 'components/Layout/Dashboard';
import DashboardComponent from 'components/Pages/Dashboard/General';

const Index = () => {
  const title = `Dashboard | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.DASHBOARD}>
        <DashboardComponent />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const props: PageProps = { language: await DetectLanguage(content) };
    return { props };
  },
  { userAllow: [UserType.SELLER, UserType.SHOWROOM, UserType.VRSTYLER] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
