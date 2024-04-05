import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { message } from 'antd';

import likeServices from 'services/like-services';

import { AppState } from 'store/type';
import { ProductModel } from 'models/product.model';
import { maxMedia } from 'styles/__media';
import Icon from 'components/Fragments/Icons';
import useLanguage from 'hooks/useLanguage';

type Props = {
  data: ProductModel;
  isPreview?: boolean;
};

const ProductDetailTitle = (props: Props) => {
  const { data, isPreview } = props;

  const i18n = useLanguage();
  const auth = useSelector((state: AppState) => state.auth);
  const [like, setLike] = useState<{ isLiked: boolean; total: number; clicking: boolean }>({
    isLiked: data.market_likes ? data.market_likes?.length > 0 : false,
    total: data.like_count,
    clicking: false,
  });

  useEffect(() => {
    setLike({
      isLiked: data.market_likes ? data.market_likes?.length > 0 : false,
      total: data.like_count,
      clicking: false,
    });
  }, [data.like_count, data.market_likes]);

  const handelLike = async () => {
    if (!auth?.token) {
      message.error(i18n.t('product_login_for_like'));
      return;
    }

    try {
      setLike((l) => ({ ...l, clicking: true }));
      if (like.isLiked) {
        const { error, total } = await likeServices.unLike(data.id);
        if (!error) setLike((l) => ({ ...l, isLiked: false, total: total, clicking: false }));
      } else {
        const { error, total } = await likeServices.like(data.id);
        if (!error) setLike((l) => ({ ...l, isLiked: true, total: total, clicking: false }));
      }
    } catch (error: any) {
      setLike((l) => ({ ...l, clicking: false }));
    }
  };

  return (
    <Title__Wrapper>
      <h1>{data.title}</h1>

      {!isPreview && (
        <ul className='product__like-comment-view--count'>
          <li
            className={`like ${like.isLiked ? 'active' : ''}`}
            onClick={() => !like.clicking && handelLike()}>
            <Icon iconName='product-like' />
            <span>{like.total}</span>
          </li>
          {/* <li>
            <CommentOutlined />
            <span>28</span>
          </li> */}
          {/* <div className='item'>
            <EyeOutlined />
            <span className='text'>264</span>
          </div> */}
        </ul>
      )}
    </Title__Wrapper>
  );
};

export default ProductDetailTitle;

const Title__Wrapper = styled.div`
  grid-area: 3 / 1 / 4 / 2;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-top: 30px;

  ${maxMedia.medium} {
    margin-top: 40px;
    padding-top: 40px;
    border-top: var(--border-1px);
  }

  h1 {
    font-size: 24px;
    font-weight: 500;
    color: var(--text-title);
    word-break: break-word;
    margin-right: 20px;
    line-height: 1.2;
  }

  .product__like-comment-view--count {
    display: flex;
    align-items: center;
    gap: 32px;

    li {
      display: inline-flex;
      align-items: center;
      gap: 8.8px;
      font-size: 16px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.45);

      & + li {
        position: relative;

        &:before {
          position: absolute;
          content: '';
          top: 50%;
          left: -15.5px;
          transform: translateY(-50%);
          width: 1px;
          height: 16px;
          background-color: rgba(0, 0, 0, 0.06);
        }
      }

      .my-icon {
        font-size: 24px;
      }
    }
  }

  .like {
    cursor: pointer;
    color: #0a0a0a;

    &.active {
      color: var(--color-main-6);

      .my-icon svg path {
        fill: var(--color-primary-700);
      }
    }

    span:nth-child(2) {
      line-height: 1;
    }
  }
`;
