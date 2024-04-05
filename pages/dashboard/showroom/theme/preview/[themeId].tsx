import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import ShowroomDetailComponent from 'components/Pages/Showroom/ShowroomDetail';

import { UserType } from 'models/user.models';
import { PageProps } from 'models/page.models';

const Index = (props: PageProps) => {
  const title = `Theme preview | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <ShowroomDetailComponent page='view' me={props.auth?.user} onlyRead />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const language = await DetectLanguage(content);
    return { props: { language } };
  },
  { userAllow: [UserType.SHOWROOM] }
);

export default withLanguage(withLayout(Index, { header: { isSearch: false } }));
