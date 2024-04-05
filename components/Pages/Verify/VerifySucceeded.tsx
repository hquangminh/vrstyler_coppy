import Link from 'next/link';

import { Button } from 'antd';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import { Container } from 'styles/__styles';
import * as SC from './style';

const VerifySucceeded = () => {
  const { langLabel } = useLanguage();

  return (
    <SC.VerifyAccount__Wrapper>
      <Container className='VerifyAccount__Content'>
        <h1 className='VerifyAccount__Title'>{langLabel.verify_account_success_title}</h1>
        <Icon iconName='checkout-success' className='VerifyAccount__IconSucceeded' />
        <p className='VerifyAccount__Caption'>{langLabel.verify_account_success_caption}</p>
        <Button type='primary' shape='round' className='VerifyAccount__BtnVerify'>
          <Link href='/'>{langLabel.btn_continue || 'Continue'}</Link>
        </Button>
      </Container>
    </SC.VerifyAccount__Wrapper>
  );
};

export default VerifySucceeded;
