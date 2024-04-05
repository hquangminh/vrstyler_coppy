import { SortableHandle } from 'react-sortable-hoc';
import { Button, ConfigProvider, Modal } from 'antd';
import { WarningFilled } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  top: -2px;
  right: 0;
  padding-left: 2px;
  transform: translateX(100%);

  opacity: 0;
  visibility: hidden;
  .ant-btn {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 0;
    padding: 0;
    &.btn-delete {
      color: #fff;
      background-color: #ba3d4f;
    }
    &.btn-sort {
      color: #434343;
      background-color: #61ff84;
      margin-bottom: 8px;
    }
    .anticon {
      font-size: 24px;
    }
  }
`;

type Props = { onDelete: () => void };

export default function DecorationSectionAction({ onDelete }: Props) {
  const { langLabel, t } = useLanguage();
  const [modal, contextHolder] = Modal.useModal();

  const onConfirmDelete = () => {
    const modalConfirm = modal.confirm({
      icon: <WarningFilled />,
      title: langLabel.dashboard_theme_decoration_delete_confirm_title,
      content: langLabel.dashboard_theme_decoration_delete_confirm_description,
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ okText: t('deleting'), cancelButtonProps: { disabled: true } }),
          onDelete(),
        ]),
      autoFocusButton: null,
    });
  };

  return (
    <>
      <Wrapper className='decoration-section-actions' onClick={(e) => e.stopPropagation()}>
        <DragHandle>
          <Button className='btn-sort' style={{ pointerEvents: 'none' }}>
            <Icon iconName='move-showroom' />
          </Button>
        </DragHandle>
        <Button className='btn-delete' onClick={onConfirmDelete}>
          <Icon iconName='btn-trash-delete' />
        </Button>
      </Wrapper>

      <ConfigProvider theme={{ token: { colorWarning: '#ff4d4f' } }}>
        {contextHolder}
      </ConfigProvider>
    </>
  );
}

const DragHandle = SortableHandle('btn-sort');
