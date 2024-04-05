import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { Button, Checkbox, Flex, Input, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';

import { minimumPayment } from 'common/constant';
import { decimalPrecision, formatNumber } from 'common/functions';

import { AppState } from 'store/type';
import { ApplyCouponRedux, RemoveCouponRedux } from 'store/reducer/cart';

import { message } from 'lib/utils/message';
import checkoutServices from 'services/checkout-services';
import LanguageSupport from 'i18n/LanguageSupport';

import { CouponModel } from 'models/checkout.models';

import * as SC from './style';

const CartTotal = ({ subTotal }: { subTotal: number }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { langLabel, langCode, t } = useLanguage();

  const couponApply = useSelector((state: AppState) => state.cart.coupon);

  const [isUseCoupon, setIsUseCoupon] = useState<boolean>(
    (couponApply?.code && couponApply?.code.length > 0) || false
  );
  const [couponCode, setCouponCode] = useState<string>(couponApply?.code ?? '');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [messageErrorCoupon, setMessageErrorCoupon] = useState<string>('');
  const [isFirstApplyCoupon, setIsFirstApplyCoupon] = useState<boolean>(true);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const lang = url.split('/')[1];
      const notResetCoupon =
        url === '/checkout' ||
        (LanguageSupport.some((i) => i === lang) && url.includes('/checkout'));

      if (notResetCoupon) return;
      else dispatch(RemoveCouponRedux());
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [dispatch, router.events]);

  const onCheckCoupon = async () => {
    try {
      setIsApplyingCoupon(true);
      const { error, data } = await checkoutServices.getCoupon(couponCode);
      if (!error) onApplyCoupon(data);
    } catch (error: any) {
      message.destroy();
      setIsApplyingCoupon(false);
      dispatch(RemoveCouponRedux());

      let messageError: string = '';
      const response: AxiosResponse<any, any> | undefined = error.response;

      if (response?.status === 409) messageError = langLabel.cart_coupon_out_of_move;
      else if (response?.status === 404) messageError = langLabel.cart_coupon_not_exist;
      else if (response?.status === 401) {
        return;
      } else messageError = langLabel.cart_coupon_error;
      setMessageErrorCoupon(messageError);
    }
  };

  const onApplyCoupon = (coupon: CouponModel) => {
    try {
      setIsApplyingCoupon(false);
      if (coupon.min_order && subTotal < coupon.min_order) {
        dispatch(RemoveCouponRedux());
        setMessageErrorCoupon(
          t('cart_coupon_only_order_from').replace('{{total}}', coupon.min_order.toString())
        );
        return;
      }

      let discount: number = 0;

      if (coupon.type === 'percent')
        discount = decimalPrecision((subTotal / 100) * coupon.value, 2);
      if (coupon.type === 'price') discount = decimalPrecision(coupon.value, 2);
      if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount;
      if (messageErrorCoupon) setMessageErrorCoupon('');

      dispatch(ApplyCouponRedux({ ...coupon, discount, code: couponCode }));
      if (!couponApply) message.success(langLabel.cart_coupon_apply_success);
    } catch (error) {
      setIsApplyingCoupon(false);
    }
  };

  const handelRemoveCoupon = () => {
    setCouponCode('');
    setMessageErrorCoupon('');
    dispatch(RemoveCouponRedux());
  };

  useEffect(() => {
    if (isFirstApplyCoupon) setIsFirstApplyCoupon(false);
    else if (subTotal === 0) handelRemoveCoupon();
    else if (couponApply) onApplyCoupon(couponApply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstApplyCoupon, subTotal]);

  const onCheckout = async () => {
    if (isUseCoupon && !couponApply) {
      setMessageErrorCoupon(langLabel.cart_coupon_not_apply);

      return;
    } else if (isCheckDisableCheckoutMinimum) {
      return;
    }

    if (subTotal - (couponApply?.discount || 0) > 500000) {
      message.error({
        key: 'maximum_payment',
        content: langLabel.cart_maximum_pay.replace('{{price}}', '500,000'),
      });
      return;
    }

    router.push(`/${langCode}/checkout`);
  };

  const total =
    subTotal > (couponApply?.discount || 0) ? subTotal - (couponApply?.discount ?? 0) : 0;

  const isCheckDisableCheckoutMinimum =
    (subTotal === 0 && total < minimumPayment && !couponApply) ||
    (couponApply && total < minimumPayment && total !== 0);

  return (
    <SC.CartTotal_Wrapper>
      <div className='cart_header'>{langLabel.total || 'Total'}</div>

      <SC.CartTotal_Content>
        <SC.CartTotal_PriceItem className='cartTotal_priceItem'>
          <p>{langLabel.subtotal || 'Subtotal'}</p>
          <p>{formatNumber(subTotal, '$')}</p>
        </SC.CartTotal_PriceItem>

        <SC.CartTotal_PriceItem className='cartTotal_priceItem'>
          <p>{langLabel.cart_promotion}</p>
          <p>
            -{' '}
            {couponApply?.type === 'price'
              ? couponApply.discount > subTotal
                ? formatNumber(subTotal || 0, '$')
                : formatNumber(couponApply?.discount ?? 0, '$')
              : formatNumber(couponApply?.discount ?? 0, '$')}
          </p>
        </SC.CartTotal_PriceItem>

        <SC.CartTotal_Coupon>
          <Checkbox
            checked={isUseCoupon}
            onChange={(e) => {
              if (!e.target.checked) {
                setCouponCode('');
                dispatch(RemoveCouponRedux());
              }
              setMessageErrorCoupon('');
              setIsUseCoupon(e.target.checked);
            }}>
            {langLabel.cart_have_coupon}
          </Checkbox>

          {isUseCoupon &&
            (couponApply?.code ? (
              <SC.CurrentCoupon>
                <Flex align='flex-start' gap={6}>
                  <CloseCircleOutlined onClick={handelRemoveCoupon} />
                  <Flex wrap='wrap' flex='auto' justify='space-between'>
                    <div className='coupon__title'>
                      {t('cart_coupon_label')}: {couponApply?.code}
                    </div>
                    <div className='coupon__discount'>
                      -
                      {couponApply?.type === 'percent'
                        ? `${couponApply.value}%` +
                          (couponApply.max_discount
                            ? ' (' +
                              t('cart_coupon_max_discount').replace(
                                '{{discount}}',
                                formatNumber(couponApply.max_discount, '$')
                              ) +
                              ')'
                            : '')
                        : formatNumber(couponApply.discount, '$')}
                    </div>
                  </Flex>
                </Flex>
              </SC.CurrentCoupon>
            ) : (
              <div className='cartTotal_coupon_content'>
                <div className='cartTotal_coupon_input'>
                  <Input
                    disabled={isApplyingCoupon}
                    value={couponCode}
                    onChange={(e) => {
                      couponApply?.discount && dispatch(RemoveCouponRedux());
                      setCouponCode(e.target.value.trim()?.toUpperCase());
                    }}
                    onPressEnter={onCheckCoupon}
                  />

                  <Button
                    type='primary'
                    disabled={!couponCode.trim() || !subTotal}
                    loading={isApplyingCoupon}
                    onClick={subTotal ? onCheckCoupon : undefined}>
                    {langLabel.btn_apply || 'Apply'}
                  </Button>
                </div>

                {messageErrorCoupon && (
                  <Typography.Text type='danger' className='err__code'>
                    {messageErrorCoupon}{' '}
                  </Typography.Text>
                )}
              </div>
            ))}
        </SC.CartTotal_Coupon>

        <SC.CartTotal_PriceItem className='cartTotal_priceItem --total'>
          <p>{langLabel.total || 'Total'}</p>
          <p>{formatNumber(total, '$')}</p>
        </SC.CartTotal_PriceItem>
        {isCheckDisableCheckoutMinimum && (
          <Typography.Text type='danger' className='err__code err__payment'>
            {(langLabel.cart_minimum_pay || 'Amount must be at least ${{price}}').replace(
              '{{price}}',
              minimumPayment.toString()
            )}
          </Typography.Text>
        )}

        <Button
          className='cartTotal_btnPay'
          type='primary'
          onClick={onCheckout}
          disabled={isCheckDisableCheckoutMinimum}>
          {langLabel.checkout_title || 'Checkout'}
        </Button>
      </SC.CartTotal_Content>

      <SC.Cart_Information>{langLabel.cart_checkout_explain}</SC.Cart_Information>
    </SC.CartTotal_Wrapper>
  );
};

export default CartTotal;
