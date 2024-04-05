import useLanguage from 'hooks/useLanguage';
import { abbreviateNumber, decimalPrecision } from 'common/functions';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';

import { ShowroomStatisticalType } from 'models/showroom.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  statistical?: ShowroomStatisticalType;
  bannerImg: string;
  isScreenShot?: boolean;
};

const BannerComponent = (props: Props) => {
  const i18n = useLanguage();
  // Comment for create PR
  return (
    <Wrapper $isScreenShot={props.isScreenShot || false}>
      <div className='banner'>
        <img
          src={
            props.bannerImg ||
            'https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1676019311500_840813/banner-showroom-detail.png'
          }
          alt='Banner showroom'
        />
      </div>

      <Content>
        <div className='avatar'>
          {props.statistical && (
            <MyImage
              className='avatar__img'
              src={props.statistical.market_users[0].image}
              alt='Avatar'
              width={72}
              height={72}
            />
          )}
          <div className='avatar_information'>
            <h3 className='title text-truncate' title={props.statistical?.market_users[0]?.name}>
              {props.statistical?.market_users[0]?.name}
            </h3>
            {props.statistical?.market_users[0].market_showroom?.is_vip && (
              <p className='class'>VIP</p>
            )}
          </div>
        </div>
        <div className='content__information'>
          <div className='inner'>
            <div className='box box__product'>
              <Icon iconName='model-box' />
              <p className='title'>
                {i18n.t('product', 'Product') + ': '}
                {abbreviateNumber(props.statistical?.market_users[0].products.aggregate.count || 0)
                  .toString()
                  .toLocaleLowerCase()}
              </p>
            </div>

            <div className='box  box__sold'>
              <Icon iconName='seller-eye' />
              <p className='title'>
                {i18n.t('views', 'Views') + ': '}
                {abbreviateNumber(
                  props.statistical?.market_users[0]?.market_items_aggregate?.aggregate?.sum
                    ?.viewed_count || 0
                )
                  .toString()
                  .toLocaleLowerCase()}
              </p>
            </div>
          </div>

          <div className='inner'>
            <div className='box  box__reviews'>
              <Icon iconName='seller-star' />
              <p className='title'>
                {i18n.t('review', 'Review') + ': '}
                {decimalPrecision(
                  props.statistical?.market_users[0]?.marketReviewsByAuthorId_aggregate?.aggregate
                    .avg.rate || 0,
                  1
                )
                  .toString()
                  .toLocaleLowerCase()}
                /5
              </p>
            </div>
            <div className='box  box__product'>
              <Icon iconName='chart' />
              <p className='title'>
                {i18n.t('sold', 'Sold') + ': '}
                {abbreviateNumber(
                  props.statistical?.market_users[0].marketItemsBoughtsByAuthorId_aggregate
                    ?.aggregate.count || 0
                )
                  .toString()
                  .toLocaleLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </Content>
    </Wrapper>
  );
};

export default BannerComponent;

const Wrapper = styled.div<{ $isScreenShot: boolean }>`
  max-width: ${(props) => (props.$isScreenShot ? '' : '1340px')};
  padding: 32px;
  position: relative;

  .banner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    border: 1px solid #eee;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;

  padding: 24px;
  width: fit-content;
  gap: 10px;
  background-color: var(--color-gray-1);
  width: 100%;
  max-width: 680px;

  ${maxMedia.small} {
    gap: 16px;
    grid-template-columns: 1fr;
  }

  .avatar {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 16px;
    &__img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 8px;
      background-color: transparent;
      ${maxMedia.small} {
        width: 60px;
        height: 60px;
      }
    }
    .avatar_information {
      display: grid;
    }
    .title {
      margin-bottom: 2px;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
      color: var(--color-gray-11);
    }

    .class {
      padding: 2px 8px;
      width: fit-content;
      background-color: #ffa351;
      border-radius: 1px;
      font-size: 12px;
      color: var(--color-gray-9);
    }
  }

  .content__information {
    display: flex;
    flex: none !important;
    align-items: center;
    flex-wrap: nowrap;
    gap: 40px;
    ${maxMedia.xsmall} {
      gap: 16px;
      flex-direction: column;
      align-items: flex-start;
    }

    .inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .box {
      display: flex;
      align-items: center;
      gap: 4px;
      width: fit-content;
      color: var(--color-gray-8);

      .title {
        font-size: 12px;
      }

      .my-icon svg {
        width: 16px;
        height: auto;
      }
    }
  }
`;
