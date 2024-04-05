import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const authServices = {
  login: async (body: { username: string; password: string }) => {
    const resp = await apiHandler.create(apiConstant.login, body);
    return resp.data;
  },

  oAuth: async (body: { sns: string; access_token: string }) => {
    const resp = await apiHandler.create(apiConstant.oAuth, body);
    return resp.data;
  },

  logout: async () => {
    const resp = await apiHandler.create(apiConstant.logout, null);
    return resp.data;
  },

  me: async (body: { token: string; refresh_token: string }) => {
    const resp = await apiHandler.create(apiConstant.me, body);
    return resp.data;
  },
};

export default authServices;
