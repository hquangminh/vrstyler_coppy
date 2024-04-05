import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { AxiosRequestConfig } from 'axios';

export type BodySearchArticle = {
  category?: string;
  title?: string;
};

const helpCenterServices = {
  getList: async () => {
    const resp = await apiHandler.get(apiConstant.helpCenter);
    return resp.data;
  },
  getDetail: async (id: string, body?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.helpCenter + '/' + id, body);
    return resp.data;
  },
  searchArticle: async (params?: BodySearchArticle) => {
    const resp = await apiHandler.get(apiConstant.helpCenter + '/category', { params });
    return resp.data;
  },
  getCollection: async () => {
    const resp = await apiHandler.get(apiConstant.helpCollection);
    return resp.data;
  },
  getCollectionDetail: async (collectionId: string, body?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.helpCollection + '/' + collectionId, body);
    return resp.data;
  },
  getCollectionsRelated: async (id: string, categoryId: string, limit: number) => {
    const resp = await apiHandler.get(
      apiConstant.helpCenter + `/related/${id}/${categoryId}/${limit}`
    );
    return resp.data;
  },
};

export default helpCenterServices;
