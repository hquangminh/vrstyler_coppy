import Router from 'next/router';
import { AxiosError, AxiosResponse } from 'axios';
import { message } from 'lib/utils/message';

import i18nEnglish from 'i18n/language/English.json';
import i18nJapanese from 'i18n/language/Japanese.json';
import i18nKorean from 'i18n/language/Korean.json';
import i18nVietnamese from 'i18n/language/Vietnamese.json';

const handleAxiosError = (error: AxiosError) => {
  if (typeof window !== 'undefined') {
    const response: AxiosResponse<any, any> | undefined = error.response;
    const langLabel: Record<string, string> = getLangLabel(Router.locale);

    if (response) {
      const errorCode = response.data.error_code;
      if (response?.status === 401 && Router.pathname !== '/login') {
        const content = langLabel[errorCode] ?? langLabel.TOKEN_NOT_CORRECT;
        message.error({ key: 'token-expired', content });
        Router.push({ pathname: '/login', query: { redirect: Router.asPath } });
      } else if (error.code === 'ERR_NETWORK' && error.name === 'AxiosError') {
        message.error({ key: 'network-error', content: langLabel.DISCONNECT_INTERNET });
      } else {
        const content = langLabel[errorCode] ?? response.data.message ?? error.message;
        message.error({ key: errorCode || 'api-failed', content });
      }
    }
  }

  return Promise.reject(error);
};

export default handleAxiosError;

const getLangLabel = (langCode?: string) => {
  switch (langCode) {
    case 'kr':
      return i18nKorean;
    case 'jp':
      return i18nJapanese;
    case 'vn':
      return i18nVietnamese;
    default:
      return i18nEnglish;
  }
};
