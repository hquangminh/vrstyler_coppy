import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification/interface';
import { CSSProperties } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const showNotification = (type: NotificationType, option: ArgsProps) => {
  const style: CSSProperties = { maxWidth: 600 };
  return notification[type]({ ...option, duration: 2.5, placement: 'top', style });
};

export default showNotification;
