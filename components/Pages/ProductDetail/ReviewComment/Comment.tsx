import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, Spin } from 'antd';
import { Comment } from '@ant-design/compatible';

import isArrayEmpty from 'common/functions/isArrayEmpty';
import useLanguage from 'hooks/useLanguage';
import commentServices from 'services/comment-services';

import MyImage from 'components/Fragments/Image';
import CommentItem from './CommentItem';
import CommentWrite from './CommentWrite';

import { CommentModel } from 'models/comment.model';
import { AuthModel } from 'models/page.models';

import styled from 'styled-components';

type Props = {
  auth?: AuthModel;
  productId: string;
  onChangeTotalComment: Dispatch<SetStateAction<number>>;
  isScroll: boolean;
  onScroll: () => void;
};

const pageSize = 10;

const ProductComment = (props: Props) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [totalComment, setTotalComment] = useState<number>(0);
  const [commentContent, setCommentContent] = useState<string>('');
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);

  useEffect(() => {
    if (comments.length <= pageSize && props.isScroll) props.onScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments.length, props.isScroll]);

  const fetchComment = useCallback(
    async (totalCurrent: number) => {
      try {
        setLoadingComment(true);
        if (totalCurrent === 0) {
          setTotalComment(0);
          setComments([]);
        }
        await commentServices
          .getComments(props.productId, pageSize, totalCurrent)
          .then(({ data, total }) => {
            if (data) setComments((comment) => (totalCurrent === 0 ? data : comment.concat(data)));
            if (total) {
              setTotalComment(total);
              props.onChangeTotalComment(total);
            }
          })
          .finally(() => setLoadingComment(false));
      } catch (error) {
        setLoadingComment(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.productId]
  );

  useEffect(() => {
    fetchComment(0);
  }, [fetchComment]);

  const onAddComment = async () => {
    try {
      setIsAddingComment(true);
      const { data, error } = await commentServices.addComments(
        props.productId,
        commentContent
          .trim()
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .replaceAll('\n', '<br/>')
          .replace(/\s+/g, '&nbsp;')
      );
      if (!error) {
        setComments(comments ? [data].concat(comments) : [data]);
        props.onChangeTotalComment((total) => total + 1);
      }
      setCommentContent('');
      setIsAddingComment(false);
    } catch (error: any) {
      setIsAddingComment(false);
    }
  };

  const handelReply = (nickname: string, userId: string, type: number) => {
    setCommentContent(
      (current) => current + (current ? ' ' : '') + `@[${nickname}](user:${userId}?type=${type}) `
    );
  };

  return (
    <Wrapper>
      {props.auth ? (
        <div id='ProductComment__Write' className='ProductComment__Write'>
          <Comment
            avatar={
              <MyImage
                width={32}
                height={32}
                src={props.auth.user.image}
                img_error={'/static/images/avatar-default.png'}
                alt=''
                style={{ objectFit: 'cover' }}
              />
            }
            content={
              <CommentWrite
                value={commentContent}
                submitting={isAddingComment}
                onChange={(value) => setCommentContent(value)}
                onSubmit={onAddComment}
              />
            }
          />
        </div>
      ) : (
        !loadingComment && (
          <div id='ProductComment__Login' className='ProductComment__Login'>
            <Button type='primary'>
              <Link
                href={{
                  pathname: '/login',
                  query: { redirect: router.asPath.toString() },
                  hash: !router.asPath.includes('#comment') ? '#comment' : '',
                }}>
                {langLabel.btn_login_to_comment || 'Login to comment'}
              </Link>
            </Button>
          </div>
        )
      )}

      <Spin spinning={isArrayEmpty(comments) && loadingComment}>
        <div className='ProductComment__List'>
          {comments?.map((comment) => {
            return <CommentItem key={comment.id} data={comment} handelReply={handelReply} />;
          })}
        </div>
      </Spin>

      {totalComment > (comments?.length || 0) && (
        <div className='ProductComment__LoadMore' onClick={() => fetchComment(comments.length)}>
          <Button type='primary' loading={loadingComment}>
            {langLabel.btn_see_more || 'See more'}
          </Button>
        </div>
      )}
    </Wrapper>
  );
};

export default ProductComment;

const Wrapper = styled.div`
  margin-top: 20px;

  .ant-comment-content-author {
    align-items: center;
  }

  .ProductComment__Login {
    padding: 30px 0;
    border-radius: 2px;
    border: solid 1px var(--color-gray-5);
    background-color: var(--color-gray-4);
    text-align: center;

    .ant-btn {
      padding: 10px 48px;
      height: 41px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .ProductComment__LoadMore {
    margin-top: 10px;
    text-align: center;

    .ant-btn {
      font-size: 12px;
      line-height: 1;
      text-transform: uppercase;
    }
  }

  .ant-comment-actions li + li {
    margin-left: 10px;
  }
  .ant-comment-avatar {
    object-fit: cover;
  }
`;
