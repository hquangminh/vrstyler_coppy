import { ReactNode, useCallback, useEffect, useRef } from 'react';

import { Carousel } from 'antd';
import { CarouselProps, CarouselRef } from 'antd/es/carousel';

type Props = {
  children: ReactNode;
  carouselProps: CarouselProps;
};

const MyCarousel = ({ carouselProps, children }: Props) => {
  const carouselRef = useRef<CarouselRef>(null);
  const slidesToShow = carouselRef.current?.innerSlider.props.slidesToShow;

  const onChangeSlickGoTo = useCallback(() => {
    if (carouselRef.current) {
      const { currentSlide, slideCount } = carouselRef.current.innerSlider.state;
      if (currentSlide + slidesToShow > slideCount)
        carouselRef.current.goTo(slideCount - slidesToShow);
      else carouselRef.current.goTo(currentSlide);
    }
  }, [slidesToShow]);

  useEffect(() => {
    onChangeSlickGoTo();
  }, [onChangeSlickGoTo]);

  return (
    <Carousel ref={carouselRef} {...carouselProps}>
      {children}
    </Carousel>
  );
};

export default MyCarousel;
