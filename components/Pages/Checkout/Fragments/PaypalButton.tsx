import { useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Button, ConfigProvider } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';

import checkoutServices from 'services/checkout-services';

type Props = {
  disabled?: boolean;
  bodyCreateOrder: any;
  customer_email: string;
  couponId?: string;
  onSuccess: () => void;
  onRemoveCouponRedux: () => void;
  onFail: (error?: AxiosResponse) => void;
};

const PaypalButton = (props: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <ConfigProvider
      theme={{
        token: { controlHeight: 42 },
        components: { Button: { paddingBlock: 0, paddingInline: 0 } },
      }}>
      <Button type='text' block disabled={Boolean(props.disabled) || !loaded}>
        <PayPalButtons
          style={{ layout: 'vertical', height: 41, label: 'checkout' }}
          disabled={Boolean(props.disabled) || !loaded}
          createOrder={async () => {
            return checkoutServices
              .createSession({ ...props.bodyCreateOrder, paygate: 'paypal' })
              .then((order) => order.payment_intent)
              .catch((error: AxiosError) => Promise.reject(error.response));
          }}
          onInit={() => setLoaded(true)}
          onError={(err: any) => props.onFail(err)}
          onApprove={async function (data) {
            localStorage.setItem('order_pending', data.orderID);
            await checkoutServices
              .confirmOrder({
                customer_email: props.customer_email,
                payment_intent: data.orderID ?? '',
                coupon_id: props.couponId ?? '',
              })
              .then(function () {
                props.onSuccess();
                props.onRemoveCouponRedux();
                localStorage.removeItem('order_pending');
              })
              .catch((err: AxiosError) => setTimeout(() => props.onFail(err.response), 500));
          }}
        />
      </Button>
    </ConfigProvider>
  );
};

export default PaypalButton;
