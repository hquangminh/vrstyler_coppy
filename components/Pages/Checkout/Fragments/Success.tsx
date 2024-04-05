import { useDispatch } from 'react-redux';
import Link from 'next/link';

import { Button } from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { ResetCartRedux } from 'store/reducer/cart';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const { langLabel } = useLanguage();

  return (
    <CheckoutResult_Wrapper>
      <h3 className='checkoutResult_title'>{langLabel.checkout_success_title}</h3>

      <Icon iconName='checkout-success' />

      <p className='checkoutResult_subTitle'>{langLabel.checkout_success_sub_title}</p>

      <div
        className='checkoutResult_caption'
        dangerouslySetInnerHTML={{ __html: langLabel.checkout_success_caption }}
      />

      <div className='checkoutResult_btnGroup'>
        <Button
          className='checkoutResult_btnGroup_checkOrder'
          type='primary'
          onClick={() => dispatch(ResetCartRedux())}>
          <Link href='/user/my-orders'>{langLabel.checkout_btn_check_order}</Link>
        </Button>
        <Button
          className='checkoutResult_btnGroup_backHome'
          onClick={() => dispatch(ResetCartRedux())}>
          <Link href='/'>{langLabel.checkout_btn_back_shop}</Link>
        </Button>
      </div>
    </CheckoutResult_Wrapper>
  );
};

export default CheckoutSuccess;

const CheckoutResult_Wrapper = styled.div`
  flex: auto;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-title);

  & > .my-icon {
    font-size: 120px;
    margin: 3.7rem 0 3.1rem;
  }

  .checkoutResult {
    &_title {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 1.1px;
    }
    &_subTitle {
      font-size: 16px;
      font-weight: 600;
    }
    &_caption {
      margin-top: 1.5rem;

      font-size: 14px;

      ${maxMedia.small} {
        br {
          display: none;
        }
      }
    }
    &_btnGroup {
      display: flex;
      justify-content: center;
      gap: 1rem;

      margin-top: 3rem;

      .ant-btn {
        height: 42px;
        min-width: 160px;

        font-size: 14px;
        font-weight: 600;
        &.hover {
          color: #fff;
        }
      }

      &_backHome {
        color: var(--color-primary-700);
        border-color: var(--color-primary-700);
      }
    }
  }
  .checkoutResult_btnGroup {
    ${maxMedia.small} {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
`;
