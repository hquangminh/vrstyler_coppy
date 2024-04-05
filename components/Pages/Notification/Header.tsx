import useLanguage from 'hooks/useLanguage';

import { Button, Divider, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import notificationServices from 'services/notification-services';

import styled from 'styled-components';

type Props = {
  loading: boolean;
  onChangeToRead: () => void;
  onChangeToDelete: () => void;
};
const Header = (props: Props) => {
  const { langLabel } = useLanguage();

  const allReadData = async () => {
    try {
      const { error } = await notificationServices.markAllRead(null);
      if (!error) props.onChangeToRead();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReadData = async () => {
    try {
      const { error } = await notificationServices.deleteAllRead();
      if (!error) props.onChangeToDelete();
    } catch (error) {
      console.log(error);
    }
  };

  const menuNotification = [
    { key: '1', label: langLabel.notification_mark_all_read, onClick: allReadData },
    { key: 'divider', label: <Divider /> },
    { key: '2', label: langLabel.notification_delete_all, onClick: deleteReadData },
  ];

  return (
    <Wrapper>
      <h1> {langLabel.notification_title}</h1>
      <Dropdown
        disabled={props.loading}
        overlayClassName='notification-dropdown-action'
        getPopupContainer={(triggerNode) => triggerNode || document.body}
        trigger={['click']}
        menu={{ items: menuNotification }}
        placement='bottomRight'
        arrow={{ pointAtCenter: true }}>
        <Button shape='circle' type='text' onClick={(e) => e.stopPropagation()}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 17px 12px 16px 12px;
  h1 {
    font-size: 18px;
    font-weight: 500;
    color: #161723;
  }

  .ant-btn {
    padding: 0;
    min-width: unset;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: var(--color-gray-5);
    }
    .anticon {
      font-size: 24px;
      color: #b3b3b3;
    }
  }
`;
