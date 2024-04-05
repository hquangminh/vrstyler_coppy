import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const Slider_wrapper = styled.div`
  grid-area: 1 / 1 / 3 / 2;
  position: relative;

  .product__viewer__box {
    height: calc(100vh - 250px);

    ${maxMedia.medium} {
      height: 60vw;
    }
    ${maxMedia.small} {
      height: 110vw;
    }
  }

  .product__viewer__content {
    position: relative;
    height: 100%;
    border-radius: var(--border-radius-base);
    overflow: hidden;
  }

  .product__3dViewer,
  .gallery__carousel {
    border: var(--border-1px);
    border-radius: 10px;
  }
`;
