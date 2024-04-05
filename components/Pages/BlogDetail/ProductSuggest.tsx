import styled from 'styled-components';
import { Carousel } from 'antd';
import { CarouselProps } from 'antd/lib/carousel';

import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';
import ProductCard from 'components/Fragments/ProductCard';

import { BlogProductAttach } from 'models/blog.models';

import { maxMedia } from 'styles/__media';

const BlogDetailProductSuggest = ({ products }: { products: BlogProductAttach }) => {
  const { langLabel } = useLanguage();
  const { width: screenW } = useWindowSize();

  const ButtonArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <Icon iconName='arrow-left-line-2' />
      </div>
    );
  };

  const carouselProps: CarouselProps = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    swipeToSlide: true,
    prevArrow: <ButtonArrow />,
    nextArrow: <ButtonArrow />,
  };

  const ProductList = () => {
    return products.map((item) => {
      return (
        <ProductCard
          key={item.market_item.id}
          data={item.market_item}
          className='BlogDetail__ProductItem'
        />
      );
    });
  };

  if (!screenW) return null;

  return (
    <Wrapper>
      <h3>{langLabel.blog_suggest_model}</h3>

      <CarouselWrapper className='hide-scrollbar'>
        {screenW > 640 ? <Carousel {...carouselProps}>{ProductList()}</Carousel> : ProductList()}
      </CarouselWrapper>
    </Wrapper>
  );
};
export default BlogDetailProductSuggest;

const Wrapper = styled.section`
  h3 {
    margin-bottom: 40px;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1.1px;
    color: #0a0a0a;
    text-align: center;
  }

  ${maxMedia.small} {
    margin-top: 30px;

    h3 {
      margin-bottom: 20px;
      text-align: left;
    }
  }
`;
const CarouselWrapper = styled.div`
  .ant-carousel {
    position: relative;
    padding-bottom: 60px;
    .slick-slider {
      position: unset;
      overflow: hidden;
    }
    .slick-list {
      margin: 0 -10px;
    }
    .slick-slide {
      padding: 0 10px;
    }
    .slick-arrow {
      width: 40px;
      height: 40px;

      top: unset;
      bottom: 0;
      right: 0;
      transform: translateX(-100%);

      display: inline-flex;
      align-items: center;
      justify-content: center;

      border: 1px solid var(--color-primary-700);
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      cursor: pointer;

      &.slick-prev {
        left: unset;
        transform: translateX(calc(-100% - 15px));
      }
      &.slick-next {
        transform: rotate(180deg);
      }
      &.slick-disabled {
        filter: grayscale();
        opacity: 0.5;
        cursor: not-allowed;
      }
      &:not(.slick-disabled):hover {
        background-color: var(--color-primary-700);
        .my-icon {
          color: #fff;
        }
      }
      .my-icon {
        width: 18px;
        height: 16px;
        color: var(--color-primary-700);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }

  ${maxMedia.small} {
    display: -webkit-box;
    overflow: auto;
    margin: 0 -20px;
    padding: 0 20px;

    .BlogDetail__ProductItem {
      width: 295px;

      & + .BlogDetail__ProductItem {
        margin-left: 20px;
      }
    }
  }
`;
