import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import DashboardLayout from 'components/Layout/Dashboard';
import ShowroomDecoration from 'components/Pages/Dashboard/Showroom/Decoration';

import { PageProps } from 'models/page.models';
import { DashboardPageEnum } from 'models/dashboard.models';
import { UserType } from 'models/user.models';

type Props = PageProps & { themeID: string };

const Index = ({ themeID }: Props) => {
  const title = `Theme design | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <DashboardLayout pageName={DashboardPageEnum.SHOWROOM_THEME}>
        <ShowroomDecoration themeID={themeID} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: Props = {
      language: await DetectLanguage(content),
      themeID: content.query.themeId?.toString() ?? '',
    };
    return { props };
  },
  { userAllow: [UserType.SHOWROOM] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
