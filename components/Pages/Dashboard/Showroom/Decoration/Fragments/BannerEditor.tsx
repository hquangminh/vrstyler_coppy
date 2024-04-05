import { useEffect, useState } from 'react';
import { App, Button, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

import useLanguage from 'hooks/useLanguage';
import { isUUID } from 'common/functions';
import getBase64 from 'functions/getBase64';
import isBase64Image from 'functions/isBase64Image';
import showroomServices from 'services/showroom-services';

import Icon from 'components/Fragments/Icons';
import ImageCrop from './ImageCrop';

import { ShowroomDecorationModel } from 'models/showroom.models';

import styled from 'styled-components';

const EditorWrapper = styled.div`
  position: sticky;
  top: 50px;

  padding: 24px;
  background-color: var(--color-gray-4);
  .decoration-banner-editor {
    &-title {
      font-size: 20px;
      font-weight: 500;
      color: var(--color-gray-11);
    }
    &-caption {
      margin-top: 4px;
      padding-bottom: 15px;
      font-size: 14px;
      color: var(--color-gray-9);
      border-bottom: 1px solid var(--color-gray-5);
    }
    &-setting {
      margin-top: 16px;
      p {
        font-size: 16px;
        font-weight: 500;
        color: var(--color-gray-9);
      }
      ul {
        margin-top: 8px;
        padding-left: 10px;
        font-size: 14px;
        color: var(--color-gray-9);
        list-style: inside;
      }
    }

    &-upload {
      margin-top: 16px;
      &-icon {
        margin-bottom: 18px;
        .my-icon {
          font-size: 26px;
          color: var(--color-gray-8);
        }
      }
      .ant-upload {
        padding: 0;
        background-color: var(--color-gray-3);
        overflow: hidden;
        .ant-upload-drag-container {
          height: 100px;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    &-save {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--color-gray-5);
      text-align: right;
      .ant-btn {
        width: 122px;
        height: 41px;
      }
    }
  }
  .decoration-banner-editor-upload {
    background-color: var(--color-gray-4);
    .upload_picture {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 16px;
      padding-bottom: 16px;
      .decoration-banner-editor-upload-icon {
        margin-bottom: 0;
      }
    }
    .ant-upload-hint {
      padding-left: 8px;
    }
  }
`;

type ImageType = { type: string; name: string; url: string };
type Props = {
  themeId: string;
  data: ShowroomDecorationModel;
  onFinish: (data: ShowroomDecorationModel) => void;
  setShouldPromptUnload: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function DecorationBannerEditor(props: Props) {
  const { themeId, data, onFinish, setShouldPromptUnload } = props;
  const { langLabel, t } = useLanguage();

  const { message } = App.useApp();

  const [image, setImage] = useState<ImageType>({ url: '', type: '', name: '' });
  const [openCrop, setOpenCrop] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    setImage({ url: data.image || '', type: '', name: '' });
  }, [data]);

  const onSubmit = async (base64: string) => {
    try {
      setIsAdding(true);
      let params: any = { type: 1, image: base64 };
      const filename = image.url?.split('/').slice(-1)[0];
      const fileType = base64.split(';')[0].split(':')[1];

      params['filename'] = image.name === '' ? filename : image.name;
      params['filetype'] = image.type === '' ? fileType : image.type;
      if (data.image) params['oldImage'] = data.image;
      let responseAPI;

      if (isUUID(data.id))
        responseAPI = await showroomServices.updateDecorationSection(themeId, data.id, params);
      else responseAPI = await showroomServices.addDecorationSection(themeId, params);

      if (!responseAPI.error) {
        onFinish(responseAPI.data.market_showroom_section);
        setShouldPromptUnload('done');
        setOpenCrop(false);
      }
      setIsAdding(false);
    } catch (error: any) {
      setIsAdding(false);
    }
  };

  const onBeforeChange = async (file: RcFile) => {
    const size2MB = file.size <= 2 * 1024 * 1024;
    const fileFormat = file?.name?.split('.')?.slice(-1)[0]?.toLowerCase();
    const typeImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileFormat);

    if (!(size2MB && typeImage)) {
      message.error(
        t('message_validate_image_file')
          .replace('{{file_extension}}', 'JPG, JPEG, PNG, WEBP')
          .replace('{{limit_size}}', '2MB')
      );
      return Upload.LIST_IGNORE;
    }

    const base64 = await getBase64(file);
    const isImage = await isBase64Image(base64);

    if (isImage) {
      setImage({ type: file.type, name: file.name, url: base64 });
      setOpenCrop(true);
      setShouldPromptUnload('inProgress');
    } else {
      message.error(t('message_cant_read_files'));
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleClose = () => {
    setOpenCrop(false);
    setShouldPromptUnload((prevState) => {
      if (prevState !== undefined) return undefined;
      return prevState;
    });
  };

  return (
    <>
      <EditorWrapper>
        <div className='decoration-banner-editor-title'>
          {t('dashboard_theme_decoration_image_banner_name')}
        </div>
        <div className='decoration-banner-editor-caption'>
          {langLabel.dashboard_theme_decoration_image_banner_description}
        </div>
        <div className='decoration-banner-editor-setting'>
          <p>{langLabel.dashboard_theme_decoration_image_banner_request_title}</p>
          <ul
            dangerouslySetInnerHTML={{
              __html: langLabel.dashboard_theme_decoration_image_banner_request_description,
            }}
          />
        </div>
        <div className='decoration-banner-editor-setting'>
          <p>{langLabel.dashboard_theme_decoration_image_banner_proportion_title}</p>
          <ul
            dangerouslySetInnerHTML={{
              __html: langLabel.dashboard_theme_decoration_image_banner_proportion_description,
            }}
          />
        </div>
        <div className='decoration-banner-editor-upload'>
          <Upload.Dragger
            showUploadList={false}
            maxCount={1}
            beforeUpload={(file) => onBeforeChange(file)}>
            {data.image ? (
              <img src={data.image} alt='' />
            ) : (
              <div className='upload_picture'>
                <p className='decoration-banner-editor-upload-icon'>
                  <Icon iconName='upload-banner-showroom' />
                </p>
                <p className='ant-upload-hint'>{langLabel.upload_image}</p>
              </div>
            )}
          </Upload.Dragger>
        </div>
        <div className='decoration-banner-editor-save'>
          <Button type='primary' disabled={!data.image} onClick={() => setOpenCrop(true)}>
            {langLabel.btn_edit}
          </Button>
        </div>
      </EditorWrapper>

      <ImageCrop
        open={openCrop}
        image={image.url}
        fileType={(image.type || data.type).toString().split('/')[1]}
        isConfirming={isAdding}
        onClose={() => handleClose()}
        onSave={onSubmit}
      />
    </>
  );
}
