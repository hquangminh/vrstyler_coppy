import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const bannerServices = {
  getBanner: async () => {
    const resp = await apiHandler.get(`${apiConstant.banner}/list`, { params: { status: true } });

    return resp.data;
  },
};

export default bannerServices;
