import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const homepageServices = {
  getData: async (langCode: string = 'en') => {
    const resp = await apiHandler.get(apiConstant.homepage + '/' + langCode);
    return resp.data;
  },
  getFeatured: async () => {
    const resp = await apiHandler.get(apiConstant.featured, { headers: { Authorization: '' } });
    return resp.data;
  },
};

export default homepageServices;
