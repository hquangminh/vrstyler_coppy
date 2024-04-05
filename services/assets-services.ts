import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';
import { FormatFiles } from 'models/formatFiles.models';

export type BodyGetModel = {
  type: 'all' | 'downloaded' | 'not-downloaded';
  keywords: string;
  sort: 'recently' | 'oldest' | 'az' | 'za' | 'lastweek' | 'lastmonth';
  offset: number;
  limit: number;
};

const assetsServices = {
  getModel: async ({ limit, offset, ...params }: BodyGetModel) => {
    const url = apiConstant.assets
      .replace(':limit', limit.toString())
      .replace(':offset', offset.toString());
    const { data } = await apiHandler.get(url, { params });
    return data;
  },

  download: async (productId: string, fileType: FormatFiles) => {
    const resp = await apiHandler.get(`${apiConstant.downloadAsset}/${productId}/${fileType}`);
    return resp.data;
  },

  downloadFree: async (productId: string, fileType: FormatFiles) => {
    const resp = await apiHandler.get(`${apiConstant.downloadFree}/${productId}/${fileType}`);
    return resp.data;
  },
};

export default assetsServices;
