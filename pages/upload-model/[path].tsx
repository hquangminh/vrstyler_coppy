import Head from 'next/head';

import config from 'config';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import UploadModel from 'components/Pages/UploadModel';
import UploadModelProvider from 'components/Pages/UploadModel/Provider';

import { PageProps } from 'models/page.models';
import { UserType } from 'models/user.models';

type Props = PageProps & { productID?: string };

const Index = (props: Props) => {
  if (!props.auth) return null;

  const title = `Upload Model | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UploadModelProvider productID={props.productID} me={props.auth.user}>
        <UploadModel />
      </UploadModelProvider>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (context) => {
    let props: Props = { language: await DetectLanguage(context) };
    if (context.query.path !== 'new') props.productID = context.query.path?.toString();

    return { props };
  },
  { userAllow: [UserType.SELLER, UserType.SHOWROOM, UserType.VRSTYLER] }
);

export default withLanguage(withLayout(Index));
