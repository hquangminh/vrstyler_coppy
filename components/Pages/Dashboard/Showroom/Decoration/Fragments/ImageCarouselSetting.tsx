import { useCallback, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { App, Button, Modal, ModalProps, Space, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { InfoCircleOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { decimalPrecision } from 'common/functions';
import getBase64 from 'functions/getBase64';
import isBase64Image from 'functions/isBase64Image';

import Icon from 'components/Fragments/Icons';

const Wrapper = styled.div`
  .ant-modal-content {
    padding: 24px;
    border-radius: 5px;
    overflow: hidden;
  }
  .ant-modal-header {
    padding: 0 0 15px;
  }
  .ant-modal-footer {
    padding: 16px 0 0;
  }
  .ant-modal-body {
    padding: 16px 0;
  }
  .ant-upload {
    &:has(.ant-upload-drag-container .decoration-banner-editor-upload-icon) {
      aspect-ratio: 372/200;
    }
    .ant-upload-btn {
      padding: 0;
    }
    .decoration-banner-editor-upload-icon {
      margin-bottom: 18px;
      .my-icon {
        font-size: 26px;
        color: var(--color-gray-8);
      }
    }
  }
`;
const AspectSelect = styled.div`
  &:nth-child(2) {
    margin-top: 24px;
  }
  p {
    display: flex;
    align-items: center;
    gap: 4px;

    font-size: 16px;
    font-weight: 500;
    color: var(--color-gray-9);
    .anticon {
      color: var(--color-gray-7);
    }
  }
  .aspect-select {
    display: flex;
    gap: 16px;

    margin: 16px 0;
    &-item {
      padding: 8px 16px;
      font-size: 16px;
      line-height: 1;
      color: var(--color-gray-9);
      border-radius: 4px;
      box-shadow: 0 0 0 1px var(--color-gray-5);
      cursor: pointer;
      &-active {
        box-shadow: 0 0 0 2px var(--color-primary-700);
      }
    }
  }
`;
const ImageWrapper = styled.div<{ aspectType?: 'width' | 'height' }>`
  display: flex;
  position: relative;
  overflow: hidden;
  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    ${({ aspectType }) => aspectType}: 100%;
    box-shadow: 0 0 0 1000em rgb(0, 0, 0, 0.5);
  }
  img {
    width: 100%;
  }
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;
  .image-crop-size {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-gray-7);
  }
  .ant-btn {
    height: 41px;
    padding: 4px 42px;
    font-weight: 500;
    &:not(.ant-btn-primary) {
      color: var(--color-gray-7);
    }
  }
`;

type ImageType = { id: string; filetype: string; filename: string; image: string };
type Props = {
  /* eslint-disable no-unused-vars */
  open: boolean;
  images: ImageType[];
  aspect?: number;
  isConfirming?: boolean;
  onChangeImage: (index: number, image: ImageType) => void;
  onClose: () => void;
  onSave: (aspect: number) => void;
};

export default function ImageCarouselSetting(props: Readonly<Props>) {
  const { t } = useLanguage();
  const { message } = App.useApp();

  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const [aspect, setAspect] = useState<number>(props.aspect ?? 2);
  const [imgIndex, setImgIndex] = useState<number>(1);
  const [aspectType, setAspectType] = useState<'width' | 'height' | undefined>();
  const [size, setSize] = useState<[number, number] | undefined>();

  const onUpdateSize = useCallback(() => {
    if (imgRef.current && sizeRef.current) {
      const { naturalWidth, naturalHeight, width, height } = imgRef.current;
      const { clientWidth, clientHeight } = sizeRef.current;

      const w = decimalPrecision(naturalWidth * (clientWidth / width), 0);
      const h = decimalPrecision(naturalHeight * (clientHeight / height), 0);
      setAspectType(width / height > aspect ? 'height' : 'width');
      setSize([w, h]);
    } else setSize(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, sizeRef.current, imgRef.current, imgIndex]);

  useEffect(() => {
    if (props.aspect === undefined) {
      setAspect(2);
    } else {
      setAspect(props.aspect);
    }
  }, [props.aspect]);

  useEffect(() => {
    onUpdateSize();
  }, [onUpdateSize]);

  const onResetState = () => {
    setAspect(props.aspect ?? 2);
    setImgIndex(1);
  };

  const onBeforeChange = async (file: RcFile) => {
    try {
      const size2MB = file.size <= 2 * 1024 * 1024;
      const fileName = file?.name,
        fileFormat = fileName?.split('.')?.slice(-1)[0]?.toLowerCase();

      const typeImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileFormat);
      if (!(size2MB && typeImage)) {
        message.open({
          type: 'error',
          content: t('message_validate_image_file')
            .replace('{{file_extension}}', 'JPG, JPEG, PNG, WEBP')
            .replace('{{limit_size}}', '2MB'),
          key: 'mess_error',
        });
        return Upload.LIST_IGNORE;
      }
      const base64 = await getBase64(file);
      const isImage = await isBase64Image(base64);

      if (isImage)
        props.onChangeImage(imgIndex - 1, {
          id: (props.images && props.images[imgIndex - 1]
            ? props.images[imgIndex - 1].id
            : imgIndex
          ).toString(),
          filetype: file.type,
          filename: file.name,
          image: base64,
        });
      else message.error({ key: 'can-not-read-file', content: t('message_cant_read_files') });
    } catch (err) {
      console.error(err);
    }
    return Upload.LIST_IGNORE;
  };

  const modalProps: ModalProps = {
    title: t('dashboard_theme_decoration_banner_carousel_edit'),
    open: props.open,
    centered: true,
    closable: false,
    width: 688,
    maskClosable: false,
    destroyOnClose: true,
    footer: null,
    getContainer: () => wrapRef.current ?? document.body,
    afterClose: onResetState,
    onCancel: props.onClose,
  };

  return (
    <Wrapper ref={wrapRef}>
      <Modal {...modalProps}>
        <AspectSelect>
          <p>{t('dashboard_theme_decoration_image_banner_choose_ratio')}</p>
          <div className='aspect-select'>
            {['2:1', '3:1', '4:1', '16:9'].map((tag) => {
              const [width, height] = tag.split(':');
              const ratio = Number(width) / Number(height);
              const active = Number(aspect).toFixed(2) === ratio.toFixed(2);
              return (
                <div
                  key={tag}
                  className={'aspect-select-item' + (active ? ' aspect-select-item-active' : '')}
                  onClick={() => setAspect(ratio)}>
                  {tag}
                </div>
              );
            })}
          </div>
        </AspectSelect>
        <AspectSelect>
          <p>
            {t('dashboard_theme_decoration_image_banner_choose_image')}
            <Tooltip
              title={t('dashboard_theme_decoration_image_banner_choose_image_tooltip')}
              placement='right'>
              <InfoCircleOutlined />
            </Tooltip>
          </p>
          <div className='aspect-select'>
            {[1, 2, 3].map((step) => {
              const isDisabled = props.images.length < step - 1;
              return (
                <Button
                  key={step}
                  className={
                    'aspect-select-item' + (imgIndex === step ? ' aspect-select-item-active' : '')
                  }
                  disabled={isDisabled}
                  onClick={() => setImgIndex(step)}>
                  {step}
                </Button>
              );
            })}
          </div>
        </AspectSelect>

        <Upload.Dragger
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => onBeforeChange(file)}>
          {props.images[imgIndex - 1] ? (
            <ImageWrapper aspectType={aspectType}>
              <img
                ref={imgRef}
                src={props.images[imgIndex - 1].image}
                alt=''
                crossOrigin='anonymous'
                onLoad={onUpdateSize}
              />
              <div ref={sizeRef} style={{ aspectRatio: (aspect || 1).toString() }} />
            </ImageWrapper>
          ) : (
            <>
              <p className='decoration-banner-editor-upload-icon'>
                <Icon iconName='upload' />
              </p>
              <p className='ant-upload-hint'>{t('dashboard_theme_decoration_upload_hint')}</p>
            </>
          )}
        </Upload.Dragger>
        <Footer>
          <p className='image-crop-size'>
            {size &&
              !size.every((value) => value === 0) &&
              `${t('dashboard_theme_decoration_proportional_size')}: ${size[0]}px*${size[1]}px`}
          </p>
          <Space size={16}>
            <Button disabled={props.isConfirming} onClick={props.onClose}>
              {t('btn_cancel')}
            </Button>
            <Button
              type='primary'
              loading={props.isConfirming}
              onClick={() => props.onSave(aspect)}>
              {t('btn_confirm')}
            </Button>
          </Space>
        </Footer>
      </Modal>
    </Wrapper>
  );
}
