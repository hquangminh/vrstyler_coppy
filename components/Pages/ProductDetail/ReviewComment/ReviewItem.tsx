import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

import { Tooltip, Typography } from 'antd';
import { Comment } from '@ant-design/compatible';
import { StarFilled } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import convertToHtml from 'common/functions/convertToHtml';
import { urlGoToProfile } from 'common/functions';
import { avtDefault } from 'common/constant';

import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';

import { ReviewModel } from 'models/review.models';

import styled from 'styled-components';

type Props = {
  data: ReviewModel;
  children?: ReactNode;
};

const ReviewItem = (props: Props) => {
  const router = useRouter();
  const { langCode, t } = useLanguage();

  const content = props.data.content?.replaceAll('\n', '<br/>');

  const url = urlGoToProfile(props.data.market_user?.type, props.data.market_user?.nickname || '');

  return (
    <ReviewItemWrapper>
      <Comment
        author={
          <ReviewAuth onClick={() => url && router.push(url)}>
            {props.data.market_user.name}
          </ReviewAuth>
        }
        avatar={
          <MyImage
            src={props.data.market_user.image}
            img_error={avtDefault}
            alt={props.data.market_user.name}
            width={32}
            height={32}
            style={{ objectFit: 'cover' }}
            onClick={() => url && router.push(url)}
          />
        }
        content={
          content ? (
            <ReviewContent dangerouslySetInnerHTML={{ __html: convertToHtml(content, langCode) }} />
          ) : (
            <Typography.Text type='secondary' italic>
              {t('no_content')}
            </Typography.Text>
          )
        }
        datetime={
          <div className='d-flex align-items-center' style={{ gap: 5 }}>
            <Tooltip title={<Moment date={props.data.createdAt} langCode={langCode} showTime />}>
              <ReviewDate>
                <Moment date={props.data.createdAt} langCode={langCode} fromNow />
              </ReviewDate>
            </Tooltip>

            {Boolean(props.data.rate) && (
              <ReviewPoints>
                <StarFilled />
                {props.data.rate}
              </ReviewPoints>
            )}
          </div>
        }>
        {props.children}
      </Comment>
    </ReviewItemWrapper>
  );
};

export default ReviewItem;

const ReviewItemWrapper = styled.div`
  .ant-comment-content-author {
    align-items: center;
  }
`;

const ReviewAuth = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-700) !important;
  cursor: pointer;
`;
const ReviewDate = styled.div`
  font-size: 12px;
  color: var(--color-gray-7);
`;
const ReviewPoints = styled.div`
  display: flex;
  align-items: center;

  font-size: 12px;
  line-height: 1;
  color: var(--text-caption);

  .anticon {
    margin-right: 2px;
    color: #ffc043;
  }
`;
const ReviewContent = styled.div``;
