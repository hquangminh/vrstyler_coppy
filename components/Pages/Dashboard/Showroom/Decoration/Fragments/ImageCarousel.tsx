import styled from 'styled-components';
import { Carousel } from 'antd';

import DecorationSectionAction from './SectionAction';

const Wrapper = styled.div<{ aspect?: number }>`
  position: relative;
  z-index: 1;
  cursor: pointer;
  &.active .decoration-image-default {
    border-color: var(--color-gray-6);
  }
  .ant-carousel {
    .slick-slide {
      aspect-ratio: ${({ aspect }) => aspect};
      div {
        height: 100%;
      }
      img {
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    .slick-dots {
      li {
        width: 10px;
        height: 10px;
        button {
          height: 100%;
          border-radius: 50%;
          background: var(--color-gray-6);
          opacity: 1;
        }
        &.slick-active button {
          background: var(--color-gray-4);
        }
      }
    }
  }
  .decoration-image-default {
    padding: 40px;
    border: 1px solid transparent;
    img {
      width: 100%;
      height: auto;
    }
  }
`;

interface Props {
  aspect?: number;
  images?: string[];
  focused?: boolean;
  onSelect?: () => void;
  onDelete: () => void;
}

export default function DecorationImageCarousel(props: Props) {
  const carouselProps = {
    dots: true,
    draggable: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
  };

  return (
    <Wrapper
      className={'decoration-section' + (props.focused ? ' active' : '')}
      aspect={props.aspect}>
      <div onClick={props.onSelect}>
        {props.images ? (
          <Carousel {...carouselProps}>
            {props.images.map((img, ind) => (
              <img key={ind} src={img} alt='' />
            ))}
          </Carousel>
        ) : (
          <div className='decoration-image-default'>
            <img
              src='/static/images/showroom/decoration/toolbar-category-image-carousel.jpg'
              alt=''
            />
          </div>
        )}
      </div>

      <DecorationSectionAction onDelete={props.onDelete} />
    </Wrapper>
  );
}
