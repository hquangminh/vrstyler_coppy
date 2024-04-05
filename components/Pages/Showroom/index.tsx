import Link from 'next/link';

import { CarouselProps } from 'antd';

import useLanguage from 'hooks/useLanguage';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import urlPage from 'constants/url.constant';

import Icon from 'components/Fragments/Icons';
import MyCarousel from 'components/Fragments/MyCarousel';
import ResultEmpty from 'components/Fragments/ResultEmpty';
import ShowroomCard from './Fragments/ShowroomCard';

import { ListShowroom, ShowroomModel, ShowroomType } from 'models/showroom.models';

import styled from 'styled-components';
import { Container } from 'styles/__styles';

const Wrapper = styled.main`
  padding: 40px 0;
`;
const Header = styled.section`
  h1 {
    font-size: 32px;
    font-weight: normal;
    color: var(--color-gray-11);
  }
  div {
    margin-top: 8px;
    font-size: 14px;
    color: var(--color-gray-7);
  }
`;
const ShowroomSection = styled.section`
  margin-top: 42px;
  &:not(:nth-child(2)) {
    margin-top: 60px;
  }
  position: relative;

  h3 {
    font-size: 24px;
    font-weight: normal;
    color: var(--color-gray-11);
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;
const ShowroomCarouselWrapper = styled.div`
  position: relative;
  .ant-carousel {
    position: relative;
    .slick-slider {
      position: unset;
      overflow: hidden;
    }
    .slick-list {
      margin: 0 -16px;
      padding: 26px 0 14px;
    }
    .slick-track {
      display: flex !important;
    }
    .slick-slide {
      margin: 0 20px;
      height: inherit;
      & > div {
        height: 100%;
      }
    }
    .slick-disabled {
      opacity: 0.25;
      pointer-events: none;
    }
    .slick-arrow {
      top: 0;
      left: unset;
      right: 0;
      z-index: 1;

      display: flex !important;
      align-items: center;
      justify-content: center;

      height: 40px;
      width: 40px;
      border: 1px solid;
      border-radius: 50%;
      border-color: transparent;
      transition: all 200ms ease-in-out;
      cursor: pointer;
      &:hover {
        border-color: var(--color-gray-7);
      }
      &.slick-prev {
        transform: translate(calc(-100% - 8px), -60%);
      }
      &.slick-next {
        transform: translateY(-60%);
        .my-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
`;
const ShowMore = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #595959;
  border-radius: 8px;
  box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
  background-color: #fff;
  a {
    width: 100%;
    height: 100%;
    gap: 4px;
    color: inherit;
  }
  .my-icon {
    font-size: 20px;
  }
`;

const ShowroomTop = ({ showroom }: { showroom: ListShowroom }) => {
  const { langCode, langLabel, t } = useLanguage();

  return (
    <Wrapper>
      <Container size='large'>
        <Header>
          <h1>{langLabel.showroom_explore || 'Explore Showroom'}</h1>
          <div>{t('showroom_explore_description')}</div>
        </Header>

        <>
          <ShowroomSection>
            <h3>Top Review</h3>
            <ShowroomCarousel
              type='review'
              langCode={langCode}
              langLabel={langLabel}
              showrooms={showroom.topReview}
            />
          </ShowroomSection>

          <ShowroomSection>
            <h3>Top View</h3>
            <ShowroomCarousel
              type='view'
              langCode={langCode}
              langLabel={langLabel}
              showrooms={showroom.topView}
            />
          </ShowroomSection>

          <ShowroomSection>
            <h3>Top Sold</h3>
            <ShowroomCarousel
              type='sold'
              langCode={langCode}
              langLabel={langLabel}
              showrooms={showroom.topSold}
            />
          </ShowroomSection>
        </>
      </Container>
    </Wrapper>
  );
};

export default ShowroomTop;

type ShowroomCarouselProps = {
  type: ShowroomType;
  langCode: string;
  langLabel: Record<string, string>;
  showrooms: ShowroomModel[];
};
const ShowroomCarousel = (props: ShowroomCarouselProps) => {
  const { type, langCode, langLabel, showrooms } = props;

  if (isArrayEmpty(showrooms)) return <ResultEmpty description={langLabel.showroom_not_found} />;

  const getUrlShowMore = () => {
    if (type === 'review') return urlPage.showroom_top_review;
    else if (type === 'view') return urlPage.showroom_top_view;
    else if (type === 'sold') return urlPage.showroom_top_sold;
  };

  const carouselProps: CarouselProps = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 4,
    prevArrow: <CarouselArrow />,
    nextArrow: <CarouselArrow />,
    responsive: [
      { breakpoint: 1600, settings: { slidesToShow: 3 } },
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <ShowroomCarouselWrapper>
      <MyCarousel carouselProps={carouselProps}>
        {showrooms.map((item) => (
          <ShowroomCard key={item.market_user.id} type={type} showroom={item} />
        ))}
        <ShowMore>
          <Link href={'/' + langCode + getUrlShowMore()} legacyBehavior>
            <a className='d-flex align-items-center justify-content-center'>
              {langLabel.btn_show_more} <Icon iconName='link-dashboard-seller' />
            </a>
          </Link>
        </ShowMore>
      </MyCarousel>
    </ShowroomCarouselWrapper>
  );
};

const CarouselArrow = (props: any) => (
  <div {...props} onClick={props.onClick}>
    <Icon iconName='arrow-left-line' />
  </div>
);
