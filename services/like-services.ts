import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const likeServices = {
  getLikes: async (limit: number, offset: number) => {
    const resp = await apiHandler.get(`${apiConstant.likes}/${limit}/${offset}`);
    return resp.data;
  },

  like: async (id: string) => {
    const resp = await apiHandler.create(`${apiConstant.users}/like/${id}`, null);

    return resp.data;
  },

  unLike: async (id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.users}/unlike/${id}`);

    return resp.data;
  },
};

export default likeServices;
