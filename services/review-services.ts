import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

type BodyRate = {
  content: string;
  rate: number;
};

const reviewServices = {
  getReviews: async (productId: string, limit: number, offset: number) => {
    const resp = await apiHandler.get(
      `${apiConstant.reviews}/item/${productId}/${limit}/${offset}`
    );
    return resp.data;
  },

  getReviewDetail: async (reviewID: string) => {
    const resp = await apiHandler.get(apiConstant.reviewDetail.replace('{review_id}', reviewID));
    return resp.data;
  },

  addReview: async (productId: string, body: BodyRate) => {
    const resp = await apiHandler.create(`${apiConstant.reviews}/item/${productId}`, body);
    return resp.data;
  },

  replyReview: async (id: string, body: { content: string }) => {
    const resp = await apiHandler.create(`${apiConstant.reviews}/child/${id}`, body);

    return resp.data;
  },
};

export default reviewServices;
