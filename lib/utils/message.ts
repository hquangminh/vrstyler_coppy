import { JointContent } from 'antd/es/message/interface';

export const MESSAGE_EVENT_NAME = 'vrstyle_message';
export enum MESSAGE_TYPES {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  LOADING = 'loading',
  DESTROY = 'destroy',
}

const dispatch = (type: MESSAGE_TYPES, params: JointContent) => {
  window.dispatchEvent(new CustomEvent(MESSAGE_EVENT_NAME, { detail: { params, type } }));
};
const dispatchDestroy = (type: MESSAGE_TYPES, key?: React.Key) => {
  window.dispatchEvent(new CustomEvent(MESSAGE_EVENT_NAME, { detail: { type, key } }));
};

export const message = {
  success(params: JointContent) {
    dispatch(MESSAGE_TYPES.SUCCESS, params);
  },
  error(params: JointContent) {
    dispatch(MESSAGE_TYPES.ERROR, params);
  },
  info(params: JointContent) {
    dispatch(MESSAGE_TYPES.INFO, params);
  },
  warning(params: JointContent) {
    dispatch(MESSAGE_TYPES.WARNING, params);
  },
  loading(params: JointContent) {
    dispatch(MESSAGE_TYPES.LOADING, params);
  },
  destroy(key?: React.Key) {
    dispatchDestroy(MESSAGE_TYPES.DESTROY, key);
  },
};
