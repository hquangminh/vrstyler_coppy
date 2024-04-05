import { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { App } from 'antd';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';
import { decimalPrecision } from 'common/functions';
import sellerServices from 'services/seller-services';

import WithdrawComponent from 'components/Pages/Withdraw';

import { UserType } from 'models/user.models';

const Index = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { t } = useLanguage();

  const [isChecking, setIsChecking] = useState(true);
  const [minWithdraw, setMinWithdraw] = useState<number>(0);
  const [totalWithdraw, setTotalWithdraw] = useState<number>(0);

  const onCheckBalance = useCallback(async () => {
    try {
      const fetchBalance = sellerServices.getTotalAmount();
      const fetchMinimum = sellerServices.getMinWithdraw();
      const [balance, minimum] = await Promise.all([fetchBalance, fetchMinimum]);
      if (balance.data.available < Number(minimum.data)) {
        message.error({
          key: 'not_enough_money_to_withdraw',
          content: t('dashboard_withdraw_not_enough_money_to_withdraw'),
        });
        router.push(urlPage.dashboard_withdraw);
        throw new Error('');
      }
      setMinWithdraw(Number(minimum.data));
      setTotalWithdraw(balance.data.available);
      setIsChecking(false);
    } catch (error) {
      router.push(urlPage.dashboard_withdraw);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onCheckBalance();
  }, [onCheckBalance]);

  const title = `${isChecking ? 'Checking balance' : 'Withdraw'} | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {!isChecking && (
        <WithdrawComponent
          minWithdraw={decimalPrecision(minWithdraw, 3)}
          loading={isChecking}
          maxWithdraw={decimalPrecision(totalWithdraw, 3)}
          loadingMaxWithdraw={isChecking}
        />
      )}
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const language = await DetectLanguage(content);
    return { props: { language } };
  },
  { userAllow: [UserType.SELLER, UserType.SHOWROOM] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
