import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const saleServices = {
  getFlashDeal: async () => {
    const resp = await apiHandler.get(apiConstant.flashDeal);
    return resp.data;
  },
};

export default saleServices;
