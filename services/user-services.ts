import apiHandler from 'api/api-handler';
import apiConstant from 'api/api-constants';

export type ParamCreateUser = {
  username: string;
  email: string;
  password: string;
  name: string;
};

const userServices = {
  register: async (body: ParamCreateUser) => {
    const resp = await apiHandler.create(apiConstant.users + '/register', body);
    return resp.data;
  },

  confirmRegister: async (body: { token: string }) => {
    const resp = await apiHandler.create(apiConstant.users + '/register-confirmation', body);
    return resp.data;
  },

  sendMailVerify: async () => {
    const resp = await apiHandler.get(apiConstant.users + '/resend-confirmation');
    return resp.data;
  },

  getOTPChangeEmail: async (new_email: string) => {
    const resp = await apiHandler.create(apiConstant.users + '/change-email-otp', { new_email });
    return resp.data;
  },

  changeEmail: async (body: { new_email: string; otp?: string; is_facebook?: boolean }) => {
    const { is_facebook: isFacebook, ...payload } = body;
    const url =
      apiConstant.users + (isFacebook ? '/update-email-facebook' : '/change-email-request');
    const resp = await apiHandler.update(url, payload);
    return resp.data;
  },

  changeEmailAccountNotVerify: async (body: { new_email: string }) => {
    const resp = await apiHandler.update(apiConstant.users + '/change-email-unverified', body);
    return resp.data;
  },

  confirmChangeEmail: async (token: string) => {
    const resp = await apiHandler.update(apiConstant.users + '/change-email', { hash: token });
    return resp.data;
  },

  forgotPassword: async (body: { email: string }) => {
    const resp = await apiHandler.create(apiConstant.users + '/forgot-password', body);
    return resp.data;
  },

  checkTokenResetPw: async (email: string, token: string) => {
    const resp = await apiHandler.create(apiConstant.users + '/forgot-token-confirmation', {
      email,
      token,
    });
    return resp.data;
  },

  resetPassword: async (body: { email: string; password: string; token: string }) => {
    const resp = await apiHandler.create(apiConstant.users + '/reset-password', body);
    return resp.data;
  },

  changeAvatar: async (body: {
    oldImage?: string;
    image: string;
    filename: string;
    filetype: string;
  }) => {
    const resp = await apiHandler.update(apiConstant.users + '/update-profile', body);
    return resp.data;
  },

  updateProfile: async (body: {
    oldImage?: string;
    image?: string;
    filename?: string;
    filetype?: string;
    name?: string;
    work?: string;
    location?: string;
  }) => {
    const resp = await apiHandler.update(apiConstant.users + '/update-profile', body);
    return resp.data;
  },

  changePassword: async (body: { password: string; new_password: string }) => {
    const resp = await apiHandler.update(apiConstant.users + '/change-password', body);
    return resp.data;
  },

  updateNotification: async (body: { email_subscription: boolean }) => {
    const resp = await apiHandler.update(apiConstant.users + '/update-profile', body);
    return resp.data;
  },

  sellerRegister: async () => {
    const resp = await apiHandler.create(apiConstant.users + '/become-seller', null);
    return resp.data;
  },
};

export default userServices;
