import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { App, Button, Checkbox, Col, ConfigProvider, Form, Input, Row } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import useLanguage from 'hooks/useLanguage';

import regex from 'common/regex';
import getBase64 from 'functions/getBase64';
import isBase64Image from 'functions/isBase64Image';
import isOnlyEmoji from 'functions/isOnlyEmoji';
import { User3DSoftware, UserSkill } from 'constants/user.constant';
import { SaveAuthRedux } from 'store/reducer/auth';
import userServices from 'services/user-services';

import AvatarUser from 'components/Pages/User/Fragments/AvatarUser';
import HeaderPage from '../Fragments/HeaderPage';

import { AuthModel } from 'models/page.models';

import styled from 'styled-components';

type Props = { auth: AuthModel };

const SettingProfile = (props: Props) => {
  const dispatch = useDispatch();

  const { user } = props.auth;
  const { langLabel, t } = useLanguage();

  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(user.image);
  const [isValueChange, setIsValueChange] = useState<boolean>(false);

  useEffect(() => {
    setAvatar(user.image);
    form.setFieldsValue(user);
  }, [form, user]);

  const onSelectImage: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file) {
      const base64 = await getBase64(info.file);
      const isImage = await isBase64Image(base64);
      if (isImage && base64) {
        setAvatar(base64);
        setIsValueChange(true);
      } else message.error(t('message_cant_read_files'));
    }
  };

  const onUpdateProfile = async (values: any) => {
    try {
      setIsLoading(true);

      let body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v || null]));
      if (avatar !== user.image) {
        body['image'] = avatar;
        body['oldImage'] = user.image;
      }

      const { data } = await userServices.updateProfile(body);

      message.success(langLabel.my_profile_update_success);
      dispatch(SaveAuthRedux({ ...props.auth, user: { ...props.auth?.user, ...data } }));
      setIsValueChange(false);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderPage title={langLabel.my_profile_setting_title} />

      <SettingProfileContent>
        <ConfigProvider theme={{ token: { controlHeight: 40 } }}>
          <Form
            layout='vertical'
            form={form}
            onFinish={onUpdateProfile}
            onFieldsChange={() => setIsValueChange(true)}>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item label={langLabel.my_profile_setting_form_avatar}>
                  <AvatarUser avatar={avatar} onSelect={onSelectImage} isUpload={!isLoading} />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <Form.Item label={langLabel.register_username}>
                  <Input value={user?.nickname} disabled />
                </Form.Item>

                <Form.Item
                  label={langLabel.register_fullName}
                  name='name'
                  initialValue={user?.name}
                  rules={[
                    {
                      required: true,
                      message: langLabel.my_profile_setting_form_fullName_required,
                    },
                    {
                      whitespace: true,
                      message: langLabel.my_profile_setting_form_fullName_not_empty,
                    },
                    {
                      validator: async (_, value) => {
                        if (isOnlyEmoji(value)) throw new Error(t('form_validate_not_only_emoji'));
                      },
                    },
                  ]}>
                  <Input
                    autoComplete='off'
                    maxLength={30}
                    showCount={{
                      formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                    }}
                    disabled={isLoading}
                    onChange={(e) => (e.target.value = e.target.value.trim())}
                  />
                </Form.Item>

                <Form.Item
                  label={langLabel.my_profile_setting_form_position}
                  name='work'
                  initialValue={user?.work}
                  rules={[
                    {
                      whitespace: true,
                      message: langLabel.my_profile_setting_form_position_not_empty,
                    },
                  ]}>
                  <Input disabled={isLoading} />
                </Form.Item>

                <Form.Item
                  label='Website'
                  name='website'
                  initialValue={user?.website}
                  rules={[
                    {
                      pattern: regex.url,
                      message: langLabel.my_profile_setting_form_link_required,
                    },
                  ]}>
                  <Input disabled={isLoading} />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <Form.Item
                  label={langLabel.my_profile_setting_form_location}
                  name='location'
                  initialValue={user?.location}
                  rules={[
                    {
                      whitespace: true,
                      message: langLabel.my_profile_setting_form_location_not_empty,
                    },
                  ]}>
                  <Input disabled={isLoading} />
                </Form.Item>

                <Form.Item
                  label={langLabel.my_profile_setting_form_a_few_sentences}
                  name='introduce'
                  initialValue={user?.introduce}
                  rules={[
                    {
                      whitespace: true,
                      message: langLabel.my_profile_setting_form_a_few_sentences_not_empty,
                    },
                  ]}>
                  <Input.TextArea style={{ height: 228 }} disabled={isLoading} />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <SettingProfileFormItem>
                  <Form.Item
                    label={langLabel.my_profile_setting_form_software}
                    name='softwares'
                    initialValue={user?.softwares}>
                    <Checkbox.Group className='SettingProfile__ListTags'>
                      {User3DSoftware.map((tag) => {
                        return (
                          <Checkbox
                            key={tag.id}
                            value={tag.id}
                            className='SettingProfile__TagItem'
                            disabled={isLoading}>
                            {tag.title}
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>
                  </Form.Item>
                </SettingProfileFormItem>
              </Col>

              <Col span={24} xl={12}>
                <SettingProfileFormItem>
                  <Form.Item
                    label={langLabel.my_profile_setting_form_skill}
                    name='skills'
                    initialValue={user?.skills}>
                    <Checkbox.Group className='SettingProfile__ListTags'>
                      {UserSkill.map((tag) => {
                        return (
                          <Checkbox
                            key={tag.id}
                            value={tag.id}
                            className='SettingProfile__TagItem'
                            disabled={isLoading}>
                            {tag.title}
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>
                  </Form.Item>
                </SettingProfileFormItem>
              </Col>
            </Row>

            <div className='text-center'>
              <Button
                type='primary'
                htmlType='submit'
                disabled={!isValueChange}
                className='Btn__Submit'
                loading={isLoading}>
                {langLabel.btn_save || 'Save'}
              </Button>
            </div>
          </Form>
        </ConfigProvider>
      </SettingProfileContent>
    </>
  );
};

export default SettingProfile;

const SettingProfileContent = styled.div`
  margin-top: 27px;
`;
const SettingProfileFormItem = styled.div`
  label {
    font-size: 18px;
    font-weight: 500;
    color: var(--text-title);
  }
  .SettingProfile__ListTags {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    margin-top: 15px;

    .SettingProfile__TagItem {
      padding: 10px;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.358;
      color: var(--text-caption);
      border: solid 1px var(--color-gray-5);
      border-radius: var(--border-radius-base);
      background-color: var(--color-gray-3);
      user-select: none;

      &.ant-checkbox-wrapper-checked {
        background-color: var(--color-gray-5);
      }
      & + .SettingProfile__TagItem {
        margin-left: 0;
      }
      .ant-checkbox {
        display: none;
      }
      span {
        padding: 0;
      }
    }
  }
`;
