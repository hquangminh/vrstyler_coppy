import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const Wrapper = styled.div`
  .cartSuggest_title {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1.1px;
    color: var(--text-title);
    text-align: center;
  }

  .cartSuggest_productList {
    margin-top: 4rem;
    @media screen and (min-width: 600px) and (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    ${maxMedia.small} {
      margin: 30px -20px 0;
      padding: 0 20px;
      display: flex;
      overflow-y: auto;

      & > div {
        min-width: 300px;
        aspect-ratio: 354 / 310;
      }
    }
  }
`;
export default Wrapper;
