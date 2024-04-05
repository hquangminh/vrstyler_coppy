import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import axios from 'axios';
import { Button, Form, Input, message } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { removeToken, setToken } from 'lib/utils/auth';
import regex from 'common/regex';
import authServices from 'services/auth-services';

import LoginWithSNS from 'components/Fragments/LoginWithSNS';

import { UserModel } from 'models/user.models';

import { Container } from 'styles/__styles';
import * as SC from './style';

const md5 = require('md5');

const LoginPage = () => {
  const router = useRouter();
  const i18n = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let query = { ...router.query };
    const errorCode = query.error_code?.toString();
    if (errorCode) {
      message.error({ key: errorCode, content: i18n.t(errorCode) });
      delete query.error_code;
      router.replace({ query }, undefined, { shallow: true });
    }
  }, [i18n, router]);

  const onLogin = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    await authServices
      .login({ ...values, password: md5(values.password) })
      .then(({ data }) => onSuccess(data))
      .catch(() => {
        setSubmitting(false);
        removeToken();
      });
  };

  const onSuccess = (data: { token: string; refresh_token: string; user: UserModel }) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

    setToken(data.token, data.refresh_token);

    const redirectState = router.query.state
      ?.toString()
      ?.split(',')
      ?.find((i) => i.startsWith('redirect='))
      ?.split('=')[1];
    const redirect = router.query.redirect?.toString() ?? redirectState;

    if (redirect) router.push(redirect.replaceAll('%2F', '/'));
    else if (!data.user.status) router.push(`/verify`);
    else router.push('/');
  };

  return (
    <SC.Login_Wrapper>
      <Container>
        <SC.Login_Form>
          <div className='title__wrapper'>
            <h1>{i18n.t('login', 'Login')}</h1>
          </div>

          <Form layout='vertical' onFinish={onLogin}>
            <Form.Item
              name='username'
              label={i18n.t('username', 'Username')}
              rules={[
                { required: true, message: i18n.t('register_form_username_required') },
                { whitespace: true, message: i18n.t('form_validate_empty') },
              ]}>
              <Input placeholder={i18n.t('username', 'Username')} disabled={submitting} />
            </Form.Item>

            <Form.Item
              label={i18n.t('password', 'Password')}
              name='password'
              rules={[
                { required: true, message: i18n.t('register_form_password_required') },
                () => ({
                  validator(_, value) {
                    if (regex.space.test(value)) {
                      return Promise.reject(
                        new Error(i18n.t('form_validate_cannot_contain_space'))
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}>
              <Input.Password placeholder={i18n.t('password', 'Password')} disabled={submitting} />
            </Form.Item>

            <div className='remember_forgotPW'>
              <Link className='forgotPW' href='/forgot-password'>
                {i18n.t('login_forgot_password')}
              </Link>
            </div>

            <Button
              loading={submitting}
              className='w-100 btn_login'
              type='primary'
              htmlType='submit'>
              {i18n.t('login', 'Login')}
            </Button>

            <p className='no-account'>
              {i18n.t('login_do_not_have_account')}
              <Link href='/register' legacyBehavior>
                <a>
                  <span> {i18n.t('create_account')}</span>
                </a>
              </Link>
            </p>

            <LoginWithSNS onSuccess={onSuccess} />
          </Form>
        </SC.Login_Form>
      </Container>
    </SC.Login_Wrapper>
  );
};

export default LoginPage;
