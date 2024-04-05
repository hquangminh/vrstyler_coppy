import Head from 'next/head';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';

import CartPage from 'components/Pages/Cart';
import { UserType } from 'models/user.models';

const Index = () => {
  const title = `Cart | ${config.websiteName}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <CartPage />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const language = await DetectLanguage(content);
    return { props: { language } };
  },
  { userAllow: [UserType.CUSTOMER, UserType.SELLER] }
);

export default withLanguage(withLayout(Index));
