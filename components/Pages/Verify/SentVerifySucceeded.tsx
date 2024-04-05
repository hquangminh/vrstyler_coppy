import { useRouter } from 'next/router';

import useLanguage from 'hooks/useLanguage';
import { Button } from 'antd';

import { Container } from 'styles/__styles';
import * as SC from './style';

type Props = {
  customerEmail: string;
};

const SentVerifySucceeded = (props: Props) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  return (
    <SC.VerifyAccount__Wrapper>
      <Container className='VerifyAccount__Content'>
        <h1 className='VerifyAccount__Title'>
          {langLabel.verify_account_send_email_success_title}
        </h1>
        <p
          className='VerifyAccount__Caption'
          dangerouslySetInnerHTML={{
            __html: langLabel.verify_account_send_email_success_description.replace(
              '{{email}}',
              `<span>${props.customerEmail}</span>`
            ),
          }}
        />
        <Button
          type='primary'
          shape='round'
          className='VerifyAccount__BtnClose'
          onClick={() => router.replace('/')}>
          {langLabel.modeling_order_btn_close}
        </Button>
      </Container>
    </SC.VerifyAccount__Wrapper>
  );
};

export default SentVerifySucceeded;
