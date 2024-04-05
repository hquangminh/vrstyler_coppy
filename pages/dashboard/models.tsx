import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import DashboardLayout from 'components/Layout/Dashboard';
import ModelsComponent from 'components/Pages/Dashboard/Models';

import { PageProps } from 'models/page.models';
import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';

const Index = () => {
  const title = `Models | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.MODEL}>
        <ModelsComponent />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = { language: await DetectLanguage(content) };
    return { props };
  },
  { userAllow: [UserType.SELLER, UserType.SHOWROOM, UserType.VRSTYLER] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
