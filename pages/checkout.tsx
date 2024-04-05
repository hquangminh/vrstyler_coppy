import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { message, notification, Spin } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import config from 'config';
import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';
import { RemoveCouponRedux } from 'store/reducer/cart';
import checkoutServices, { CreateSessionBody } from 'services/checkout-services';

import useLanguage from 'hooks/useLanguage';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import urlPage from 'constants/url.constant';

import CheckoutPage from 'components/Pages/Checkout';

import { AppState } from 'store/type';
import { PageProps } from 'models/page.models';
import { UserType } from 'models/user.models';

const stripePromise = loadStripe(config.stripePublicKey);

const Index = (props: PageProps) => {
  const dispatch = useDispatch();
  const { langLabel, langCode } = useLanguage();

  const router = useRouter();

  const coupon = useSelector((state: AppState) => state.cart.coupon);
  const products = useSelector((state: AppState) => state.cart.products);
  const availableProducts = products?.filter(
    (product) => product.market_item.is_available !== false
  );

  const [checking, setChecking] = useState<boolean>(true);
  const [checkoutToken, setCheckoutToken] = useState<string>();
  const [bodyCreateOrder, setBodyCreateOrder] = useState<CreateSessionBody>(
    {} as CreateSessionBody
  );

  const subTotal = Number(
    availableProducts?.reduce((total, product) => total + product.market_item.price, 0).toFixed(2)
  );
  const discountValue: number =
    coupon && coupon.discount > subTotal ? subTotal || 0 : coupon?.discount ?? 0;
  const totalOrder = Number((subTotal - discountValue).toFixed(2));

  const onCreateOrder = useCallback(
    async (body: CreateSessionBody) => {
      try {
        const { order_id, client_secret } = await checkoutServices.createSession(body);
        if (order_id) setCheckoutToken(client_secret);

        setChecking(false);
      } catch (error) {
        dispatch(RemoveCouponRedux());
        router.replace(urlPage.cart);
      }
    },
    [dispatch, router]
  );

  const onCheckCart = useCallback(async () => {
    if (!availableProducts || isArrayEmpty(availableProducts)) router.replace('/cart');
    else {
      const bodyOrder: CreateSessionBody = {
        customer_email: props.auth?.user?.email ?? '',
        coupon_id: coupon?.id ?? '',
        use_credit: false,
        paygate: 'stripe',
        total_order: totalOrder,
        discount_coupon: discountValue,
        items: availableProducts.map((product) => ({ market_item: { id: product.id } })),
      };

      setBodyCreateOrder(bodyOrder);

      if (totalOrder <= 0) setChecking(false);
      else if (totalOrder - (coupon?.discount || 0) > 500000) {
        message.error(langLabel.cart_maximum_pay.replace('{{price}}', '500,000'));
        router.replace(urlPage.cart);
      } else onCreateOrder(bodyOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const orderPending = localStorage.getItem('order_pending');
    if (orderPending) {
      notification['info']({
        message: 'Order is being processed',
        description:
          'Your order is being processed. We will notify you by email, please check your email.',
        placement: 'top',
        duration: 8,
      });
      localStorage.removeItem('order_pending');
      router.replace('/');
    } else onCheckCart();
  }, [onCheckCart, router]);

  if (checking)
    return (
      <Spin
        className='d-flex align-items-center justify-content-center'
        style={{ height: '100vh', width: '100vw' }}
      />
    );

  const title = `Checkout | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Elements
        stripe={stripePromise}
        options={{
          locale: getPaypalLocale(langCode),
          clientSecret: checkoutToken,
          appearance: { theme: 'stripe', variables: { colorPrimary: '#369ca5' } },
        }}>
        <CheckoutPage
          auth={props.auth ?? undefined}
          bodyCreateOrder={bodyCreateOrder}
          subToTal={subTotal}
          discountValue={discountValue}
        />
      </Elements>
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const language = await DetectLanguage(content);
    return { props: { language } };
  },
  { userAllow: [UserType.CUSTOMER, UserType.SELLER], redirectUrl: '/cart' }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);

const getPaypalLocale = (langCode: string) => {
  switch (langCode) {
    case 'vn':
      return 'vi';
    case 'kr':
      return 'ko';
    case 'jp':
      return 'ja';
    default:
      return 'en';
  }
};
