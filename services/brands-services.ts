import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

export type BodyBrands = { status?: boolean };
type ListBrandParameter = { limit: number; offset: number; params?: BodyBrands };

const brandsServices = {
  listBrands: async ({ limit, offset, params }: ListBrandParameter) => {
    const resp = await apiHandler.get(`${apiConstant.brands}/list/${limit}/${offset}`, { params });
    return resp.data;
  },
};

export default brandsServices;
