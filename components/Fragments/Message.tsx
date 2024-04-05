import React, { useEffect } from 'react';

import { App } from 'antd';
import { JointContent, NoticeType } from 'antd/es/message/interface';
import { MESSAGE_EVENT_NAME, MESSAGE_TYPES } from 'lib/utils/message';

const Message = () => {
  const { message } = App.useApp();

  useEffect(() => {
    const bindEvent = (e: CustomEvent) => {
      const type: NoticeType | MESSAGE_TYPES = e?.detail?.type || 'info';
      const msgProps: JointContent = e?.detail?.params;

      if (type === MESSAGE_TYPES.DESTROY) {
        if (e?.detail?.key) message.destroy(e?.detail?.key);
        else message.destroy();
      } else if (msgProps) {
        if (typeof msgProps === 'string' || React.isValidElement(msgProps))
          message.open({ type, content: msgProps });
        else message.open({ type, ...e?.detail?.params });
      }
    };

    window.addEventListener(MESSAGE_EVENT_NAME, bindEvent as (e: Event) => void);

    return () => window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent as (e: Event) => void);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Message;
