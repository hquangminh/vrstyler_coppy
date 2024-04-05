import { useState } from 'react';

import { Button, ConfigProvider, Flex, Modal, ModalProps, Radio } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { ProductFileFormat } from 'constants/product.constant';
import assetsServices from 'services/assets-services';

import MyImage from './Image';

import { FormatFiles } from 'models/formatFiles.models';
import { AssetModel } from 'models/asset.models';
import { ProductModel } from 'models/product.model';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  isOpen: boolean;
  isFree?: boolean;
  product: ProductModel | AssetModel;
  files: FormatFiles[];
  onClose: () => void;
  onUpdateDownloaded?: () => void;
};

const ModalDownloadModel = (props: Props) => {
  const { langLabel } = useLanguage();

  const [fileDownload, setFileDownload] = useState<FormatFiles>();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const onDownload = async () => {
    if (!fileDownload) return;

    try {
      setIsDownloading(true);
      const { url } = await assetsServices[props.isFree ? 'downloadFree' : 'download'](
        'item_id' in props.product ? props.product.item_id : props.product.id,
        fileDownload
      );
      window.open(url, '_self');
      setIsDownloading(false);
      if (props.onUpdateDownloaded) props.onUpdateDownloaded();
    } catch (error: any) {
      setIsDownloading(false);
    }
  };
  const handleCloseModal = () => {
    setFileDownload(undefined);
    props.onClose();
  };

  const modalProps: ModalProps = {
    title: langLabel.download_modal || 'Download Model',
    open: props.isOpen,
    footer: null,
    centered: true,
    width: 640,
    destroyOnClose: true,
    onCancel: handleCloseModal,
  };

  return (
    <ModalWrapper {...modalProps}>
      <div className='Model__Info'>
        <MyImage
          className='Model__Image'
          src={props.product?.image}
          alt=''
          loading='lazy'
          width={64}
          height={48}
        />
        <h3 className='Model__Title'>{props.product?.title}</h3>
      </div>

      <Radio.Group className='File__List' onChange={(e) => setFileDownload(e.target.value)}>
        {ProductFileFormat.filter((i: any) => props.files?.includes(i.key))?.map((file) => {
          return (
            <Radio key={file.key} value={file.key}>
              {file.title} <span>({file.format})</span>
            </Radio>
          );
        })}
      </Radio.Group>

      <Flex align='center' justify='center' style={{ marginTop: 30 }}>
        <ConfigProvider theme={{ components: { Button: { controlHeight: 42, fontWeight: 600 } } }}>
          <Button
            block
            type='primary'
            style={{ maxWidth: 400 }}
            loading={isDownloading}
            onClick={onDownload}>
            {langLabel.btn_download || 'Download'}
          </Button>
        </ConfigProvider>
      </Flex>
    </ModalWrapper>
  );
};

export default ModalDownloadModel;

const ModalWrapper = styled(Modal)`
  .Model__Info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    .Model__Image {
      border-radius: 4px;
      object-fit: cover;
    }

    .Model__Title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-caption);
      word-break: break-word;
    }
  }

  .File__List {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 10px;

    ${maxMedia.xsmall} {
      grid-template-columns: 100%;
    }

    .ant-radio-wrapper {
      width: fit-content;
      color: var(--text-caption);
      & > span:not([class]) span {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
`;
