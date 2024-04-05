import dayjs from 'dayjs';
import { AxiosRequestConfig } from 'axios';

import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

import { BodyOrder, ParamWithdraw } from 'models/seller.model';

const sellerServices = {
  getProfile: async (nickname: string) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/nickname/${nickname}`);

    return resp.data;
  },

  // Product
  getProduct: async (id: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/${id}/${limit}/${offset}`);

    return resp.data;
  },

  productDetail: async (id: string, token?: string) => {
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` } };
    const resp = await apiHandler.get(
      `${apiConstant.seller}/item/${id}`,
      token ? config : undefined
    );
    return resp.data;
  },

  getAllOrder: async (limit: number, offset: number, params?: BodyOrder | {}) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/order/${limit}/${offset}`, {
      params,
    });

    return resp.data;
  },

  getOrderDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/order/${id}`);

    return resp.data;
  },

  getLatestReview: async (limit: number) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/latest-review/${limit}`);

    return resp.data;
  },

  getMyModes: async (limit: number, offset: number, params?: any) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/${limit}/${offset}`, { params });

    return resp.data;
  },

  searchMyModes: async (limit: number, offset: number, params?: any) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/items-review/${limit}/${offset}`, {
      params,
    });

    return resp.data;
  },

  getTotalAmount: async () => {
    const resp = await apiHandler.get(`${apiConstant.seller}/total-amount`);

    return resp.data;
  },

  getWithdraw: async (limit: number, offset: number, params?: any) => {
    const resp = await apiHandler.get(`${apiConstant.withdraw}/${limit}/${offset}`, { params });

    return resp.data;
  },

  getWithdrawDetail: async (id: string) => {
    const resp = await apiHandler.get(`${apiConstant.withdraw}/${id}`);

    return resp.data;
  },

  getMinWithdraw: async () => {
    const resp = await apiHandler.get(`${apiConstant.withdraw}/min-withdraw`);

    return resp.data;
  },

  createWithdraw: async (body: ParamWithdraw) => {
    const resp = await apiHandler.create(apiConstant.withdraw, body);

    return resp.data;
  },

  getReviews: async (limit: number, offset: number, params?: any) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/reviews/${limit}/${offset}`, {
      params,
    });

    return resp.data;
  },
  deleteProduct: async (productId: string) => {
    const resp = await apiHandler.delete(apiConstant.products + '/' + productId);
    return resp.data;
  },

  getStatistical: async (params?: any) => {
    const resp = await apiHandler.get(`${apiConstant.seller}/statistical`, {
      params: { ...params, request_date: dayjs().format() },
    });

    return resp.data;
  },
};

export default sellerServices;
