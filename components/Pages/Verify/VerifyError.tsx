import { useRouter } from 'next/router';
import { Button } from 'antd';

import useLanguage from 'hooks/useLanguage';
import Icon from 'components/Fragments/Icons';

import { Container } from 'styles/__styles';
import * as SC from './style';

const VerifyError = ({ onReVerify }: { onReVerify: () => void }) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  return (
    <SC.VerifyAccount__Wrapper>
      <Container className='VerifyAccount__Content'>
        <h1 className='VerifyAccount__Title --error'>{langLabel.verify_account_fail_title}</h1>
        <Icon iconName='checkout-faild' className='VerifyAccount__IconFaild' />
        <p className='VerifyAccount__Caption'>{langLabel.verify_account_fail_description}</p>
        <div className='VerifyAccount__BtnGroup'>
          <Button
            shape='round'
            className='VerifyAccount__BtnClose'
            onClick={() => router.replace('/')}>
            {langLabel.modeling_order_btn_close}
          </Button>
          <Button
            className='VerifyAccount__BtnVerify'
            type='primary'
            shape='round'
            onClick={onReVerify}>
            {langLabel.btn_reverify}
          </Button>
        </div>
      </Container>
    </SC.VerifyAccount__Wrapper>
  );
};

export default VerifyError;
