import { useState } from 'react';
import { useRouter } from 'next/router';

import { AxiosError } from 'axios';
import { App, Button } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import userServices from 'services/user-services';

import { Container } from 'styles/__styles';
import * as SC from './style';

const NotVerify = ({ onSuccess }: { onSuccess: () => void }) => {
  const router = useRouter();
  const i18n = useLanguage();
  const { message: messageApp } = App.useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handelSendMailVerify = async () => {
    try {
      setIsLoading(true);
      await userServices.sendMailVerify();
      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.error_code === 'USER_IS_VERIFIED') {
        message.destroy();
        messageApp.success(i18n.t('USER_IS_VERIFIED'));
        router.replace('/');
      }
      setIsLoading(false);
    }
  };
  const { langLabel } = useLanguage();

  return (
    <SC.VerifyAccount__Wrapper>
      <Container className='VerifyAccount__Content'>
        <h1 className='VerifyAccount__Title --error'>
          {langLabel.verify_account_unverified_title}
        </h1>
        <p className='VerifyAccount__Caption'>{langLabel.verify_account_unverified_caption}</p>
        <Button
          className='VerifyAccount__BtnVerify'
          type='primary'
          shape='round'
          loading={isLoading}
          onClick={handelSendMailVerify}>
          {langLabel.btn_verify}
        </Button>
      </Container>
    </SC.VerifyAccount__Wrapper>
  );
};

export default NotVerify;
