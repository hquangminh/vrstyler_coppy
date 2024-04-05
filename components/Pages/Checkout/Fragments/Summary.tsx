import { Checkbox, Divider } from 'antd';

import { formatNumber } from 'common/functions';
import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  /* eslint-disable no-unused-vars */
  subTotal: number;
  discount: number;
  onAgree: (agree: boolean) => void;
};

const CheckoutSummary = (props: Props) => {
  const { width: screenW } = useWindowSize();
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <div className='checkout-section-header'>
        <h4>{langLabel.summary || 'Summary'}</h4>
      </div>
      <div className='checkout-summary-item'>
        <span>{langLabel.subtotal || 'Subtotal'}</span>
        <span>{formatNumber(props.subTotal, '$')}</span>
      </div>
      <div className='checkout-summary-item'>
        <span>{langLabel.discount || 'Discount'}</span>
        <span>-{formatNumber(props.discount, '$')}</span>
      </div>
      {screenW > 991 && (
        <>
          <Divider />
          <div className='checkout-summary-item checkout-summary-item-total'>
            <span>{langLabel.total || 'Total'}</span>
            <span>{formatNumber(props.subTotal - props.discount, '$')}</span>
          </div>
          <Checkbox
            className='checkbox-privacy-terms-policy'
            onChange={(e) => props.onAgree(e.target.checked)}>
            <span
              dangerouslySetInnerHTML={{
                __html: langLabel.please_check_privacy_policy_terms.replace(
                  '{{link}}',
                  'https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/privacy-policy--4bc287f7-3fea-4b20-ad96-d64ed3f32780'
                ),
              }}
            />
          </Checkbox>
        </>
      )}
    </Wrapper>
  );
};
export default CheckoutSummary;

const Wrapper = styled.div`
  margin-bottom: 20px;
  max-width: 420px;

  ${maxMedia.medium} {
    max-width: unset;
  }

  .checkout-section-header {
    margin-bottom: 20px;

    ${maxMedia.small} {
      margin-bottom: 14px;
    }
  }
  .checkout-summary-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 16px;
    color: var(--text-title);

    ${maxMedia.small} {
      padding: 8px 0;
      font-size: 14px;
    }
  }
  .checkout-summary-item-total {
    font-weight: 600;
    span:last-child {
      font-size: 19px;
      color: var(--color-red-6);
    }
  }
  .ant-divider {
    margin: 10px 0;
    border-color: var(--color-gray-6);
  }
`;
