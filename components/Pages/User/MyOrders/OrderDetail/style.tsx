import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const OrderDetail_wrapper = styled.div`
  padding: 30px 40px;

  ${maxMedia.medium} {
    padding: 20px;
  }
`;

export const OrderDetail_Content = styled.div`
  margin-top: 30px;
  border: var(--border-1px);

  ${maxMedia.medium} {
    margin: 30px -20px 0;
  }
`;
