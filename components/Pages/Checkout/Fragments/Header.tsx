import Link from 'next/link';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Button } from 'antd';

import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import { ContainerLarge } from 'styles/__styles';

const CheckoutHeader = ({ isBackCart = true }: { isBackCart?: boolean }) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <ContainerLarge className='d-flex align-items-center justify-content-between'>
        <Icon iconName='logo-main' onClick={() => router.push('/')} />

        {isBackCart && (
          <Button type='text'>
            <Link href='/cart'>{langLabel.checkout_back_to_cart}</Link>
          </Button>
        )}
      </ContainerLarge>
    </Wrapper>
  );
};
export default CheckoutHeader;

const Wrapper = styled.header`
  padding: 11px 0;
  background-color: #fefefe;
  border-bottom: var(--border-1px);

  .my-icon.logo-main {
    cursor: pointer;
    svg {
      width: auto;
      height: 24px;
    }
  }

  .ant-btn {
    height: 37px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-gray-7);
  }
`;
