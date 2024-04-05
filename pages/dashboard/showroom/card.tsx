import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import DashboardLayout from 'components/Layout/Dashboard';
import DashboardShowroomCard from 'components/Pages/Dashboard/Showroom/Card';

import { PageProps } from 'models/page.models';
import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';

const Index = () => {
  const title = `Card setting | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.SHOWROOM_CARD}>
        <DashboardShowroomCard />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = { language: await DetectLanguage(content) };
    return { props };
  },
  { userAllow: [UserType.SHOWROOM] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
