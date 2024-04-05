import { AxiosRequestConfig } from 'axios';
import apiConstant from 'api/api-constants';
import apiHandler from 'api/api-handler';
import { UpdateShowroomBodyType } from 'models/showroom.models';

export type BodyThemes = { status?: boolean; name?: string };

const showroomServices = {
  //Showroom
  listTopShowroom: async () => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/explore`);
    return resp.data;
  },
  filterShowroom: async (type: 1 | 2 | 3, limit: number, offset: number, name?: string) => {
    const resp = await apiHandler.get(
      `${apiConstant.showroom}/explore/more/${type}/${limit}/${offset}${
        name ? '?name=' + name : ''
      }`
    );
    return resp.data;
  },

  //
  getCategory: async (body?: AxiosRequestConfig) => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/category`, body);
    return resp.data;
  },

  createCategory: async (body: Record<string, string | number | boolean>) => {
    const resp = await apiHandler.create(`${apiConstant.showroom}/category`, body);
    return resp.data;
  },
  updateShowroom: async (body: UpdateShowroomBodyType) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/profile`, body);
    return resp.data;
  },

  // Get showroom statistical
  getShowroomStatistical: async (nickname: string) => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/statistical/${nickname}`);

    return resp.data;
  },

  // Get showroom by nickname
  getShowroomNickname: async (nickname: string) => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/dashboard/${nickname}`);

    return resp.data;
  },

  //Decoration
  getDecorationSection: async (themeID: string) => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/section/${themeID}`);
    return resp.data;
  },
  addDecorationSection: async (themeID: string, body: any) => {
    const resp = await apiHandler.create(`${apiConstant.showroom}/section/${themeID}`, body);
    return resp.data;
  },
  updateDecorationSection: async (themeID: string, id: string, body: any) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/section/${themeID}/${id}`, body);
    return resp.data;
  },
  deleteDecorationSection: async (themeID: string, id: string) => {
    const resp = await apiHandler.delete(`${apiConstant.showroom}/section/${themeID}/${id}`);
    return resp.data;
  },
  sortDecorationSection: async (themeId: string, body: any) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/section/sort/${themeId}`, {
      listOrderid: body,
    });
    return resp.data;
  },
  publicSection: async (themeId: string) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/section/public/${themeId}`, null);
    return resp.data;
  },

  // Preview
  getShowroomPreview: async (theme_id: string, token: string = '') => {
    const resp = await apiHandler.get(
      `${apiConstant.showroom}/section/preview/${theme_id}`,
      token ? { headers: { Authorization: 'Bearer ' + token } } : undefined
    );

    return resp.data;
  },

  // Get category by nickName
  getCategoryByNickName: async (nickname: string) => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/category/public`, {
      params: { nickname },
    });

    return resp.data;
  },

  //Product section
  getListShowroomSection: async (
    params: { limit: number; offset: number; name?: string },
    config?: AxiosRequestConfig
  ) => {
    const { limit, offset, name } = params;
    const resp = await apiHandler.get(
      `${apiConstant.showroom}/section/items/${limit}/${offset}?name=${name}`,
      config
    );

    return resp.data;
  },

  // Category showroom
  getAllCategory: async () => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/category`);

    return resp.data;
  },

  deleteCategory: async (ids: string[]) => {
    const resp = await apiHandler.delete(`${apiConstant.showroom}/category`, {
      params: {
        ids,
      },
    });
    return resp.data;
  },

  // Card Product Homepage
  getListShowroomHomepage: async () => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/product`);

    return resp.data;
  },

  addProductHomepage: async (body: any) => {
    const resp = await apiHandler.create(`${apiConstant.showroom}/product`, body);

    return resp.data;
  },

  // Themes
  getTheme: async () => {
    const resp = await apiHandler.get(`${apiConstant.showroom}/theme`);
    return resp.data;
  },
  addTheme: async (name: string) => {
    const resp = await apiHandler.create(`${apiConstant.showroom}/theme`, { name });
    return resp.data;
  },
  delTheme: async (themeID: string | '') => {
    const resp = await apiHandler.delete(`${apiConstant.showroom}/theme/${themeID}`);
    return resp.data;
  },
  updateTheme: async (themeID: string | '', body: BodyThemes) => {
    const resp = await apiHandler.update(`${apiConstant.showroom}/theme/${themeID}`, body);
    return resp.data;
  },
};

export default showroomServices;
