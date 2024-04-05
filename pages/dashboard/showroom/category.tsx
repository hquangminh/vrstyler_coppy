import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import DashboardLayout from 'components/Layout/Dashboard';
import ShowroomCategoryComponent from 'components/Pages/Dashboard/Showroom/Category';

import { PageProps } from 'models/page.models';
import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';

const Index = () => {
  const title = `Category | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.SHOWROOM_CATEGORY}>
        <ShowroomCategoryComponent />
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
