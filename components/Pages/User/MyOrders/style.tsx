import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const OrderTotal_wrapper = styled.div`
  padding: 20px 40px;

  ${maxMedia.medium} {
    padding: 26px 0;
    .Header__Page__Content {
      padding: 0 20px;
    }
  }
`;

export const OrderList = styled.div`
  margin-top: 20px;

  & > div + div {
    margin-top: 20px;
  }
`;

export const OrderItem__Wrapper = styled.div`
  border: 1px solid var(--color-gray-4);
  box-shadow: 0 3px 5px rgba(var(--color-gray-rgb-13), 3%);
`;
