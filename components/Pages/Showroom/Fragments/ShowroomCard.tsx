import Link from 'next/link';
import { Tooltip } from 'antd';

import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';
import { decimalPrecision, formatNumber } from 'common/functions';
import { avtDefault } from 'common/constant';
import isArrayEmpty from 'common/functions/isArrayEmpty';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';

import { ShowroomModel, ShowroomType } from 'models/showroom.models';
import { ProductStatus } from 'models/product.model';

import styled, { css } from 'styled-components';

const Wrapper = styled.div<{ $notHover: boolean }>`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
  background-color: #fff;
  transition: all 100ms ease-in-out;
  ${({ $notHover }) => {
    if (!$notHover)
      return css`
        &:hover {
          transform: translateY(-4px);
        }
      `;
  }}
`;
const ShowroomInfo = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, max-content);
  grid-gap: 10px;
  align-items: center;

  .showroom-info-left {
    display: grid;
    grid-template-columns: 56px auto;
    align-items: center;
    gap: 8px;
  }

  .showroom-info-avatar {
    border-radius: 8px;
    object-fit: cover;
  }

  .showroom-info-name {
    font-size: 16px;
    display: inline-block;
    font-weight: 500;
    color: var(--color-gray-11);
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .showroom-info-vip {
    margin-top: 4px;
    width: fit-content;
    padding: 2px 8px;
    font-size: 12px;
    color: var(--color-gray-9);
    border-radius: 1px;
    background-color: #ffa351;
  }

  .showroom-info-right {
    flex: none;
    align-items: center;

    min-width: 0;
  }

  .showroom-info-title {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  .showroom-info-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    color: var(--color-gray-8);
    &:not(:first-child) {
      margin-top: 10px;
    }
    .my-icon {
      font-size: 16px;
    }
  }
`;
const ShowroomProduct = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
  .showroom-product {
    &-item {
      p {
        margin-top: 4px;
        font-size: 14px;
        color: #000;
      }
    }
    &-image {
      position: relative;
      border-radius: 5%;
      aspect-ratio: 4/3;
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;
      img {
        object-fit: cover;
      }
    }
  }
`;

interface Props {
  type: ShowroomType;
  showroom: ShowroomModel;
  notHover?: boolean;
}

export default function ShowroomCard({ type, showroom, notHover }: Readonly<Props>) {
  const { langCode, langLabel } = useLanguage();
  const products = showroom.market_user.market_items;

  const linkShowroom =
    '/' + langCode + urlPage.showroom_chanel.replace('{nickname}', showroom.market_user.nickname);
  const productCount = showroom.market_user.products?.aggregate?.count ?? 0;
  const reviewCount = decimalPrecision(
    showroom.market_user.marketReviewsByAuthorId_aggregate?.aggregate.avg.rate ?? 0,
    1
  );
  const viewCount = showroom.market_user.market_items_aggregate?.aggregate.sum?.viewed_count ?? 0;
  const soldCount =
    showroom.market_user.marketItemsBoughtsByAuthorId_aggregate?.aggregate?.count ?? 0;

  return (
    <Wrapper $notHover={notHover ?? false}>
      <ShowroomInfo>
        <div className='showroom-info-left'>
          <div>
            <Link href={linkShowroom}>
              <MyImage
                className='showroom-info-avatar'
                src={showroom.market_user.image}
                img_error={avtDefault}
                alt=''
                width={56}
                height={56}
              />
            </Link>
          </div>

          <div className='showroom-info-title'>
            <Tooltip title={showroom.market_user.name || showroom.market_user.nickname}>
              <a className='showroom-info-name' href={linkShowroom}>
                {showroom.market_user.name || showroom.market_user.nickname}
              </a>
            </Tooltip>
            {showroom.is_vip && <span className='showroom-info-vip'>Vip</span>}
          </div>
        </div>

        <div className='showroom-info-right'>
          <div className='showroom-info-count'>
            <Icon iconName='model-box' /> {langLabel.product}: {productCount}
          </div>
          <div className='showroom-info-count'>
            {type === 'review' && <Icon iconName='seller-star' />}
            {type === 'view' && <Icon iconName='seller-eye' />}
            {type === 'sold' && <Icon iconName='chart' />}

            {type === 'review' && `${langLabel.review}: ${reviewCount}/5`}
            {type === 'view' && `${langLabel.views}: ${viewCount}`}
            {type === 'sold' && `${langLabel.sold}: ${soldCount}`}
          </div>
        </div>
      </ShowroomInfo>

      {!isArrayEmpty(products) && (
        <ShowroomProduct>
          {showroom.market_user.market_items.map((product) => {
            const isActive =
              (!product.status || product.status === ProductStatus.ACTIVE) &&
              (!product.market_item_categories ||
                product.market_item_categories.some((i) => i.market_category.status));
            return (
              <div
                key={product.id}
                className='showroom-product-item'
                style={{ opacity: isActive ? 1 : 0.5 }}>
                <div className='showroom-product-image'>
                  <MyImage fill src={product.image} alt={product.title} title={product.title} />
                </div>
                <p>{product.price ? formatNumber(product.price, '$') : 'Free'}</p>
              </div>
            );
          })}
        </ShowroomProduct>
      )}
    </Wrapper>
  );
}
