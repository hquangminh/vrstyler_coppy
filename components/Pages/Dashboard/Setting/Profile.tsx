import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Col, Form, Input, message, Row, Tooltip, Upload } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

import useLanguage from 'hooks/useLanguage';
import { UpdateUser } from 'store/reducer/auth';
import { handlerMessage } from 'common/functions';
import getBase64 from 'functions/getBase64';
import isOnlyEmoji from 'functions/isOnlyEmoji';
import isBase64Image from 'functions/isBase64Image';
import showroomServices from 'services/showroom-services';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';

import { UpdateShowroomBodyType } from 'models/showroom.models';
import { AuthModel } from 'models/page.models';

import styled from 'styled-components';

type Props = { auth: AuthModel };

const ProfileComponent = (props: Props) => {
  const { langLabel, t } = useLanguage();
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>(props.auth.user?.image || '');

  const [enable, setEnable] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const normalFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onBeforeUpload = async (file: RcFile, fieldName: string) => {
    const ruleType = fieldName === 'image' ? ['png', 'jpg', 'jpeg', 'webp'] : [];
    const ruleSize = 2;

    const fileExtension = file?.name.split('.').pop()?.toLowerCase() ?? '';
    const fileSize = file?.size / 1024 / 1024;

    const isValidExtension = ruleType.some((ext) => ext.toLowerCase() === fileExtension);
    const errorMessage = t('message_validate_image_file')
      .replace('{{file_extension}}', ruleType.join(', ').toUpperCase())
      .replace('{{limit_size}}', ruleSize + 'MB');

    if (!(isValidExtension && fileSize <= ruleSize)) {
      message.error(errorMessage);
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  useEffect(() => {
    if (props.auth.user && Object.keys(props.auth.user).length > 0) {
      form.setFieldsValue({
        image: props.auth.user?.image ? [props.auth.user.image] : [],
        name: props.auth.user?.name,
        nickname: props.auth.user?.nickname,
      });
      setImage(props.auth.user?.image ?? '');
      setEnable(false);
    } else form.resetFields();
  }, [form, props.auth.user]);

  const onFetchUpdateShowroom = async (body: UpdateShowroomBodyType) => {
    setLoading(true);
    try {
      const resp = await showroomServices.updateShowroom(body);

      if (!resp.error) {
        if (props.auth.user) {
          dispatch(UpdateUser({ ...props.auth.user, ...resp.data }));
        }
        setLoading(false);
        handlerMessage(t('message_edit_success'), 'success');
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  const onChangeValue = async (fields: any) => {
    const fieldName = Object.keys(fields)[0];

    // Convert image to base64
    if (fieldName === 'image' && fields[fieldName][0]) {
      let base64 = await getBase64(fields[fieldName][0].originFileObj);
      const isImage = await isBase64Image(base64);
      if (isImage) setImage(base64);
      else message.error(t('message_cant_read_files'));
    }

    setEnable(true);
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    let body = { ...values, image: image.startsWith('data:image') ? image : undefined };
    onFetchUpdateShowroom(body);
  };

  return (
    <Wrapper>
      <Form form={form} layout='vertical' onFinish={onSubmit} onValuesChange={onChangeValue}>
        <Row gutter={[20, 5]}>
          <Col span={24}>
            <Form.Item
              className='form-item-only-label'
              label={t('username', 'Username')}
              name='nickname'>
              <Input className='input_setting' disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className='form-item-only-label'
              label={langLabel.dashboard_showroom_form_showroom_name}
              name='name'
              rules={[
                { required: true, message: t('dashboard_setting_form_name_required') },
                { whitespace: true, message: t('dashboard_setting_form_name_not_empty') },
                () => ({
                  validator(_, value) {
                    if (isOnlyEmoji(value))
                      return Promise.reject(new Error(t('form_validate_not_only_emoji')));
                    return Promise.resolve();
                  },
                }),
              ]}>
              <Input
                disabled={loading}
                maxLength={30}
                showCount={{
                  formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                }}
                className='input_setting'
              />
            </Form.Item>
          </Col>

          <Col span={24} id='field-item-image'>
            <Form.Item
              name='image'
              label={
                <div className='image-logo d-flex align-items-center'>
                  Showroom Logo
                  <Tooltip
                    title={
                      <ul
                        style={{ paddingLeft: 20, listStyle: 'initial' }}
                        dangerouslySetInnerHTML={{
                          __html: t('dashboard_setting_showroom_logo_tooltip'),
                        }}
                      />
                    }>
                    <InfoCircleOutlined className='tooltip_header' />
                  </Tooltip>
                </div>
              }
              className='ant-upload_my-custom_logo'
              valuePropName='fileList'
              getValueFromEvent={normalFile}
              initialValue={
                props.auth.user?.image
                  ? [{ name: props.auth.user?.image.split('/').at(-1) }]
                  : undefined
              }>
              <Upload
                disabled={loading}
                className='picture-card-logo'
                showUploadList={false}
                maxCount={1}
                beforeUpload={(file) => onBeforeUpload(file, 'image')}>
                <LogoUpload>
                  {image ? (
                    <div className={`image_wrapper position-relative image-upload-logo`}>
                      <MyImage src={image} width={100} height={100} alt='' />
                      <Button className='btn-edit'>
                        <Icon iconName='edit-showroom' />
                      </Button>
                    </div>
                  ) : (
                    <div className='btn-upload'>
                      <Icon iconName='upload-cloud' />
                      <p>Upload</p>
                    </div>
                  )}
                </LogoUpload>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Button
          type='primary'
          htmlType='submit'
          className='btn_save'
          loading={loading}
          disabled={!enable}>
          {t('btn_save', 'Save')}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default ProfileComponent;

const Wrapper = styled.main`
  position: relative;
  .ant-form-item {
    margin-bottom: 19px;
  }
  .ant-form-item-label {
    overflow: unset;
  }
  .tooltip_header {
    color: var(--color-gray-7);
  }
  .ant-tooltip {
    padding-top: 5px;
    left: 0;
  }
  .ant-tooltip-arrow {
    left: 0;
  }
  .ant-tooltip-inner {
    width: 349px;
    border-radius: 2px;
    background-color: var(--color-gray-9);

    .list {
      list-style-type: disc;
      padding-left: 20px;
    }
  }

  .tooltip_header {
    padding-left: 5px;
  }
  .ant-form-item-required .image-logo .image-dashboard {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray-11);
  }
  .ant-upload {
    margin: 0;
  }

  #field-item-image .ant-form-item-control-input-content {
    line-height: 1;
    > span {
      display: inline-block;
      line-height: 1;
    }
  }

  .btn_save {
    margin-top: 11px;
    font-size: 14px;
    font-weight: 500;
    width: 213px;
    height: 48px;
    padding: 8px 24px;
    border-radius: 4px;
    justify-content: center;
    border: none;
  }
  .input_setting {
    width: 324px;
    height: 40px;
    padding: 5px 10px;
    border-radius: 2px;
    border: solid 1px #f0f0f0;
  }
  .picture-card-logo {
    .ant-upload {
      width: 104px;
      width: 104px;
    }
  }
  .picture-card-dashboard {
    .ant-upload {
      width: 308px;
      height: 77px;
      border: 1px var(--color-gray-5);
    }
  }
  .image-upload-logo {
    width: 100%;
    height: 100%;
    .ant-avatar {
      width: 100%;
      height: 100%;
    }
  }
  .image-upload-dashboard {
    width: 100%;
    height: 0;
    padding-top: 25%;
    position: relative;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .ant-upload.ant-upload-select {
    width: 310px !important;
    height: inherit !important;
  }
`;

const LogoUpload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 104px;
  height: 104px;
  padding: 1px;
  border-radius: 2px;
  border: solid 1px var(--color-gray-5);

  img {
    height: 100%;
    object-fit: cover;
  }

  &:hover .btn-edit {
    opacity: 1;
    visibility: visible;
  }

  .anticon {
    margin-bottom: 9px;
    font-size: 20px;
    color: var(--color-primary-700);
  }
  .btn-edit {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;

    background-color: #0000002e;

    .anticon {
      font-size: 16px;
      color: var(--color-primary-500);
    }
  }
  .btn-upload {
    color: var(--color-gray-6);
    font-size: 14px;
    font-weight: 400;
    text-align: center;
  }
`;
