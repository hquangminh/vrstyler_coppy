import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { AppState } from 'store/type';
import { SaveBanner } from 'store/reducer/web';
import { CloseBanner } from 'store/reducer/modal';

import useLanguage from 'hooks/useLanguage';
import bannerServices from 'services/banner-services';

import Icon from './Icons';
import MyImage from './Image';

import { minMedia } from 'styles/__media';

const BannerFreeFragment = () => {
  const router = useRouter();
  const path = router.pathname.split('/')[1];
  const dispatch = useDispatch();
  const banner = useSelector((state: AppState) => state.web.banner);
  const isCloseBanner = useSelector((state: AppState) => state.modal.isCloseBanner);
  const { langCode } = useLanguage();

  const onFetchBanner = useCallback(async () => {
    try {
      const resp = await bannerServices.getBanner();
      if (!resp.error) dispatch(SaveBanner(resp.data[0]));
    } catch (error) {}
  }, [dispatch]);

  useEffect(() => {
    if (banner || path) return;
    onFetchBanner();
  }, [banner, onFetchBanner, path]);

  if (!banner || isCloseBanner || path) return null;

  return (
    <BannerFreeFragment_wrapper>
      <Link
        href={(banner.link.startsWith('/') ? '/' + langCode : '') + (banner?.link || '/')}
        legacyBehavior>
        <a>
          <MyImage fill src={banner?.image} alt='' />
        </a>
      </Link>
      <div className='icon__close'>
        <Icon iconName='close' onClick={() => dispatch(CloseBanner())} />
      </div>
    </BannerFreeFragment_wrapper>
  );
};

const BannerFreeFragment_wrapper = styled.div`
  position: fixed;
  width: 500px;
  max-height: 261px;
  max-width: calc(100% - 42px);
  bottom: 20px;
  right: 20px;
  z-index: 999;
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px;

  img {
    object-fit: cover;
    display: block;
    width: 500px;
    max-height: 261px;
  }

  .icon__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    right: 5px;
    top: 5px;

    width: 32px;
    height: 32px;
    background-color: rgba(218, 218, 218, 0.5);
    border-radius: 2px;
    z-index: 1;
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      background: #fff;
    }
    .my-icon {
      font-size: 20px;
      color: var(--color-gray-7);
    }
  }
  ${minMedia.medium} {
    .icon__close {
      opacity: 0;
      visibility: hidden;
    }
    &:hover {
      .icon__close {
        opacity: 1;
        visibility: visible;
      }
      span.close.my-icon {
        opacity: 1;
      }
    }
  }
`;

export default BannerFreeFragment;
