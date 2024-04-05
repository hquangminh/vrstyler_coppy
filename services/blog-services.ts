import { AxiosRequestConfig } from 'axios';

import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

export type GetBlogBody = { category?: string; title?: string; language_code?: string };

const blogServices = {
  getAllCategoryBlog: async (body?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.categoryBlog, body);
    return resp.data;
  },
  getList: async (params?: GetBlogBody, configs?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.blog, { ...configs, params });
    return resp.data;
  },
  getDetail: async (langCode: string, id: string, body?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.blogDetail + '/' + langCode + '/' + id, body);
    return resp.data;
  },
  getArticleRelate: async (id: string, category: string, length: number, langCode: string) => {
    const resp = await apiHandler.get(
      apiConstant.blogDetail + '/related/' + langCode + '/' + id + '/' + category + '/' + length
    );
    return resp.data;
  },
};

export default blogServices;
