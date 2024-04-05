import { Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { CameraFilled } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { avtDefault } from 'common/constant';

import MyImage from 'components/Fragments/Image';

import styled from 'styled-components';

type Props = {
  avatar?: string;
  isUpload?: boolean;
  onSelect?: (info: UploadChangeParam<UploadFile>) => void;
};

const AvatarUser = (props: Props) => {
  const { isUpload = true } = props;
  const { t } = useLanguage();

  const onBeforeUpload = (file: RcFile) => {
    const ruleType = ['jpg', 'webp', 'png', 'jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const fileSize = file.size / 1024 / 1024;

    const isAccept =
      fileSize > 0 && fileSize <= 2 && ruleType.some((ext) => ext.toLowerCase() === fileExtension);

    if (!isAccept) {
      message.error(
        t('message_validate_image_file')
          .replace('{{file_extension}}', ruleType.join(', ').toUpperCase())
          .replace('{{limit_size}}', '2MB')
      );
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <AvatarUserWrapper className='user_avatar'>
      <MyImage
        className='avatar'
        src={props.avatar ?? ''}
        img_error={avtDefault}
        alt=''
        width={110}
        height={110}
      />
      {isUpload && (
        <Upload
          maxCount={1}
          showUploadList={false}
          accept='.png, .jpeg, .jpg, .webp'
          beforeUpload={(file) => onBeforeUpload(file)}
          onChange={(info) => {
            if (props.onSelect) props.onSelect(info);
          }}>
          <CameraFilled />
        </Upload>
      )}
    </AvatarUserWrapper>
  );
};

export default AvatarUser;

const AvatarUserWrapper = styled.div`
  position: relative;
  display: inline-block;

  .avatar {
    border: solid 1.5px #edf6f8;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
  }
  .anticon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 27px;
    height: 27px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: var(--color-white);
    background-color: var(--color-primary-700);
    border-radius: 50%;

    cursor: pointer;
  }
`;
