import { useState } from 'react';
import Link from 'next/link';

import isEmail from 'validator/lib/isEmail';
import { Button, Form, Input } from 'antd';

import useLanguage from 'hooks/useLanguage';
import userServices from 'services/user-services';

import * as LoginStyle from 'components/Pages/Login/style';
import { Container } from 'styles/__styles';
import * as SC from './style';

const ForgotPwPage = () => {
  const { langLabel } = useLanguage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [succeeded, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const onSubmit = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      setEmail(values.email);
      await userServices.forgotPassword(values).then(() => setSuccess(true));
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <LoginStyle.Login_Wrapper>
      <Container>
        <LoginStyle.Login_Form>
          {!succeeded ? (
            <SC.Forgot_wrapper>
              <div className='title__wrapper'>
                <h1>{langLabel.forgot_password_title}</h1>
              </div>

              <Form layout='vertical' onFinish={onSubmit}>
                <Form.Item
                  name='email'
                  label='Email'
                  className='input__forgot'
                  rules={[
                    { required: true, message: langLabel.register_form_email_required },
                    ({}) => ({
                      validator(_, value) {
                        if (!value || isEmail(value)) return Promise.resolve();
                        return Promise.reject(new Error(langLabel.register_form_email_incorrect));
                      },
                    }),
                  ]}>
                  <Input placeholder='johndoe@gmail.com' disabled={isLoading} />
                </Form.Item>

                <Button
                  className='w-100 btn_login'
                  type='primary'
                  htmlType='submit'
                  loading={isLoading}>
                  {langLabel.btn_reset_password}
                </Button>

                <div className='group__btn'>
                  <Link href='/register'>{langLabel.create_account || 'Create an account'}</Link>

                  <Link href='/login'>{langLabel.btn_back_to_login || 'Back to Login'}</Link>
                </div>
              </Form>
            </SC.Forgot_wrapper>
          ) : (
            <SC.SendToMail_Wrapper>
              <div className='title__wrapper'>
                <h1>{langLabel.reset_password_title}</h1>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: langLabel.reset_password_instructions_reset_sent.replace(
                    '{{email}}',
                    `<span>${email}</span>`
                  ),
                }}
              />
              <Button className='w-100 btn_login' type='primary'>
                <Link href='/login'>{langLabel.btn_back_to_login}</Link>
              </Button>
            </SC.SendToMail_Wrapper>
          )}
        </LoginStyle.Login_Form>
      </Container>
    </LoginStyle.Login_Wrapper>
  );
};

export default ForgotPwPage;
