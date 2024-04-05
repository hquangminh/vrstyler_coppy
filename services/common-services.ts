import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const commonServices = {
  seoPage: async (page: string, language_code: string = 'en') => {
    const resp = await apiHandler.get(apiConstant.seo + '/' + page + '/' + language_code);
    return resp.data;
  },

  webSettings: async () => {
    const resp = await apiHandler.get(apiConstant.settings);
    return resp.data;
  },

  languages: async () => {
    const resp = await apiHandler.get(apiConstant.languages, { params: { status: true } });
    return resp.data;
  },
};

export default commonServices;
