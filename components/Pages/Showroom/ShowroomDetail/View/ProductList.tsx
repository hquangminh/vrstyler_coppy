import styled from 'styled-components';
import { Button, ConfigProvider } from 'antd';

import Icon from 'components/Fragments/Icons';
import MyCarousel from 'components/Fragments/MyCarousel';
import ProductCard from 'components/Fragments/ProductCard';

import { ShowroomDecorationModel } from 'models/showroom.models';

type Props = {
  product: ShowroomDecorationModel | null;
};

const SampleArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#f0f0f0' } }}>
      <Button
        style={style}
        shape='circle'
        className={className}
        icon={<Icon iconName={className.includes('prev') ? 'prev-button' : 'next-button'} />}
        onClick={onClick}
      />
    </ConfigProvider>
  );
};

export const ProductListComponent = (props: Props) => {
  const carouselProps = {
    nextArrow: <SampleArrow />,
    prevArrow: <SampleArrow />,
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 991, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <ProductListComponent_wrapper>
      <h3 className='title'>{props.product?.name || ''}</h3>

      <div className='carousel__wrapper position-relative'>
        <MyCarousel carouselProps={carouselProps}>
          {props.product?.market_showroom_section_products?.map((item: any) => (
            <ProductCard data={item.market_item} key={item.market_item.id} />
          ))}
        </MyCarousel>
      </div>
    </ProductListComponent_wrapper>
  );
};

const ProductListComponent_wrapper = styled.div`
  .carousel__wrapper {
    z-index: 1;
  }

  .ant-carousel {
    position: initial;
    overflow: hidden;
  }

  .slick-slider {
    position: initial;
  }

  .slick-slide > div {
    margin: 0 12px;
  }

  .slick-list {
    margin: 0 -12px;
  }

  .ant-carousel .slick-arrow {
    height: 32px;
    background-color: var(--color-gray-4);
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
    z-index: 1;
    &.slick-prev {
      inset-inline-start: 0;
      transform: translateX(-50%);
    }
    &.slick-next {
      inset-inline-end: 0;
      transform: translateX(50%);
    }
  }
  .slick-arrow.slick-disabled {
    opacity: 0;
    visibility: hidden;
  }

  .title {
    margin-bottom: 4px;
    font-size: 24px;
    color: var(--color-gray-13);
  }
`;

export default ProductListComponent;
