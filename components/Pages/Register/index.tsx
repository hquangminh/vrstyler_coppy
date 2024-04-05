import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import { Button, Checkbox, Form, Input } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { setToken } from 'lib/utils/auth';
import { RegexPassWord } from 'lib/helpers/validatorForm';
import regex from 'common/regex';
import isOnlyEmoji from 'functions/isOnlyEmoji';
import formConstant from 'constants/form.constant';
import userServices from 'services/user-services';

import LoginWithSNS from 'components/Fragments/LoginWithSNS';

import { UserModel } from 'models/user.models';

import * as LoginStyle from 'components/Pages/Login/style';
import * as L from './style';
import { Container } from 'styles/__styles';

const md5 = require('md5');

const RegisterPage = () => {
  const router = useRouter();

  const { langLabel, t } = useLanguage();

  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);

  const [agree, setAgree] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handelRegister = async (values: any) => {
    try {
      setIsLoading(true);
      let param = { ...values };
      param.name = values.name.trim();
      param.password = md5(values.password);
      delete param['confirm_password'];

      const { error } = await userServices.register(param);
      if (!error) setIsSuccess(true);

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  const onSuccess = (data: { token: string; refresh_token: string; user: UserModel }) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

    setToken(data.token, data.refresh_token);
    router.push('/');
  };

  return (
    <Container>
      {!isSuccess && (
        <LoginStyle.Login_Wrapper>
          <LoginStyle.Login_Form ref={ref}>
            <div className='title__wrapper'>
              <h1>{t('register_title')}</h1>
            </div>

            <Form form={form} layout='vertical' onFinish={handelRegister}>
              <div className='position-relative'>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                    { required: true, message: t('register_form_email_required') },
                    ({}) => ({
                      validator(_, value) {
                        if (!value || isEmail(value)) return Promise.resolve();
                        return Promise.reject(new Error(t('register_form_email_incorrect')));
                      },
                    }),
                  ]}>
                  <Input
                    placeholder='johndoe@gmail.com'
                    disabled={isLoading}
                    autoComplete='new-email'
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t('register_fullName')}
                name='name'
                rules={[
                  { required: true, message: t('my_profile_setting_form_fullName_required') },
                  { whitespace: true, message: t('my_profile_setting_form_fullName_not_empty') },
                  () => ({
                    validator(_, value) {
                      if (value && isOnlyEmoji(value))
                        return Promise.reject(new Error(t('form_validate_not_only_emoji')));
                      return Promise.resolve();
                    },
                  }),
                ]}>
                <Input
                  disabled={isLoading}
                  placeholder='Harry Potter'
                  autoComplete='new-fullName'
                  maxLength={30}
                  showCount={{
                    formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                  }}
                />
              </Form.Item>

              <div onClick={(e) => e.preventDefault()}>
                <Form.Item
                  label={t('register_username')}
                  name='username'
                  tooltip={{
                    title: (
                      <ul
                        style={{ paddingLeft: 18, listStyle: 'initial' }}
                        dangerouslySetInnerHTML={{
                          __html: formConstant(langLabel).username?.tooltip ?? '',
                        }}
                      />
                    ),
                    arrow: { pointAtCenter: true },
                    getPopupContainer: (triggerNode) => ref.current || triggerNode,
                  }}
                  rules={[
                    { required: true, message: t('register_form_username_required') },
                    {
                      pattern: regex.usernameFormat,
                      message: formConstant(langLabel).username?.format,
                    },
                  ]}>
                  <Input autoComplete='new-username' placeholder='johndoe' disabled={isLoading} />
                </Form.Item>
              </div>

              <div onClick={(e) => e.preventDefault()}>
                <Form.Item
                  label={t('password', 'Password')}
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
                    arrow: { pointAtCenter: true },
                    getPopupContainer: (triggerNode) => ref.current || triggerNode,
                  }}
                  rules={[
                    { required: true, message: t('register_form_password_required') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const confirmPassword = getFieldValue('confirm_password');
                        if (confirmPassword && confirmPassword !== value) {
                          form.validateFields(['confirm_password']);
                        } else form.setFields([{ name: 'confirm_password', errors: [] }]);

                        if (!value || RegexPassWord(value)) return Promise.resolve();
                        return Promise.reject(new Error(formConstant(langLabel).password?.format));
                      },
                    }),
                  ]}>
                  <Input.Password
                    placeholder={t('password', 'Password')}
                    maxLength={16}
                    disabled={isLoading}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name='confirm_password'
                className='custom-form-item'
                label={t('register_confirm_password')}
                rules={[
                  { required: true, message: t('form_validate_confirm_password') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error(t('register_form_password_not_match')));
                    },
                  }),
                ]}>
                <Input.Password placeholder={t('register_confirm_password')} disabled={isLoading} />
              </Form.Item>

              <div className='remember_forgotPW accept__terms'>
                <Checkbox className='rememberAcount' onChange={(e) => setAgree(e.target.checked)}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('agree_privacy_policy_terms').replace(
                        '{{link}}',
                        'https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/privacy-policy--4bc287f7-3fea-4b20-ad96-d64ed3f32780'
                      ),
                    }}
                  />
                </Checkbox>
              </div>

              <Button
                className='w-100 btn_login'
                type='primary'
                htmlType='submit'
                disabled={!agree}
                loading={isLoading}>
                {t('btn_create_account')}
              </Button>

              <p className='have-account'>
                {t('register_already_have_an_account')}
                <Link href='/login' legacyBehavior>
                  <span>{t('login')}</span>
                </Link>
              </p>

              <LoginWithSNS onSuccess={onSuccess} />
            </Form>
          </LoginStyle.Login_Form>
        </LoginStyle.Login_Wrapper>
      )}

      {isSuccess && (
        <L.FormSuccess_wrapper>
          <div className='wrapper'>
            <h3>{t('register_success_title')}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t('register_success_caption').replace('{{email}}', '<span>Email</span>'),
              }}
            />

            <img className='img__banner' src='/static/images/register/banner.png' alt='' />

            <Button type='primary' className='w-100'>
              <Link href='/login'>{t('btn_back_to_login', 'Back to Login')}</Link>
            </Button>
          </div>
        </L.FormSuccess_wrapper>
      )}
    </Container>
  );
};

export default RegisterPage;
