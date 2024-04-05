import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const commentServices = {
  getComments: async (productId: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(
      `${apiConstant.comments}/item/${productId}/${limit}/${offset}`
    );
    return resp.data;
  },

  getCommentsChild: async (commentId: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(`${apiConstant.comments}/${commentId}/${limit}/${offset}`);
    return resp.data;
  },

  addComments: async (productId: string, content: string) => {
    const resp = await apiHandler.create(`${apiConstant.comments}/item/${productId}`, { content });
    return resp.data;
  },

  addReplyComment: async (commentId: string, content: string) => {
    const resp = await apiHandler.create(`${apiConstant.comments}/child/${commentId}`, { content });
    return resp.data;
  },

  likeComment: async (commentId: string) => {
    const resp = await apiHandler.create(`${apiConstant.users}/comment/like/${commentId}`, {});
    return resp.data;
  },

  dislikeComment: async (commentId: string) => {
    const resp = await apiHandler.create(`${apiConstant.users}/comment/dislike/${commentId}`, {});
    return resp.data;
  },

  searchUser: async (keyword: string) => {
    const resp = await apiHandler.get(`${apiConstant.users}/search-users`, { params: { keyword } });
    return resp.data;
  },
};

export default commentServices;
