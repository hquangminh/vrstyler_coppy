import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { AxiosRequestConfig } from 'axios';

type FileFormat = 'FBX' | 'MAX' | 'BLEND' | 'STL' | 'GOZ' | 'SPP' | 'GLB' | 'USDZ' | 'GLTF' | 'OBJ';
export type BodyFilterProductModel = {
  title?: string;
  category?: string[];
  minPrice: number;
  maxPrice?: number;
  format?: FileFormat[];
  is_pbr?: boolean;
  is_animated?: boolean;
  is_rigged?: boolean;
  sort_by: 'createdAt' | 'viewed_count' | 'bought_count' | 'price';
  sort_type: 'asc' | 'desc';
  offset: number;
  limit: number;
};

const offsetParam = '{offset}',
  limitParam = '{limit}';

const productServices = {
  getProductPopular: async (offset: number, limit: number) => {
    const resp = await apiHandler.get(
      apiConstant.productPopular
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString())
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },

  getProductNewest: async (offset: number, limit: number) => {
    const resp = await apiHandler.get(
      apiConstant.productNewest
        .replace(offsetParam, offset.toString())
        .replace(limitParam, limit.toString())
    );
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },

  filterProducts: async (body: BodyFilterProductModel, configs?: AxiosRequestConfig) => {
    const resp = await apiHandler.create(apiConstant.productFilter, body, configs);
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
      total: resp.data.total,
    };
  },
  suggestProduct: async (limit: number) => {
    const resp = await apiHandler.get(apiConstant.suggestProduct + '/' + limit);
    return { ...resp.data };
  },

  getProductSale50: async (offset: number, limit: number) => {
    const resp = await apiHandler.get(apiConstant.productsSale50 + '/' + limit + '/' + offset);
    return { ...resp.data, status: resp.status };
  },

  getProductDetail: async (id: string, token?: string) => {
    const config: AxiosRequestConfig = {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    };
    const resp = await apiHandler.get(`${apiConstant.products}/${id}`, config);

    return resp.data;
  },

  getProductRelated: async (
    productID: string,
    category_ids: string[],
    limit: number,
    configs?: AxiosRequestConfig
  ) => {
    const resp = await apiHandler.get(`${apiConstant.productsRelated}/${productID}/${limit}`, {
      ...configs,
      params: { category_ids },
    });

    return resp.data;
  },

  addProduct: async (body: any) => {
    const resp = await apiHandler.create(apiConstant.products, body);
    return resp.data;
  },

  updateProduct: async (productId: string, body: any, config?: AxiosRequestConfig) => {
    const resp = await apiHandler.update(apiConstant.products + '/' + productId, body, config);

    return resp.data;
  },

  getLinkS3: async (
    body: { filename: string; kind: 'private' | 'public' },
    config?: AxiosRequestConfig
  ) => {
    const resp = await apiHandler.create(apiConstant.media + '/presigned', body, config);
    return resp.data;
  },
};

export default productServices;
