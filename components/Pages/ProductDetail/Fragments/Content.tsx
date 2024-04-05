import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from 'antd';

import { changeToSlug, getNewObjByFields, urlGoToProfile } from 'common/functions';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import { OpenShare } from 'store/reducer/web';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import RenderHtmlEditor from 'components/Fragments/RenderHTMLEditor';
import ProductEmbedViewer from './EmbedViewer';

import { ProductModel } from 'models/product.model';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  data: ProductModel;
  isPreview?: boolean;
};

const ProductDetailContent = (props: Props) => {
  const { langCode, langLabel, t } = useLanguage();

  const { data, isPreview } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const [openEmbed, setOpenEmbed] = useState<boolean>(false);

  // Check url (showroom chanel, seller profile) when click author avatar
  const onCheckRedirect = () => {
    const profileUrl = urlGoToProfile(
      data.market_user?.type ?? 0,
      data.market_user?.nickname || ''
    );
    if (profileUrl.includes('undefined')) return;
    else router.push(profileUrl);
  };

  const filteredCategories = data.market_item_categories?.filter(
    (item) => item.market_category.status !== false
  );

  return (
    <ProductContent__Wrapper>
      <Product__Auth onClick={onCheckRedirect}>
        <MyImage
          className={'logo' + (data.market_user?.name ? ' auth-image' : '')}
          width={40}
          height={40}
          src={data.market_user.image}
          img_error='/static/images/avatar-default.png'
          alt=''
        />
        <h4 className='text-truncate'>{data.market_user?.name || 'VRStyler'}</h4>
      </Product__Auth>

      {!isPreview && (
        <Product__Share_Save>
          <li onClick={() => setOpenEmbed(true)}>
            <Icon iconName='embed' />
            <span className='text'>{langLabel.embed}</span>
          </li>
          <li onClick={() => dispatch(OpenShare({ link: location.href }))}>
            <Icon iconName='share' />
            <span className='text'>{langLabel.share}</span>
          </li>
        </Product__Share_Save>
      )}

      <ProductPublishedCategoryTag>
        {data.publish_date && (
          <div className='item'>
            <Icon iconName='clock' />
            <span className='text'>
              {langLabel.published} <Moment date={data.publish_date} langCode={langCode} fromNow />
            </span>
          </div>
        )}
        {!isArrayEmpty(filteredCategories) && (
          <div className='item'>
            <Icon iconName='archive' style={{ fill: 'none' }} />
            <div className='category__list'>
              {filteredCategories?.map(({ market_category }) => {
                const link = `/explore/${changeToSlug(market_category.title)}--${
                  market_category.id
                }`;
                return (
                  <div key={market_category.id}>
                    <Button className='text'>
                      <Link href={link} className='text-truncate-line'>
                        {market_category.title}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {data?.tags && (
          <div className='item'>
            <Icon iconName='tag' />
            <div className='item__wrapper'>
              {data?.tags.split('|').map((tag) => (
                <span key={tag.toString()} className='item__tag text text-truncate'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </ProductPublishedCategoryTag>

      {data.description && (
        <ProductDescription>
          <RenderHtmlEditor html={data.description} />
        </ProductDescription>
      )}

      <ProductEmbedViewer
        visible={openEmbed}
        product={
          getNewObjByFields(data, ['id', 'title', 'viewer_bg', 'market_user']) as ProductModel
        }
        onClose={() => setOpenEmbed(false)}
      />
    </ProductContent__Wrapper>
  );
};

export default ProductDetailContent;

const ProductContent__Wrapper = styled.div``;

const Product__Auth = styled.div`
  margin-top: 15px;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 5px;
  display: inline-flex;

  .logo {
    padding: 8px;
    border-radius: 50%;
    border: 1px solid var(--color-primary-100);

    &.auth-image {
      padding: 0;
      object-fit: cover;
    }
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-title);
    line-height: 1.5;
    a {
      color: inherit;
    }
  }
`;

const Product__Share_Save = styled.ul`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 17px;

  li {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    &:nth-child(2) .my-icon {
      font-size: 16px;
    }

    .my-icon {
      font-size: 20px;

      svg {
        fill: none;
      }
    }

    .text {
      color: #707991;
      font-size: 12px;
      line-height: 16px;
    }
  }
`;

const ProductDescription = styled.div`
  margin-top: 15px;
`;

const ProductPublishedCategoryTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 15px;

  .item {
    display: flex;
    align-items: center;
    gap: 10px;

    .my-icon {
      font-size: 20px;
    }
  }

  .text {
    font-size: 14px;
    color: var(--color-gray-8);
  }

  .ant-btn {
    padding: 7px 8px;
    height: auto;
    border-radius: var(--border-radius-base);
    border: 1px solid #c2c2c2;
  }

  .item__wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 80%;
  }

  .item__tag {
    padding: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #0a0a0a;
    background-color: #edf6f8;
    border-radius: 5px;
  }

  ${maxMedia.xsmall} {
    gap: 10px;
  }
  .category__list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;
