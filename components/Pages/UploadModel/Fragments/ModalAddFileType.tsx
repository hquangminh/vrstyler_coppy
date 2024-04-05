import { useEffect, useState } from 'react';

import { Button, Checkbox, Modal, ModalProps } from 'antd';

import { FilesType } from 'constants/upload-model.constant';

import { FormFile3D } from 'models/upload-model.models';

import styled from 'styled-components';

type Props = {
  /* eslint-disable no-unused-vars */
  visible: boolean;
  filesType: FormFile3D[];
  filesNotChange?: string[];
  onCancel: () => void;
  onOk: (value: string[]) => void;
};

const ModalAddFileType = (props: Props) => {
  const { visible, filesType, filesNotChange: filesHide, onCancel, onOk } = props;

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(filesType.map((i) => i.key));
  }, [filesType]);

  const modalProps: ModalProps = {
    open: visible,
    title: 'Add type file',
    destroyOnClose: true,
    centered: true,
    width: 572,
    style: { borderRadius: 11, overflow: 'hidden' },
    footer: (_, { OkBtn }) => <OkBtn />,
    okText: 'Add',
    onOk: () => onOk(selected),
    onCancel,
  };

  return (
    <Modal {...modalProps}>
      <Wrapper>
        <Checkbox.Group
          defaultValue={filesType.map((i) => i.key)}
          onChange={(value) => setSelected(value.map((i) => i.toString()))}>
          {FilesType.map((file) => {
            return (
              <Checkbox key={file.key} value={file.key} disabled={filesHide?.includes(file.key)}>
                {file.title}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </Wrapper>
    </Modal>
  );
};
export default ModalAddFileType;

const Wrapper = styled.div`
  .ant-checkbox-group {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px 10px;
    .ant-checkbox-wrapper {
      & + .ant-checkbox-wrapper {
        margin-left: 0;
      }
    }
  }
`;
