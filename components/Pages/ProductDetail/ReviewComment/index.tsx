import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import useLanguage from 'hooks/useLanguage';
import capitalizeFirstLetter from 'common/functions/capitalizeFirstLetter';

import ProductReview from './Review';
import ProductComment from './Comment';

import { AuthModel } from 'models/page.models';

type Props = {
  isReview?: boolean;
  averageReview?: number;
  totalReview?: number;
  totalComment?: number;
  productId: string;
  auth?: AuthModel;
};

const ReviewComment = (props: Props) => {
  const router = useRouter();
  const i18n = useLanguage();
  const { isReview = true, totalReview = 0 } = props;

  const wrapperRef = useRef<HTMLElement>(null);

  const [tab, setTab] = useState<'review' | 'comment'>();
  const [totalComments, setTotalComments] = useState<number>(0);
  const [scrollArea, setScrollArea] = useState<'review' | 'comment' | undefined>();

  useEffect(() => {
    setTotalComments(props.totalComment ?? 0);
  }, [props.productId, props.totalComment]);

  useEffect(() => {
    setTab(!isReview ? 'comment' : 'review');
  }, [isReview, props.productId]);

  useEffect(() => {
    const tabHref = router.query.scroll_area?.toString().split('_')[0];
    if ((tabHref === 'review' && isReview) || tabHref === 'comment') {
      setTab(tabHref);
      setScrollArea(tabHref);
    } else setTab(isReview ? 'review' : 'comment');
  }, [props.productId, router.query.scroll_area, router.query.notification_id, isReview]);

  const onScrollToArea = () => wrapperRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Wrapper ref={wrapperRef}>
      <div className='ReviewComment__Tab'>
        {isReview && (
          <TabItem $active={tab === 'review'} onClick={() => setTab('review')}>
            <span>{props.totalReview} </span>
            {totalReview > 1 || totalReview === 0
              ? capitalizeFirstLetter(i18n.t('reviews'))
              : capitalizeFirstLetter(i18n.t('review'))}
          </TabItem>
        )}

        <TabItem $active={tab === 'comment'} onClick={() => setTab('comment')}>
          <span>{totalComments} </span>
          {totalComments > 1 || totalComments === 0
            ? capitalizeFirstLetter(i18n.t('comments'))
            : capitalizeFirstLetter(i18n.t('comment'))}
        </TabItem>
      </div>

      {isReview && (
        <div style={tab === 'review' ? undefined : { display: 'none' }}>
          <ProductReview
            productId={props.productId}
            averageReview={props.averageReview}
            isScroll={scrollArea === 'review'}
            onScroll={onScrollToArea}
          />
        </div>
      )}

      <div style={tab === 'comment' ? undefined : { display: 'none' }}>
        <ProductComment
          auth={props.auth}
          productId={props.productId}
          onChangeTotalComment={setTotalComments}
          isScroll={scrollArea === 'comment'}
          onScroll={onScrollToArea}
        />
      </div>
    </Wrapper>
  );
};
export default ReviewComment;

const Wrapper = styled.section`
  margin-top: 50px;
  padding-top: 50px;
  border-top: var(--border-1px);

  .ReviewComment__Tab {
    display: flex;
    align-items: center;
    gap: 24px;
  }
`;
const TabItem = styled.div<{ $active: boolean }>`
  font-size: 18px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? 'var(--color-primary-700)' : 'var(--color-gray-6)')};
  cursor: pointer;
`;
