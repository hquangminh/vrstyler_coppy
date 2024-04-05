import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { AxiosError, AxiosResponse } from 'axios';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { App, Button, Checkbox, Col, Modal, Row, Spin } from 'antd';

import config from 'config';
import useLanguage from 'hooks/useLanguage';
import useWarningOnExit from 'hooks/useWarningOnExit';
import useWindowSize from 'hooks/useWindowSize';
import checkoutServices from 'services/checkout-services';
import { formatNumber } from 'common/functions';
import { RemoveCouponRedux } from 'store/reducer/cart';
import { AppState } from 'store/type';
import urlPage from 'constants/url.constant';
import showNotification from 'common/functions/showNotification';

import CheckoutHeader from './Fragments/Header';
import CheckoutMethod from './Fragments/Method';
import CheckoutProduct from './Fragments/Product';
import CheckoutSummary from './Fragments/Summary';
import PaypalButton from './Fragments/PaypalButton';
import CheckoutSuccess from './Fragments/Success';

import { CheckoutProps } from 'models/checkout.models';

import { Container } from 'styles/__styles';
import { CheckoutAction, CheckoutContent, CheckoutWrapper } from './style';

const CheckoutPage = (props: CheckoutProps) => {
  const [modal, modalContext] = Modal.useModal();
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { message } = App.useApp();

  const { width: screenW } = useWindowSize();
  const { langLabel, langCode, t } = useLanguage();

  const [method, setMethod] = useState<'stripe' | 'paypal'>();
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);
  const [creatingOrderFree, setCreatingOrderFree] = useState<boolean>(false);

  const dataCart = useSelector((state: AppState) => state.cart);
  const isFreeOrder: boolean = dataCart.coupon
    ? props.subToTal - dataCart.coupon.discount <= 0
    : false;

  const onRemoveCouponRedux = () => dispatch(RemoveCouponRedux());

  useWarningOnExit(isPaying, 'Are you sure you want to exit?');

  const onStripePay = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      setIsChecking(true);

      const resPaymentIntent = await stripe.confirmPayment({ elements, redirect: 'if_required' });
      const error = resPaymentIntent.error;
      const paymentIntent = resPaymentIntent.paymentIntent;

      if (error) {
        if (error.code === 'payment_intent_unexpected_state') {
          modal.error({
            title: langLabel.checkout_refuse_payment,
            content: langLabel.checkout_limit_payments,
            okText: langLabel.checkout_back_to_cart,
            onOk: () => router.replace(urlPage.cart),
          });
        } else if (error.type === 'api_connection_error') {
          message.error({ key: 'check_failed', content: t('DISCONNECT_INTERNET') });
        } else showNotification('error', { key: 'check_failed', message: error.message });
      } else {
        setIsPaying(true);
        localStorage.setItem('order_pending', paymentIntent?.id ?? '');
        await checkoutServices
          .confirmOrder({
            payment_intent: paymentIntent?.id ?? '',
            customer_email: props.auth?.user.email ?? '',
            coupon_id: dataCart.coupon?.id,
          })
          .then(() => {
            setIsSuccess(true);
            onRemoveCouponRedux();
            localStorage.removeItem('order_pending');
          });
      }
      setIsPaying(false);
      setIsChecking(false);
    } catch (error: any) {
      onConfirmFail(error);
    }
  };

  const onCreateOrderFree = async () => {
    try {
      setCreatingOrderFree(true);
      const { paygate, ...body } = props.bodyCreateOrder;
      await checkoutServices.createSession(body).then(() => {
        setIsSuccess(true);
        onRemoveCouponRedux();
        localStorage.removeItem('order_pending');
      });
    } catch (error) {
      localStorage.removeItem('order_pending');
      if (error instanceof AxiosError) onConfirmFail(error.response);
    }
  };

  const onConfirmFail = (error?: AxiosResponse) => {
    onRemoveCouponRedux();
    localStorage.removeItem('order_pending');
    if (error?.status !== 401) router.replace(urlPage.cart);
  };

  if (isSuccess)
    return (
      <CheckoutWrapper>
        <CheckoutHeader isBackCart={!isSuccess} />
        <CheckoutSuccess />
      </CheckoutWrapper>
    );

  return (
    <CheckoutWrapper>
      {modalContext}

      <Spin spinning={isPaying && method === 'stripe'} tip={langLabel.checkout_paying_remind}>
        <CheckoutHeader />

        <CheckoutContent>
          <Container>
            <form>
              <h1 className='checkout-title-page'>{langLabel.modeling_order_btn_checkout}</h1>
              <Row gutter={[100, 20]}>
                <Col span={24} lg={12}>
                  {!isFreeOrder && (
                    <CheckoutMethod
                      method={method}
                      onChangeMethod={setMethod}
                      onStripeLoaded={() => setStripeLoaded(true)}
                    />
                  )}

                  <CheckoutProduct
                    products={
                      dataCart.products?.filter(
                        (product) => product.market_item.is_available !== false
                      ) ?? []
                    }
                  />
                </Col>

                <Col span={24} lg={12}>
                  <CheckoutSummary
                    subTotal={props.subToTal}
                    discount={props.discountValue}
                    onAgree={setIsAgree}
                  />

                  <CheckoutAction>
                    {screenW < 992 && (
                      <>
                        <div className='checkout-action-total'>
                          <span> {langLabel.total}</span>
                          <span>
                            {formatNumber(props.subToTal - (dataCart.coupon?.discount ?? 0), '$')}
                          </span>
                        </div>
                        <Checkbox
                          className='checkbox-privacy-terms-policy'
                          onChange={(e) => setIsAgree(e.target.checked)}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: langLabel.please_check_privacy_policy_terms.replace(
                                '{{link}}',
                                'https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/privacy-policy--4bc287f7-3fea-4b20-ad96-d64ed3f32780'
                              ),
                            }}
                          />
                        </Checkbox>
                      </>
                    )}

                    {method !== 'paypal' && !isFreeOrder && (
                      <Button
                        className='btn-pay'
                        type='primary'
                        disabled={!method || !isAgree || !stripeLoaded}
                        loading={isPaying || isChecking}
                        onClick={onStripePay}>
                        {t('btn_complete_checkout')}
                      </Button>
                    )}

                    <PayPalScriptProvider
                      options={{
                        'client-id': config.paypalClientId,
                        'disable-funding': 'credit,card',
                        locale: getPaypalLocale(langCode),
                      }}>
                      {method === 'paypal' && (
                        <PaypalButton
                          disabled={!isAgree}
                          bodyCreateOrder={props.bodyCreateOrder}
                          customer_email={props.auth?.user?.email ?? ''}
                          couponId={dataCart.coupon?.id}
                          onSuccess={() => setIsSuccess(true)}
                          onRemoveCouponRedux={onRemoveCouponRedux}
                          onFail={onConfirmFail}
                        />
                      )}
                    </PayPalScriptProvider>

                    {isFreeOrder && (
                      <Button
                        className='btn-pay'
                        type='primary'
                        disabled={!isAgree}
                        loading={creatingOrderFree}
                        onClick={onCreateOrderFree}>
                        {t('btn_complete_checkout')}
                      </Button>
                    )}
                  </CheckoutAction>
                </Col>
              </Row>
            </form>
          </Container>
        </CheckoutContent>
      </Spin>
    </CheckoutWrapper>
  );
};

export default CheckoutPage;

const getPaypalLocale = (langCode: string) => {
  switch (langCode) {
    case 'vn':
      return 'en_VN';
    case 'kr':
      return 'ko_KR';
    case 'jp':
      return 'ja_JP';
    default:
      return 'en_US';
  }
};
