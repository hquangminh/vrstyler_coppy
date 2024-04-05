import { useCallback, useEffect, useState } from 'react';

import { Button, Flex, Progress } from 'antd';

import { decimalPrecision } from 'common/functions';
import useLanguage from 'hooks/useLanguage';

import reviewServices from 'services/review-services';

import CalculateReviews from 'components/Fragments/CalculateReviews';
import ReviewItem from './ReviewItem';

import { ReviewModel } from 'models/review.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const pageSize = 10;

type Props = {
  productId: string;
  averageReview?: number;
  isScroll: boolean;
  onScroll: () => void;
};

type PointCount = { [key: string]: number };

const ProductReview = (props: Props) => {
  const { langLabel } = useLanguage();

  const [pointCount, setPointCount] = useState<PointCount>();
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (reviews.length <= pageSize && props.isScroll) props.onScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length, props.isScroll]);

  const fetchReviews = useCallback(
    async (isFirst?: boolean) => {
      try {
        setIsLoading(true);
        if (isFirst) setReviews([]);
        const { error, data, ..._pointCount } = await reviewServices.getReviews(
          props.productId,
          pageSize,
          isFirst ? 0 : reviews.length
        );
        if (data) setReviews(reviews.concat(data));
        setPointCount(_pointCount);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.productId]
  );

  useEffect(() => {
    fetchReviews(true);
  }, [fetchReviews]);

  return (
    <Wrapper>
      <ReviewAverage>
        <ReviewPoint>
          <p>
            {Number.isInteger(props.averageReview)
              ? props.averageReview?.toFixed(1)
              : props.averageReview}
          </p>
          <CalculateReviews value={props.averageReview ?? 0} />
        </ReviewPoint>

        <ReviewCount>
          {pointCount &&
            Object.entries(pointCount).map(([key, point], index) => {
              const percent = (point / (pointCount?.total || 0)) * 100;
              if (key !== 'total')
                return (
                  <li key={key}>
                    <span>
                      {index} star{index > 1 ? 's' : ''}
                    </span>
                    <Progress
                      percent={percent}
                      size='small'
                      strokeColor='var(--color-primary-700)'
                      showInfo={false}
                    />
                    <span>{decimalPrecision(percent, 2)}%</span>
                  </li>
                );
              return null;
            })}
        </ReviewCount>
      </ReviewAverage>

      <ReviewList>
        {reviews?.map((review) => {
          return (
            <ReviewItem key={review.id} data={review}>
              {review.market_reviews && review.market_reviews.length > 0 && (
                <ReviewItem data={review.market_reviews[0]} />
              )}
            </ReviewItem>
          );
        })}
      </ReviewList>

      {reviews && pointCount && reviews.length < pointCount.total && (
        <Flex justify='center' style={{ marginTop: 10 }}>
          <Button type='primary' loading={isLoading} onClick={() => fetchReviews()}>
            {langLabel.btn_see_more || 'See more'}
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};

export default ProductReview;

const Wrapper = styled.div`
  .ant-rate .ant-rate-star > div:hover {
    transform: none;
  }
  .ant-rate-disabled.ant-rate .ant-rate-star > div:hover {
    transform: scale(1);
  }
  .ant-rate-star > div {
    transform: scale(1);
  }
`;
const ReviewAverage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 20px;

  ${maxMedia.small} {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const ReviewPoint = styled.div`
  text-align: center;

  & > p {
    font-size: 32px;
    font-weight: 600;
    color: var(--text-caption);
  }
`;
const ReviewCount = styled.ul`
  width: 100%;
  max-width: 450px;

  ${maxMedia.small} {
    margin-top: 20px;
  }

  li {
    display: grid;
    grid-template-columns: max-content auto max-content;
    gap: 8px;

    & > span {
      width: 44px;
      font-size: 14px;
      color: var(--text-caption);
      &:last-child {
        width: 34px;
      }
    }

    .ant-progress {
      margin: 0;
    }
  }
`;
const ReviewList = styled.div`
  margin-top: 20px;
`;
