import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { AddProductCartRedux, isExistInCart } from 'store/reducer/cart';

import { App, Button, ConfigProvider, Tooltip } from 'antd';
import { LoadingOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { AddToCart } from 'lib/utils/checkout';
import { decimalPrecision, formatNumber } from 'common/functions';
import percentDiscount from 'common/functions/percDiscount';
import urlPage from 'constants/url.constant';
import { AppState } from 'store/type';

import Icon from 'components/Fragments/Icons';
import ModalDownloadModel from 'components/Fragments/ModalDownloadModel';

import { AuthModel } from 'models/page.models';
import { ProductModel } from 'models/product.model';
import { UserType } from 'models/user.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  auth?: AuthModel;
  data: ProductModel;
  isFree?: boolean;
  isPreview?: boolean;
};

const ProductDetailHeader = (props: Props) => {
  const { data, isFree, auth, isPreview } = props;
  const { message } = App.useApp();
  const { langLabel } = useLanguage();
  const router = useRouter();

  const dispatch = useDispatch();
  const isExistCart = useSelector((state: AppState) => {
    return isExistInCart(state, data.id) ?? data.is_cart;
  });

  const [addToCartStatus, setAddToCartStatus] = useState<'adding' | 'success'>();
  const [openDownload, setOpenDownload] = useState<boolean>(false);

  useEffect(() => setOpenDownload(false), [data]);

  const onAddToCart = async () => {
    if (!auth?.token) router.push(`/login?redirect=${router.asPath}`);
    else if (data.is_bought)
      message.error({
        key: `already-bought-${data.id}`,
        content: langLabel.product_already_bought,
      });
    else if (isExistCart) router.push(urlPage.cart);
    else {
      setAddToCartStatus('adding');
      const { error, data: dataCart } = await AddToCart(data, langLabel);
      if (!error) {
        dispatch(AddProductCartRedux(dataCart));
        setAddToCartStatus('success');
      }
      setTimeout(() => setAddToCartStatus(undefined), error ? 0 : 1000);
    }
  };

  const onDownload = () => {
    if (!auth) router.push(`/login?redirect=${router.asPath}`);
    else setOpenDownload(true);
  };

  return (
    <Wrapper>
      <p className='price'>{!isFree ? formatNumber(data?.price, '$') : 'Free'}</p>
      {!isFree && (
        <div className='wrapper__discount'>
          {data?.old_price && (
            <span className='discount__price'>
              {decimalPrecision(percentDiscount(data?.price, data?.old_price), 2)}%
            </span>
          )}
          {data?.old_price && (
            <span className='old__price'>{formatNumber(data?.old_price, '$')}</span>
          )}
        </div>
      )}

      {data.market_license && (
        <div className='Product__License d-flex align-items-center'>
          {data.market_license?.title}
          <Tooltip color='var(--color-primary-700)' title={data.market_license?.description}>
            <InfoCircleOutlined />
          </Tooltip>
          <a
            href={data.market_license?.link}
            target='_blank'
            rel='noreferrer'
            className='Product_License_Link'>
            {langLabel.btn_learn_more || 'Learn more'}
          </a>
        </div>
      )}

      {!isFree && (
        <ul className='Product__InterestCustomer'>
          <li>
            <Icon iconName='lock' />
            <span>{langLabel.checkout_secure_connection}</span>
          </li>
          <li>
            <Icon iconName='mail' />
            <span>{langLabel.support_from_seller}</span>
          </li>
        </ul>
      )}

      {!isPreview && auth?.user.type !== UserType.SHOWROOM && (
        <ConfigProvider theme={{ token: { colorPrimary: '#ba3d4f' } }}>
          <Button
            className='Btn_AddToCart w-100'
            type='primary'
            icon={
              addToCartStatus === 'adding' ? (
                <LoadingOutlined />
              ) : addToCartStatus === 'success' ? (
                <CheckCircleOutlined />
              ) : null
            }
            disabled={typeof addToCartStatus === 'string'}
            onClick={isFree ? onDownload : onAddToCart}>
            {isFree
              ? langLabel.btn_download_free
              : isExistCart
              ? langLabel.btn_go_to_cart
              : langLabel.btn_add_to_card}
          </Button>
        </ConfigProvider>
      )}

      <ModalDownloadModel
        isOpen={openDownload}
        isFree
        product={data}
        files={data.file_details ?? []}
        onClose={() => setOpenDownload(false)}
      />
    </Wrapper>
  );
};

export default ProductDetailHeader;

const Wrapper = styled.div`
  ${maxMedia.medium} {
    margin-top: 15px;
  }

  .price {
    font-size: 40px;
    font-weight: 600;
    line-height: 1;
    color: var(--text-caption);
  }

  .wrapper__discount {
    margin-top: 10px;

    .discount__price {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-primary-500);
    }

    .old__price {
      margin-left: 10px;
      font-size: 16px;
      color: var(--color-gray-7);
      text-decoration: line-through;
    }
  }

  .Product__License {
    display: flex;
    align-items: center;
    gap: 6.5px;
    margin-top: 10px;
    font-size: 16px;
    color: var(--text-caption);

    & > span {
      color: var(--color-icon);
      cursor: pointer;
    }

    ${maxMedia.medium} {
      margin-top: 6px;
    }
  }

  .Product__InterestCustomer {
    margin-top: 20px;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      color: var(--color-icon);

      & + li {
        margin-top: 6px;
      }

      .my-icon {
        font-size: 20px;
      }

      span + span {
        margin-left: 5px;
      }
    }

    ${maxMedia.medium} {
      margin-top: 15px;
    }
  }

  .Btn_AddToCart {
    display: inline-flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    height: 42px;
    font-size: 16px;
    font-weight: 500;

    .anticon {
      display: inline-flex;
      font-size: 18px;
    }

    ${maxMedia.medium} {
      margin-top: 15px;
    }
  }
  .Product_License_Link {
    font-size: 14px;
    color: #1890ff;
    &:hover {
      color: #1890ff;
      text-decoration: underline;
    }
  }
`;
