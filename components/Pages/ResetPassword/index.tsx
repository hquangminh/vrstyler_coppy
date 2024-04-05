import { useState } from 'react';
import Link from 'next/link';

import { Button, Form, Input } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { messageError } from 'common/constant';
import showNotification from 'common/functions/showNotification';
import formConstant from 'constants/form.constant';
import { RegexPassWord } from 'lib/helpers/validatorForm';
import userServices from 'services/user-services';

import Icon from 'components/Fragments/Icons';

import * as LoginStyle from 'components/Pages/Login/style';
import * as SC from './style';
import { Container } from 'styles/__styles';

const md5 = require('md5');

const ResetPwPage = (props: { email: string; token: string }) => {
  const i18n = useLanguage();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSucceeded, setSuccess] = useState<boolean>(false);

  const onResetPassword = async (values: { password: string }) => {
    try {
      setLoading(true);
      const { error } = await userServices.resetPassword({
        email: props.email,
        password: md5(values.password),
        token: props.token,
      });
      if (!error) setSuccess(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showNotification('error', {
        message: error?.status || 'Error',
        description:
          (error?.status ? error?.status + ' - ' : '') +
          (error?.data?.message || messageError.an_unknown_error),
      });
    }
  };
  const { langLabel } = useLanguage();

  return (
    <Container>
      {!isSucceeded ? (
        <LoginStyle.Login_Wrapper>
          <LoginStyle.Login_Form>
            <SC.ResetPass_wrapper>
              <div className='title__wrapper'>
                <h1>{langLabel.btn_reset_password}</h1>
              </div>

              <Form form={form} layout='vertical' onFinish={onResetPassword}>
                <div onClick={(e) => e.preventDefault()}>
                  <Form.Item
                    label={i18n.t('password', 'Password')}
                    name='password'
                    tooltip={{
                      title: (
                        <ul
                          style={{ paddingLeft: 18, listStyle: 'initial' }}
                          dangerouslySetInnerHTML={{
                            __html: formConstant(langLabel).password?.tooltip ?? '',
                          }}
                        />
                      ),
                      overlayStyle: { maxWidth: 280 },
                      arrow: { pointAtCenter: true },
                    }}
                    rules={[
                      { required: true, message: langLabel.form_validate_password_required },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const confirmPassword = getFieldValue('confirm_password');
                          if (confirmPassword && confirmPassword !== value) {
                            form.validateFields(['confirm_password']);
                          } else form.setFields([{ name: 'confirm_password', errors: [] }]);

                          if (!value || RegexPassWord(value)) return Promise.resolve();
                          return Promise.reject(
                            new Error(formConstant(langLabel).password?.format)
                          );
                        },
                      }),
                    ]}>
                    <Input.Password disabled={isLoading} />
                  </Form.Item>
                </div>

                <Form.Item
                  name='confirm_password'
                  label={i18n.t('register_confirm_password')}
                  rules={[
                    { required: true, message: langLabel.form_validate_confirm_password },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(
                          new Error(langLabel.register_form_password_not_match)
                        );
                      },
                    }),
                  ]}>
                  <Input.Password disabled={isLoading} />
                </Form.Item>

                <Button
                  className='w-100 btn_login'
                  type='primary'
                  htmlType='submit'
                  disabled={isLoading}
                  loading={isLoading}>
                  {langLabel.btn_change_password}
                </Button>
              </Form>
            </SC.ResetPass_wrapper>
          </LoginStyle.Login_Form>
        </LoginStyle.Login_Wrapper>
      ) : (
        <LoginStyle.Login_Wrapper>
          <SC.ResetPasswordResult__Wrapper>
            <h3 className='checkoutResult_title'>{langLabel.reset_password_success_title}</h3>

            <Icon iconName='checkout-success' />

            <div className='wrapper'>
              <p className='checkoutResult_subTitle'>{langLabel.reset_password_success_subtitle}</p>
              <div className='checkoutResult_caption'>
                {langLabel.reset_password_success_caption}
              </div>
              <div className='checkoutResult_btnGroup'>
                <Button type='primary' className='w-100'>
                  <Link href='/login'>{langLabel.btn_back_to_login}</Link>
                </Button>
              </div>
            </div>
          </SC.ResetPasswordResult__Wrapper>
        </LoginStyle.Login_Wrapper>
      )}
    </Container>
  );
};

export default ResetPwPage;
