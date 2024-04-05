import { useCallback, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { Button, Modal, ModalProps, Space } from 'antd';
import ReactCrop, { centerCrop, convertToPixelCrop, Crop, makeAspectCrop } from 'react-image-crop';

import useLanguage from 'hooks/useLanguage';
import { decimalPrecision } from 'common/functions';

import 'react-image-crop/dist/ReactCrop.css';

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
`;
const AspectSelect = styled.div`
  p {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-gray-9);
  }
  .aspect-select {
    display: flex;
    gap: 16px;

    margin: 16px 0;
    &-item {
      padding: 8px 16px;
      font-size: 16px;
      line-height: 1.5;
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
const CropWrapper = styled.div`
  text-align: center;
  .ReactCrop__crop-selection {
    border: solid 2px #369ca5;
  }
  .ReactCrop__drag-handle {
    &::after {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
      background-color: #fff;
    }
    &.ord-nw {
      margin-top: -6px;
      margin-left: -6px;
    }
    &.ord-ne {
      margin-top: -6px;
      margin-right: -6px;
    }
    &.ord-se {
      margin-bottom: -6px;
      margin-right: -6px;
    }
    &.ord-sw {
      margin-bottom: -6px;
      margin-left: -6px;
    }
    &.ord-n {
      margin-top: -6px;
    }
    &.ord-e {
      margin-right: -6px;
    }
    &.ord-s {
      margin-bottom: -6px;
    }
    &.ord-w {
      margin-left: -6px;
    }
  }
  .ReactCrop {
    width: 100%;
  }
  img {
    height: auto;
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

interface ImageCropProps {
  open: boolean;
  image: string;
  fileType?: string;
  isConfirming?: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (base64: string) => void;
}

export default function ImageCrop(props: ImageCropProps) {
  const { langLabel, t } = useLanguage();

  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [imageCrop, setImageCrop] = useState<string>('');

  const getCroppedImg = useCallback(
    (image: any, crop: Crop) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;
      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
      const ctx: any = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      setImageCrop(canvas.toDataURL('image/' + props.fileType));
    },
    [props.fileType]
  );

  const onChangeCrop = useCallback(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const crop = centerAspectCrop(width, height, aspect || width / height);
      setCrop(crop);
      getCroppedImg(imgRef.current, convertToPixelCrop(crop, width, height));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, getCroppedImg, imgRef.current]);

  useEffect(() => {
    onChangeCrop();
  }, [onChangeCrop]);

  useEffect(() => {
    if (props.image.startsWith('data:image')) {
      setAspect(2);
    }
  }, [props.image]);

  const onGetCropSize = () => {
    let size: [number, number] = [0, 0];
    if (imgRef.current) {
      const { width, height, naturalWidth, naturalHeight } = imgRef.current;
      if (crop?.unit === 'px') {
        const w = (crop.width / width) * naturalWidth;
        const h = (crop.height / height) * naturalHeight;
        size = [w, h];
      }
      if (crop?.unit === '%')
        size = [naturalWidth * (crop.width / 100), naturalHeight * (crop.height / 100)];
    }
    return [decimalPrecision(size[0], 0), decimalPrecision(size[1], 0)];
  };

  const onResetState = () => {
    setCrop(undefined);
    setAspect(undefined);
    setImageCrop('');
  };

  const modalProps: ModalProps = {
    title: t('dashboard_theme_decoration_image_banner_edit'),
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
    onOk: () => props.onSave(imageCrop),
  };

  return (
    <Wrapper ref={wrapRef}>
      <Modal {...modalProps}>
        <AspectSelect>
          <p>{langLabel.dashboard_theme_decoration_image_banner_choose_ratio}</p>
          <div className='aspect-select'>
            {['2:1', '3:1', '4:1', '16:9', 'Custom'].map((tag) => {
              const [width, height] = tag.split(':');
              const ratio = Number(width) / Number(height);
              const active = aspect === ratio || (!aspect && tag === 'Custom');
              return (
                <div
                  key={tag}
                  className={'aspect-select-item' + (active ? ' aspect-select-item-active' : '')}
                  onClick={() => setAspect(ratio)}>
                  {tag === 'Custom' ? langLabel.custom : tag}
                </div>
              );
            })}
          </div>
        </AspectSelect>
        <CropWrapper>
          <ReactCrop
            crop={crop}
            aspect={aspect}
            minWidth={imgRef.current?.width ? (imgRef.current.width / 100) * 50 : undefined}
            minHeight={imgRef.current?.height ? (imgRef.current.height / 100) * 20 : undefined}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(crop) => getCroppedImg(imgRef.current, crop)}>
            <img
              ref={imgRef}
              src={
                props.image?.includes('amazonaws.com/vrstyler')
                  ? 'https://resources.archisketch.com/vrstyler' +
                    props.image.split('amazonaws.com/vrstyler').slice(1).join('')
                  : props.image
              }
              alt=''
              crossOrigin='anonymous'
              onLoad={onChangeCrop}
            />
          </ReactCrop>
        </CropWrapper>
        <Footer>
          {onGetCropSize()[0] !== 0 && onGetCropSize()[1] !== 0 && (
            <p className='image-crop-size'>{`${
              Number.isNaN(aspect) || aspect === undefined
                ? langLabel.dashboard_theme_decoration_size_after_cutting
                : langLabel.dashboard_theme_decoration_proportional_size
            }: ${onGetCropSize()[0]}px * ${onGetCropSize()[1]}px`}</p>
          )}
          <Space size={16}>
            <Button disabled={props.isConfirming} onClick={props.onClose}>
              {langLabel.btn_cancel}
            </Button>
            <Button
              type='primary'
              loading={props.isConfirming}
              onClick={() => props.onSave(imageCrop)}>
              {langLabel.btn_confirm}
            </Button>
          </Space>
        </Footer>
      </Modal>
    </Wrapper>
  );
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 100 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}
