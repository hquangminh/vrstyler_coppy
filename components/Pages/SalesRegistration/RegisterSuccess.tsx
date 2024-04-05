import { useRouter } from 'next/router';

import { Button } from 'antd';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';

const SalesRegistrationSuccess = () => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <Icon iconName='checkout-success' />
      <h2>{langLabel.register_sale_success_title}</h2>
      <p>{langLabel.register_sale_success_subTitle}</p>
      <Button type='primary' onClick={() => router.push('/upload-model/new')}>
        {langLabel.btn_upload_model}
      </Button>
    </Wrapper>
  );
};
export default SalesRegistrationSuccess;

const Wrapper = styled.div`
  padding: 80px 0;
  text-align: center;

  .my-icon {
    font-size: 120px;
  }
  h2 {
    margin-top: 30px;
    font-size: 24px;
    font-weight: 500;
    color: var(--text-title);
  }
  p {
    margin: 11px auto 0;
    max-width: 500px;
    font-size: 14px;
    color: var(--text-caption);
  }
  .ant-btn {
    margin-top: 30px;
    padding: 10px 48px;
    height: auto;
  }
`;
