import { message } from 'antd';
import Upload, { RcFile } from 'antd/lib/upload';

import getBase64 from 'functions/getBase64';
import isBase64Image from 'functions/isBase64Image';

export const onBeforeUpload = async (
  file: RcFile,
  fieldName: string,
  langLabel: Record<string, string>,
  // eslint-disable-next-line no-unused-vars
  callBack?: (imageBase64: string, file: RcFile) => void
) => {
  const fileName = file?.name,
    fileFormat = fileName?.split('.')?.slice(-1)[0].toLowerCase(),
    fileSize = file?.size;

  // Check Image
  if (fieldName === 'image') {
    const isCheckFormat = ['png', 'jpg', 'jpeg', 'webp'].includes(fileFormat);
    const isCheckSize = fileSize > 1024 * 1024 * 2;

    if (!isCheckFormat || isCheckSize) {
      message.error({
        key: 'valid__img',
        content: langLabel.message_validate_image_file
          .replace('{{file_extension}}', 'JPG, JPEG, PNG, WEBP')
          .replace('{{limit_size}}', '2MB'),
      });

      return Upload.LIST_IGNORE;
    }

    let base64 = await getBase64(file);
    const isImage = await isBase64Image(base64);

    if (!isImage) {
      message.error({ key: 'can-not-read-file', content: langLabel.message_cant_read_files });
      return Upload.LIST_IGNORE;
    }

    if (callBack) callBack(base64, file);
  }

  return false;
};
