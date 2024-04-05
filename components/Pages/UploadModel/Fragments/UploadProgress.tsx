import { useContext } from 'react';

import { Flex, List, Modal, ModalProps, Progress, Typography } from 'antd';

import isArrayEmpty from 'common/functions/isArrayEmpty';

import { UploadModelContext } from '../Provider';

const twoColors = { '0%': '#369ca5', '100%': '#87d068' };

const UploadModelProgress = () => {
  const fileUploading = useContext(UploadModelContext).fileUploading;

  const modalProps: ModalProps = {
    title: 'Model files are being uploaded',
    open: !isArrayEmpty(fileUploading),
    centered: true,
    footer: null,
    closable: false,
  };

  return (
    <Modal {...modalProps}>
      <List
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        dataSource={fileUploading}
        renderItem={(item) => (
          <List.Item style={{ flexDirection: 'column' }}>
            <Flex gap={4} style={{ width: '100%' }}>
              <Typography.Text type='secondary'>{item.type}: </Typography.Text>
              <Typography.Text>{item.name}</Typography.Text>
            </Flex>
            <Progress
              percent={item.percent}
              strokeColor={item.error ? undefined : twoColors}
              status={item.error ? 'exception' : undefined}
              style={{ marginInlineEnd: 0, paddingInlineEnd: 4 }}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default UploadModelProgress;
