import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import { Button, ConfigProvider, Form, message, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

import config from 'config';
import { FilesType } from 'constants/upload-model.constant';

import { UploadModelContext } from './Provider';
import UploadModelSection from './Fragments/Section';
import ModalAddFileType from './Fragments/ModalAddFileType';
import LabelWithTooltip from './Fragments/LabelWithTooltip';

import styled, { css } from 'styled-components';

type Props = {
  saveType?: 'draft' | 'public';
  isHaveFile: boolean;
  onChangeHaveFile: (value: boolean) => void;
};

const UploadFile = (props: Props) => {
  const { data, filesType, onChangeFileType, updateFieldChanged } = useContext(UploadModelContext);
  const form = Form.useFormInstance();
  const isPublish = props.saveType === 'public';

  const [openAddFile, setOpenAddFile] = useState<boolean>(false);

  useEffect(() => {
    if (data?.files && filesType.length <= 0)
      onChangeFileType(FilesType.filter((i) => data.files?.[i.key]));
    else if (!data) onChangeFileType([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onAddFileType = (value: string[]) => {
    const formats = FilesType.filter((i) => value.includes(i.key));
    if (!formats.length) props.onChangeHaveFile(false);
    form.resetFields(filesType.filter((i) => !value.includes(i.key)).map((i) => i.key));
    onChangeFileType(formats);
    setOpenAddFile(false);
    updateFieldChanged(true);
  };

  const normalFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onBeforeUpload = (file: RcFile, fieldName: string) => {
    const fileName = file?.name,
      fileSize = file?.size,
      fileFormat = fileName?.split('.')?.slice(-1)[0]?.toLowerCase();

    // Check file demo
    if (fieldName === 'DEMO') {
      const maxSizeDemo = 1024 * 1024 * 20;
      if (!fileName || fileFormat !== 'glb' || fileSize > maxSizeDemo) {
        if (fileFormat !== 'glb' && fileName) message.error('Demo file must be GLB');
        else if (fileSize > maxSizeDemo)
          message.error('Demo files are not allowed to be larger than 20MB');
        return Upload.LIST_IGNORE;
      } else onSendModelToViewer('model', file);
    }

    // Check file model
    const filesType = FilesType.map((i) => i.key);
    if (filesType.includes(fieldName)) {
      const fileAccept = FilesType.find((i) => i.key === fieldName)?.accept;
      if (fileFormat && !fileAccept?.includes(fileFormat)) {
        message.error('The file is not in the correct format');
        return Upload.LIST_IGNORE;
      } else props.onChangeHaveFile(true);
    }

    // Check if the file is empty (0 byte)
    if (fileSize === 0) {
      message.error('File is empty! Please select a valid file');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const onSendModelToViewer = (type: 'cancel' | 'model', file?: any) => {
    const viewer = document.querySelector('iframe');
    let postMsg = { type, file };
    viewer?.contentWindow?.postMessage(postMsg, config.urlModelViewer);
  };

  return (
    <>
      <UploadModelSection title='Upload Models'>
        <Wrapper>
          <FileItem id='field-item-DEMO'>
            <Form.Item
              required={isPublish}
              label={
                <LabelWithTooltip
                  title='Demo'
                  tooltip={
                    <>
                      <p>Only GLB file under 20MB is allowed</p>
                      <Link
                        href='https://vrstyler.com/en/help-center/faqs--f0f08e59-645f-42bb-8608-8f814a70e438/why-should-seller-upload-a-demo-file--07048fe5-8020-4158-aaff-e533ead0864d'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Why upload a demo file?
                      </Link>
                    </>
                  }
                />
              }>
              <ConfigProvider theme={{ token: { motionDurationSlow: '0s' } }}>
                <Form.Item
                  noStyle
                  name='DEMO'
                  valuePropName='fileList'
                  getValueFromEvent={normalFile}
                  rules={[{ required: isPublish, message: 'Please upload demo model' }]}>
                  <Upload
                    maxCount={1}
                    beforeUpload={(file) => onBeforeUpload(file, 'DEMO')}
                    onRemove={() => onSendModelToViewer('cancel')}>
                    <Button className='btn-upload-file' icon={<UploadOutlined />}>
                      Upload demo file
                    </Button>
                  </Upload>
                </Form.Item>
              </ConfigProvider>
            </Form.Item>
          </FileItem>

          {FilesType.map((file) => {
            const isShow: boolean = Boolean(filesType.includes(file));
            return (
              <FileItem key={file.key} id={'field-item-' + file.key} $isShow={isShow}>
                <Form.Item label={file.title} required={isShow && isPublish}>
                  <ConfigProvider theme={{ token: { motionDurationSlow: '0s' } }}>
                    <Form.Item
                      noStyle
                      name={file.key}
                      valuePropName='fileList'
                      getValueFromEvent={normalFile}
                      rules={[
                        { required: isShow && isPublish, message: `${file.key} file is required` },
                      ]}>
                      <Upload
                        maxCount={1}
                        beforeUpload={(uploadFile) => onBeforeUpload(uploadFile, file.key)}>
                        <Button className='btn-upload-file' icon={<UploadOutlined />}>
                          Upload {file.key} file
                        </Button>
                      </Upload>
                    </Form.Item>
                  </ConfigProvider>
                </Form.Item>
              </FileItem>
            );
          })}

          <div id='field-item-file-is-required'>
            <Button
              className='UploadModel__BtnAddFile'
              icon={<PlusOutlined />}
              onClick={() => setOpenAddFile(true)}>
              Add file Upload
            </Button>

            <FileItem $isShow={!props.isHaveFile && filesType?.length === 0}>
              <Form.Item
                className='upload-file-msg-validate'
                name='file-is-required'
                rules={[
                  {
                    required: isPublish && !props.isHaveFile,
                    message: 'You must upload at least one model file',
                  },
                ]}>
                <span />
              </Form.Item>
            </FileItem>
          </div>
        </Wrapper>
      </UploadModelSection>

      <ModalAddFileType
        visible={openAddFile}
        filesType={filesType}
        onOk={onAddFileType}
        onCancel={() => setOpenAddFile(false)}
      />
    </>
  );
};

export default UploadFile;

const Wrapper = styled.div`
  .upload-file-msg-validate {
    display: block;
    margin-top: -10px;
    font-size: 13px;

    .ant-form-item-control-input {
      min-height: 0;
    }
  }
  .UploadModel__BtnAddFile {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 10px 0;
    width: 182px;
    color: var(--color-primary-700);
    border-color: var(--color-primary-700);

    .anticon {
      font-size: 12px;
    }
  }
`;
const FileItem = styled.div<{ $isShow?: boolean }>`
  ${({ $isShow }) => {
    if ($isShow === false)
      return css`
        margin-top: 0 !important;
        height: 0;
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
      `;
  }}

  .ant-checkbox-wrapper span:nth-child(2),
  .ant-form-item-label label {
    color: var(--color-gray-7);
    user-select: none;
  }
  .ant-form-item {
    div.ant-form-item-label {
      padding-bottom: 5px;
    }
  }
  .btn-upload-file {
    display: flex;
    align-items: center;

    width: 182px;
  }
  .ant-upload-text-icon {
    display: inline-flex;
  }
  .ant-upload-list-item {
    width: fit-content;
    min-width: 182px;
    .ant-upload-list-item-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  }
`;
