import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { App, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { AppState } from 'store/type';
import { AddProductCartRedux, isExistInCart } from 'store/reducer/cart';

import { AddToCart } from 'lib/utils/checkout';

import { changeToSlug, decimalPrecision, formatNumber } from 'common/functions';
import capitalizeFirstLetter from 'common/functions/capitalizeFirstLetter';
import showNotification from 'common/functions/showNotification';
import percentDiscount from 'common/functions/percDiscount';
import useLanguage from 'hooks/useLanguage';

import urlPage from 'constants/url.constant';

import Icon from './Icons';
import Viewer360 from './View360';

import { ProductModel } from 'models/product.model';
import { ExploreType } from 'models/explore.model';

import styled from 'styled-components';
import { maxMedia, minMedia } from 'styles/__media';

type Props = {
  data: ProductModel;
  className?: string;
  link_product?: string;
  pageName?: string;
  exploreType?: ExploreType;
};

const ProductCard = (props: Props) => {
  const { data, link_product, className = '', pageName } = props;

  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  const { langLabel, t } = useLanguage();
  const { message } = App.useApp();

  const isFree = !data.price || data.price === 0;
  const isExistCart = useSelector((state: AppState) => isExistInCart(state, data.id));
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const router = useRouter();

  let pathToDetail = '';

  if (props.exploreType === 'showroom') {
    pathToDetail = `${urlPage.productDetail.replace(
      '{slug}',
      changeToSlug(data.title) + '--' + data.id
    )}?explore_type=showroom`;
  } else {
    pathToDetail = `${urlPage.productDetail.replace(
      '{slug}',
      changeToSlug(data.title) + '--' + data.id
    )}`;
  }

  const onAddToCart = async () => {
    if (!auth?.token)
      showNotification('warning', {
        key: 'cant-add-1',
        message: langLabel.product_can_not_add_to_cart,
        description: langLabel.product_login_for_add_to_cart,
      });
    else if (data.is_bought)
      message.error({
        key: `already-bought-${data.id}`,
        content: langLabel.product_already_bought,
      });
    else if (isExistCart) router.push(urlPage.cart);
    else {
      setAddingToCart(true);
      const { error, data: dataCart } = await AddToCart(data, langLabel);

      if (!error) dispatch(AddProductCartRedux(dataCart));

      setAddingToCart(false);
    }
  };

  const link = link_product ?? pathToDetail;

  return (
    <Wrapper
      className={`${className} custom__product--card`}
      $notHover={isFree || pageName === 'profile-seller' || auth?.user?.type === 3}>
      <Link href={link}>
        <div className='product_image' title={data?.title}>
          <Viewer360 id={data.id} imageDefault={data.image || ''} imageAlt={data?.title} />
        </div>
      </Link>

      <div className='product_content'>
        <div className='product_name' title={data?.title}>
          <Link href={link}>{data?.title}</Link>
        </div>
        {pageName === 'profile-seller' && (
          <div className='product_price_group'>
            {addingToCart ? (
              <LoadingOutlined className='product_btn-cart' />
            ) : (
              <Icon
                iconName={isExistCart ? 'cart-check' : 'cart-add'}
                className='product_btn-cart'
                onClick={!isExistCart ? onAddToCart : undefined}
              />
            )}
          </div>
        )}

        {pageName !== 'profile-seller' && (
          <div className='product_price_group'>
            {!isFree && data.old_price && (
              <p className='product_price-old'>{formatNumber(data.old_price, '$')}</p>
            )}
            <p className='product_price'>
              {!isFree && data?.old_price && (
                <span>-{decimalPrecision(percentDiscount(data.price, data.old_price), 2)}%</span>
              )}
              {isFree ? 'Free' : formatNumber(data.price || 0, '$')}
            </p>
            {addingToCart ? (
              <LoadingOutlined className='product_btn-cart' />
            ) : (
              <Icon
                iconName={isExistCart ? 'cart-check' : 'cart-add'}
                className='product_btn-cart'
                onClick={!isExistCart ? onAddToCart : undefined}
              />
            )}
          </div>
        )}

        {pageName === 'profile-seller' && (
          <div className='product_preview_group'>
            <Tooltip title={capitalizeFirstLetter(data.like_count > 1 ? t('likes') : t('like'))}>
              <div className='like_wrapper'>
                <Icon iconName='product-like' className='icon' />
                {data.like_count}
              </div>
            </Tooltip>

            <Tooltip title={capitalizeFirstLetter(data.viewed_count > 1 ? t('views') : t('view'))}>
              <div className='watch_wrapper'>
                <Icon iconName='seller-eye' className='icon' />
                {data.viewed_count}
              </div>
            </Tooltip>

            {!isFree && (
              <Tooltip
                title={capitalizeFirstLetter(
                  data.market_reviews_aggregate?.aggregate?.count > 1 ? t('reviews') : t('review')
                )}>
                <div className='star_wrapper'>
                  <Icon iconName='star-rounded' />
                  {data.market_reviews_aggregate?.aggregate?.count || 0}
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {pageName !== 'profile-seller' &&
        !dayjs(data.publish_date).isBefore(dayjs().subtract(3, 'day')) && (
          <div className='product_badge --new'>New</div>
        )}
    </Wrapper>
  );
};

export default ProductCard;

const Wrapper = styled.div<{ $notHover: boolean }>`
  position: relative;

  background-color: #edeef0;
  border-radius: 5px;

  overflow: hidden;

  cursor: pointer;

  ${(props) => {
    if (!props.$notHover)
      return `
        ${minMedia.medium} {
          &:hover {
            .product {
              &_price, &_price-old, &_preview_group {display: none;}
              &_btn-cart {display: inline-block;}
            }
          }
        }
    `;
  }}

  .product {
    &_image {
      width: 100%;
      aspect-ratio: 4 / 3;
    }

    &_content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: 4.8rem;
      padding: 1.5rem 0.6rem;

      font-size: 12px;
    }

    &_name {
      padding-right: 10px;
      font-size: inherit;
      font-weight: 600;
      line-height: 1.33;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      a {
        color: var(--text-title);
      }
    }

    &_price_group {
      display: inline-flex;
      align-items: center;
      gap: 2rem;
    }

    &_price-old {
      line-height: 1.33;
      color: var(--color-gray-6);
      text-decoration: line-through;
    }

    &_price {
      font-weight: 600;
      line-height: 1.33;
      color: var(--color-primary-700);

      ${maxMedia.small} {
        margin-left: 0.7rem;
      }

      span {
        margin-right: 0.5rem;
        line-height: 1.33;
        color: var(--color-red-6);
      }
    }

    &_btn-cart {
      display: none;

      width: 1.5rem;
      color: var(--color-red-6);
      cursor: pointer;
      font-size: 18px;
    }

    &_badge {
      position: absolute;
      top: 0;
      right: 0;

      padding: 4px 8px;

      font-size: 12px;
      font-weight: 600;
      line-height: 1.33;
      color: var(--color-white);
      background-color: var(--color-red-6);

      &.--new {
        background-color: orange;
      }
    }

    &_preview_group {
      display: flex;
      align-items: center;
      gap: 15px;

      .like_wrapper,
      .watch_wrapper,
      .star_wrapper {
        display: flex;
        align-items: center;
        color: var(--color-gray-7);
        font-size: 12px;

        .my-icon {
          font-size: 15px;
          margin-right: 3px;
        }

        &:hover,
        &:hover svg {
          color: var(--color-primary-700);
        }
      }
    }
  }
`;
