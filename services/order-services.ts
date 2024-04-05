import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

export type BodyGetOrder = {
  type: 'all' | '0' | '1' | '2' | '4' | '5' | '6';
  keySearch: string;
  offset: number;
  limit: number;
};

const orderServices = {
  getOrders: async ({ type, limit, offset, keySearch }: BodyGetOrder) => {
    const url = `${apiConstant.orders}/${type}/${limit}/${offset}`;
    const { data } = await apiHandler.get(url, { params: { keywords: keySearch } });
    return data;
  },

  getOrderDetail: async (orderId: string) => {
    const resp = await apiHandler.get(apiConstant.orders.slice(0, -1) + '/' + orderId);
    return resp.data;
  },

  cancelOrder: async (orderId: string, reason: string) => {
    const resp = await apiHandler.update(apiConstant.orderCancel + '/' + orderId, { reason });
    return resp.data;
  },
};

export default orderServices;
