import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const licenseServices = {
  download: async (productId: string, token?: string) => {
    const config = { headers: { Authorization: token ? `Bearer ${token}` : '' } };
    const resp = await apiHandler.get(`${apiConstant.downloadLicense}/${productId}`, config);
    return resp.data;
  },

  getList: async (isFree?: boolean) => {
    const params = typeof isFree === 'boolean' ? { params: { is_free: isFree } } : undefined;
    const resp = await apiHandler.get(apiConstant.license + '/list', { params });
    return resp.data;
  },
};

export default licenseServices;
