import { useEffect, useState } from 'react';

import { App, Button, ConfigProvider, Form, Input } from 'antd';
import isEmail from 'validator/lib/isEmail';

import useLanguage from 'hooks/useLanguage';
import userServices from 'services/user-services';

import HeaderPage from '../Fragments/HeaderPage';

import { RegisterType, UserModel } from 'models/user.models';

import styled from 'styled-components';

type Props = { user: UserModel };

const SettingEmail = (props: Props) => {
  const { t } = useLanguage();
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSucceeded, setIsSucceeded] = useState<boolean>(false);

  useEffect(() => {
    if (props.user) form.setFieldsValue({ email: props.user.email });
  }, [form, props.user]);

  const onGetOtp = async (values: Record<string, string>) => {
    try {
      setIsLoading(true);
      await userServices.getOTPChangeEmail(values.new_email).then(() => {
        onGetOtpSuccess();
        setIsOTP(true);
      });
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  const onChangeEmail = async (values: Record<string, string>) => {
    try {
      setIsLoading(true);

      const { email, new_email = email, otp } = values;

      if (props.user?.status) {
        const isFacebook = props.user.regtype === RegisterType.FACEBOOK && !props.user.email;
        await userServices.changeEmail({ new_email, otp, is_facebook: isFacebook });
      } else await userServices.changeEmailAccountNotVerify({ new_email: values.new_email });

      setIsSucceeded(true);
      onSuccess(values.new_email || values.email);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  const onGetOtpSuccess = () =>
    notification.success({
      message: t('my_profile_get_otp_success'),
      description: (
        <span
          dangerouslySetInnerHTML={{
            __html: t('my_profile_get_otp_success_description').replace(
              '{{email}}',
              `<strong style="font-style: italic;">${props.user?.email}</strong>`
            ),
          }}
        />
      ),
    });

  const onSuccess = (email: string) => {
    notification.success({
      message: t('my_profile_setting_change_email_success_title'),
      description: (
        <span
          dangerouslySetInnerHTML={{
            __html: t('my_profile_setting_change_email_success_description').replace(
              '{{email}}',
              `<strong style="font-style: italic;">${email}</strong>`
            ),
          }}
        />
      ),
    });
  };

  return (
    <>
      <HeaderPage
        title={t('my_profile_change_email_title')}
        // subtitle='Email'
        // caption='Please enter your new Email'
      />

      <Content className='Setting__Content'>
        <ConfigProvider theme={{ token: { controlHeight: 40 } }}>
          <Form
            layout='vertical'
            form={form}
            onFinish={isOTP || !props.user.status || !props.user.email ? onChangeEmail : onGetOtp}>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: !props.user?.email,
                  message: t('my_profile_setting_form_email_required'),
                },
                { type: 'email', message: t('my_profile_setting_form_email_not_valid') },
              ]}
              initialValue={props.user?.email}>
              <Input
                disabled={
                  (typeof props.user?.email === 'string' && props.user?.email.length > 0) ||
                  isSucceeded
                }
              />
            </Form.Item>

            {props.user?.email && props.user?.email.length > 0 && !isSucceeded && (
              <>
                <Form.Item
                  label={t('my_profile_setting_form_new_email')}
                  name='new_email'
                  rules={[
                    { required: true, message: t('my_profile_setting_form_new_email_required') },
                    () => ({
                      validator(_, value) {
                        if (!value || isEmail(value)) return Promise.resolve();
                        return Promise.reject(new Error(t('register_form_email_incorrect')));
                      },
                    }),
                  ]}>
                  <Input disabled={isOTP || isLoading} />
                </Form.Item>

                {isOTP && (
                  <Form.Item
                    label='OTP'
                    name='otp'
                    rules={[{ required: true, message: t('form_validate_otp_required') }]}>
                    <Input disabled={isLoading} />
                  </Form.Item>
                )}

                <div className='settingEmail__Btn'>
                  {!isOTP && props.user.status && (
                    <Button
                      htmlType='submit'
                      type='primary'
                      className='Btn__Submit'
                      loading={isLoading}>
                      {t('btn_get_otp')}
                    </Button>
                  )}

                  {(isOTP || !props.user.status) && (
                    <Button
                      htmlType='submit'
                      type='primary'
                      className='Btn__Submit'
                      loading={isLoading}>
                      {t('btn_change_email')}
                    </Button>
                  )}
                </div>
              </>
            )}

            {!props.user?.email && !isSucceeded && (
              <div className='settingEmail__Btn'>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='Btn__Submit'
                  loading={isLoading}>
                  {t('btn_update_email')}
                </Button>
              </div>
            )}
          </Form>
        </ConfigProvider>
      </Content>
    </>
  );
};

export default SettingEmail;

const Content = styled.div`
  .settingEmail__Btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
`;
