import { useEffect, useState } from 'react';

import { Button, Upload, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

import useLanguage from 'hooks/useLanguage';
import { isUUID } from 'common/functions';
import getBase64 from 'functions/getBase64';
import isBase64Image from 'functions/isBase64Image';
import showroomServices from 'services/showroom-services';

import Icon from 'components/Fragments/Icons';
import ImageCarouselSetting from './ImageCarouselSetting';

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
      }
      img {
        width: 100%;
        object-fit: cover;
        object-position: center;
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
    img {
      height: 15vh;
    }
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
  .slick-slide {
    cursor: pointer;
  }
  .link_image {
    margin-bottom: 8px;
    margin-left: 5px;
    font-size: 14px;
    .anticon-link {
      margin-right: 9.7px;
    }
    a {
      color: #1890ff;
    }
  }
`;

type ImageType = { id: string; filetype: string; filename: string; image: string };
type Props = {
  themeId: string;
  data: ShowroomDecorationModel;
  onFinish: (data: ShowroomDecorationModel) => void;
  setShouldPromptUnload: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function DecorationImageCarouselEditor(props: Props) {
  const { themeId, data, onFinish, setShouldPromptUnload } = props;
  const { langLabel, t } = useLanguage();

  const [images, setImages] = useState<ImageType[]>();
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (data.market_showroom_section_images)
      setImages(
        data.market_showroom_section_images.map((i) => ({
          id: i.id,
          image: i.image,
          filetype: '',
          filename: '',
        }))
      );
  }, [data, openSetting]);

  const onChangeImage = (index: number, image: ImageType) => {
    setImages((current) =>
      current
        ?.map((i, ind) => (index === ind ? { ...image } : { ...i }))
        .concat(index > current.length - 1 ? [image] : [])
    );
  };

  const onBeforeChange = async (fileList: RcFile[]) => {
    const imageList: ImageType[] = [];
    const uniqueFileList = Array.from(new Set(fileList));

    for (const file of uniqueFileList) {
      const size2MB = file.size <= 2 * 1024 * 1024;
      const fileName = file.name;
      const fileFormat = fileName.split('.').slice(-1)[0].toLowerCase();
      const typeImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileFormat);

      if (size2MB && typeImage) {
        const base64 = await getBase64(file);
        const isImage = await isBase64Image(base64);

        if (isImage) {
          imageList.push({
            id: file.uid,
            image: base64,
            filename: file.name,
            filetype: file.type,
          });
          setShouldPromptUnload('inProgress');
        }
      }
    }
    if (imageList.length < 3 && imageList.length < fileList.length) {
      message.error({
        key: 'mess_error',
        content: t('message_validate_image_file')
          .replace('{{file_extension}}', 'JPG, JPEG, PNG, WEBP')
          .replace('{{limit_size}}', '2MB'),
      });
    }

    if (imageList.length > 0) {
      setImages(imageList.slice(0, 3));
      setOpenSetting(true);
    }
  };

  const onSubmit = async (aspect: number) => {
    if (images) {
      try {
        setSubmitting(true);
        let params: any = { type: 2, carousel_aspect: Number(aspect.toFixed(2)) };
        let imageUpdate = [];
        for (const img of images) {
          if (isUUID(img.id) && img.image.startsWith('data:image/')) {
            imageUpdate.push({ ...img, oldImage: images.find((i) => i.id === img.id)?.image });
          } else if (!isUUID(img.id)) imageUpdate.push({ ...img, id: undefined });
        }
        params['listImage'] = imageUpdate;

        let responseAPI;

        if (isUUID(data.id))
          responseAPI = await showroomServices.updateDecorationSection(themeId, data.id, params);
        else responseAPI = await showroomServices.addDecorationSection(themeId, params);

        if (!responseAPI.error) {
          onFinish(responseAPI.data.market_showroom_section);
          setOpenSetting(false);
          setShouldPromptUnload('done');
        }
        setSubmitting(false);
      } catch (error: any) {
        setSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setOpenSetting(false);
    setShouldPromptUnload((prevState) => {
      if (prevState !== undefined) return undefined;
      return prevState;
    });
  };

  return (
    <>
      <EditorWrapper>
        <div className='decoration-banner-editor-title'>
          {t('dashboard_theme_decoration_banner_carousel_name')}
        </div>
        <div className='decoration-banner-editor-caption'>
          {langLabel.dashboard_theme_decoration_banner_carousel_description}
        </div>
        <div className='decoration-banner-editor-setting'>
          <p>{langLabel.dashboard_theme_decoration_banner_carousel_request_title}</p>
          <ul
            dangerouslySetInnerHTML={{
              __html: langLabel.dashboard_theme_decoration_banner_carousel_request_description,
            }}
          />
        </div>
        <div className='decoration-banner-editor-setting'>
          <p>{langLabel.dashboard_theme_decoration_banner_carousel_proportion_title}</p>
          <ul
            dangerouslySetInnerHTML={{
              __html: langLabel.dashboard_theme_decoration_banner_carousel_proportion_description,
            }}
          />
        </div>
        <div className='decoration-banner-editor-upload'>
          {data.market_showroom_section_images ? (
            <>
              {images && images.length > 0 ? (
                <div>
                  {images.map((img, ind) => {
                    const urlParts = img.image.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    const fileExtension = img.filetype
                      ? img.filetype.split('/')[1]
                      : filename.split('.').pop();
                    const displayFileName = `Image ${ind + 1}. ${fileExtension?.toLowerCase()}`;
                    return (
                      <div key={ind} className='link_image'>
                        <LinkOutlined />
                        <a target='_blank' rel='noopener noreferrer' key={ind} href={img.image}>
                          {displayFileName}
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='decoration-image-default'>
                  <img
                    src='/static/images/showroom/decoration/toolbar-category-image-carousel.jpg'
                    alt=''
                  />
                </div>
              )}
            </>
          ) : (
            <Upload.Dragger
              multiple
              maxCount={3}
              showUploadList={false}
              beforeUpload={(file, fileList) => {
                onBeforeChange(fileList);
                return Upload.LIST_IGNORE;
              }}>
              <div className='upload_picture'>
                <p className='decoration-banner-editor-upload-icon'>
                  <Icon iconName='upload-banner-showroom' />
                </p>
                <p className='ant-upload-hint'>{langLabel.upload_image}</p>
              </div>
            </Upload.Dragger>
          )}
        </div>
        <div className='decoration-banner-editor-save'>
          <Button
            type='primary'
            disabled={!data.market_showroom_section_images}
            onClick={() => setOpenSetting(true)}>
            {t('btn_edit', 'Edit')}
          </Button>
        </div>
      </EditorWrapper>

      <ImageCarouselSetting
        open={openSetting}
        images={images || []}
        aspect={data.carousel_aspect}
        isConfirming={submitting}
        onChangeImage={onChangeImage}
        onClose={handleClose}
        onSave={onSubmit}
      />
    </>
  );
}
