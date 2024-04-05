import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const ProductDetail_wrapper = styled.main`
  padding-bottom: 50px;
  background-color: #fff;
  border-radius: 10px;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Grid_wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 340px;
  grid-template-rows: repeat(3, auto);
  grid-column-gap: 30px;
  padding-bottom: 0;

  ${maxMedia.medium} {
    display: block;
  }
`;
