import { AxiosRequestConfig } from 'axios';

import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { NotificationType } from 'models/notification.models';

export type GetNotificationProps = {
  limit: number;
  offset: number;
  params: { is_read: boolean | null; type?: NotificationType };
  configs?: AxiosRequestConfig;
};

const notificationServices = {
  getAllNotification: async ({ limit, offset, params, configs }: GetNotificationProps) => {
    const url = `${apiConstant.notification}/${limit}/${offset}`;
    const resp = await apiHandler.get(url, { ...configs, params });
    return resp.data;
  },
  markAllRead: async (body: any) => {
    const resp = await apiHandler.update(apiConstant.notification, body || null);
    return resp.data;
  },
  markRead: async (id: string) => {
    const resp = await apiHandler.update(`${apiConstant.notification}/${id}`, null);
    return resp.data;
  },
  deleteRead: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.notification}/${id}`);
    return resp.data;
  },
  deleteAllRead: async () => {
    const resp = await apiHandler.delete(apiConstant.notification + '/' + 'delete-all');
    return resp.data;
  },
  getCountNotificationUnread: async () => {
    const resp = await apiHandler.get(apiConstant.notification + '/' + 'count-noti-unread');
    return resp.data;
  },
};

export default notificationServices;
