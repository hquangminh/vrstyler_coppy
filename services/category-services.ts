import { AxiosRequestConfig } from 'axios';
import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const categoryServices = {
  /**
   * Category
   **/

  getAllCategory: async (config?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(apiConstant.category, config);

    return resp.data;
  },
};

export default categoryServices;
