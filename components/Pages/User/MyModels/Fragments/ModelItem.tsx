import { useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Button } from 'antd';

import { changeToSlug } from 'common/functions';
import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';
import ModalDownloadModel from 'components/Fragments/ModalDownloadModel';
import ModalReviewProduct from './ModalReview';

import { AssetModel } from 'models/asset.models';

import { maxMedia } from 'styles/__media';

type Props = {
  data: AssetModel;
};

const ModelItem = (props: Props) => {
  const router = useRouter();
  const { langLabel, t } = useLanguage();

  const [review, setReview] = useState<any>(
    props.data.market_item.market_reviews ? props.data.market_item.market_reviews.at(0) : undefined
  );
  const [isOpenReview, setIsOpenReview] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(props.data.downloaded);
  const [isOpenDownload, setIsOpenDownload] = useState<boolean>(false);

  const handleLicenseClick = () => {
    const licenseLink = urlPage.license.replace(
      '{slug}',
      changeToSlug(props.data.title || '') + '--' + props.data.item_id
    );
    router.push(licenseLink);
  };

  return (
    <>
      <Wrapper>
        <div className='Model__Info'>
          <MyImage
            className='Model__Image'
            src={props.data.image}
            alt=''
            loading='lazy'
            width={64}
            height={48}
          />
          <h3 className='Model__Title'>{props.data.title}</h3>
        </div>

        {isDownloaded && (
          <Button className='Btn__License__Mobile' type='link' onClick={handleLicenseClick}>
            {t('license')}
          </Button>
        )}

        <div className='Model__Action'>
          {isDownloaded && (
            <>
              <div className='license_btn_distance'>
                <Button className='Btn__Licence' type='link' onClick={handleLicenseClick}>
                  {t('license')}
                </Button>
              </div>
              {props.data.market_item && (
                <Button className='Btn__Review' onClick={() => setIsOpenReview(!isOpenReview)}>
                  {langLabel.btn_review || 'Review'}
                </Button>
              )}
            </>
          )}
          <Button
            type='primary'
            shape='round'
            className='Btn__Download'
            onClick={() => setIsOpenDownload(true)}>
            {langLabel.btn_download || 'Download'}
            <Icon iconName='download' />
          </Button>
        </div>
      </Wrapper>

      <ModalDownloadModel
        isOpen={isOpenDownload}
        product={props.data}
        files={props.data.file_details ?? []}
        onClose={() => setIsOpenDownload(false)}
        onUpdateDownloaded={() => setIsDownloaded(true)}
      />

      {isDownloaded && (
        <ModalReviewProduct
          review={review}
          visible={isOpenReview}
          product={props.data}
          onClose={() => setIsOpenReview(false)}
          onUpdateReview={(data) => setReview(data)}
        />
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  padding: 15px 0;

  ${maxMedia.small} {
    padding: 20px 0;
  }

  &:not(:last-child) {
    border-bottom: var(--border-1px);
  }

  .Model__Info {
    display: flex;
    align-items: center;
    gap: 20px;

    ${maxMedia.small} {
      max-width: calc(100% - 90px);
    }

    .Model__Image {
      border-radius: 4px;
      object-fit: cover;
    }

    .Model__Title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-caption);
      max-width: 300px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .Btn__License__Mobile {
    display: none;
    padding: 0;
    color: var(--color-gray-7);

    ${maxMedia.small} {
      display: block;
    }
  }

  .Model__Action {
    display: flex;
    align-items: center;
    gap: 15px;

    .ant-btn {
      padding: 0 24px;
      border-radius: 4px;
    }
    .license_btn_distance {
      margin-right: 25px;
      .Btn__Licence {
        color: var(--color-gray-7);
        padding: 0;
        a {
          box-shadow: 0 1px var(--color-gray-7);
          &:hover {
            box-shadow: 0 1px var(--color-primary-700);
          }
        }
        &:hover {
          color: var(--color-primary-700);
        }
      }
    }

    .Btn__Review {
      color: var(--color-primary-700);
      border-color: var(--color-primary-700);
    }

    .Btn__Download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      .my-icon {
        font-size: 15px;
        color: var(--color-white);
      }
    }

    ${maxMedia.small} {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      margin-top: 20px;

      .Btn__Licence {
        display: none;
      }
    }
  }
`;

export default ModelItem;
