import axios from 'axios';
import Cookies, { CookieSetOptions } from 'universal-cookie';

import authServices from 'services/auth-services';

import { AuthModel } from 'models/page.models';
import LanguageSupport from 'i18n/LanguageSupport';

const cookies = new Cookies();

export const setToken = async (token: string, refresh_token: string) => {
  const options: CookieSetOptions = {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  cookies.set('token', token, options);
  cookies.set('refresh_token', refresh_token, options);
};

export const removeToken = async () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('refresh_token', { path: '/' });
  delete axios.defaults.headers.common['Authorization'];
};

export const checkAuth = async (cookie: string) => {
  let auth: AuthModel | null = null;

  const getToken =
    cookie && typeof cookie === 'string'
      ? cookie.split(';').find((c: string) => c.trim().startsWith('token='))
      : '';
  const token = getToken?.length ? getToken.split('=')[1] : null;
  const getRefresh_token =
    cookie && typeof cookie === 'string'
      ? cookie.split(';').find((c: string) => c.trim().startsWith('refresh_token='))
      : '';
  const refresh_token = getRefresh_token?.length ? getRefresh_token.split('=')[1] : null;

  try {
    if (token && refresh_token) {
      const { error, data } = await authServices.me({ token, refresh_token });

      if (!error) {
        auth = { token: token, user: data };
        cookies.set('token', data.token, { path: '/' });
      } else removeToken();
    }
  } catch (error) {
    removeToken();
  }

  return auth;
};

export const onLogout = async () => {
  try {
    authServices.logout();
    removeToken();
    let pathname: string = location.pathname;
    let langCode: string | undefined = pathname.split('/')[1];

    if (LanguageSupport.some((i) => i === langCode)) pathname = pathname.slice(2);

    const delay = navigator.userAgent.indexOf('Firefox') != -1 ? 1000 : 0;
    setTimeout(() => {
      if (pathname === '/' || !pathname) location.reload();
      else location.href = langCode ? '/' + langCode : '' + '/';
    }, delay);
  } catch (error: any) {
    removeToken();
    location.reload();
  }
};
