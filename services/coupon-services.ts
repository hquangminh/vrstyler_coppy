import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

const couponServices = {
  getCoupons: async () => {
    const resp = await apiHandler.get(apiConstant.coupon);
    return {
      status: resp.status,
      error: resp.data.error,
      message: resp.data.message,
      data: resp.data.data,
    };
  },
};

export default couponServices;
