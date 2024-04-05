import { useState } from 'react';

import { AxiosError } from 'axios';
import { Button, ConfigProvider, Form, Input, message } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { RegexPassWord } from 'lib/helpers/validatorForm';
import formConstant from 'constants/form.constant';
import userServices from 'services/user-services';

import HtmlComponent from 'components/Fragments/HtmlComponent';
import HeaderPage from '../Fragments/HeaderPage';

const md5 = require('md5');

type Props = {
  type?: 'showroom';
};

const SettingPassword = (props: Props) => {
  const { langLabel, t } = useLanguage();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onchangePassword = async (values: { password: string; new_password: string }) => {
    try {
      setIsLoading(true);
      const { error } = await userServices.changePassword({
        password: md5(values.password),
        new_password: md5(values.new_password),
      });
      if (!error) {
        message.success(langLabel.my_profile_setting_change_password_success);
        form.resetFields();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        const errorMessage = langLabel[error.response?.data.error_code];
        form.setFields([{ name: 'password', errors: [errorMessage] }]);
      }
    }
  };

  return (
    <>
      {props.type !== 'showroom' && (
        <HeaderPage
          title={langLabel.my_profile_change_password_title}
          // subtitle='Password'
          // caption='Please enter your new password'
        />
      )}

      <div className='Setting__Content'>
        <ConfigProvider theme={{ token: { fontSizeLG: 14 } }}>
          <Form form={form} layout='vertical' onFinish={onchangePassword}>
            <Form.Item
              label={langLabel.my_profile_setting_form_old_password}
              name='password'
              rules={[{ required: true, message: t('form_validate_current_password_required') }]}>
              <Input.Password
                size='large'
                disabled={isLoading}
                placeholder={langLabel.my_profile_setting_form_old_password_placeholder}
              />
            </Form.Item>

            <div onClick={(e) => e.preventDefault()}>
              <Form.Item
                label={langLabel.my_profile_setting_form_new_password}
                name='new_password'
                tooltip={{
                  title: (
                    <ul style={{ paddingLeft: 18, listStyle: 'initial' }}>
                      <HtmlComponent html={formConstant(langLabel).password?.tooltip ?? ''} />
                    </ul>
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
                      return Promise.reject(new Error(formConstant(langLabel).password?.format));
                    },
                  }),
                ]}>
                <Input.Password
                  size='large'
                  disabled={isLoading}
                  placeholder={langLabel.my_profile_setting_form_new_password_placeholder}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={langLabel.my_profile_setting_form_confirm_password}
              name='confirm_password'
              rules={[
                { required: true, message: langLabel.form_validate_new_password_required },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && getFieldValue('new_password') !== value)
                      return Promise.reject(new Error(langLabel.form_validate_password_not_match));
                    return Promise.resolve();
                  },
                }),
              ]}>
              <Input.Password
                size='large'
                disabled={isLoading}
                placeholder={langLabel.my_profile_setting_form_confirm_password_placeholder}
              />
            </Form.Item>

            <div className='text-center'>
              <Button type='primary' htmlType='submit' className='Btn__Submit' loading={isLoading}>
                {langLabel.btn_save_password}
              </Button>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </>
  );
};

export default SettingPassword;
