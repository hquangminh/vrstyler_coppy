import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import type { AppProps } from 'next/app';

import TagManager from 'react-gtm-module';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { App, ConfigProvider } from 'antd';

import enUS from 'antd/locale/en_US';
import koKR from 'antd/locale/ko_KR';
import jaJP from 'antd/locale/ja_JP';
import viVN from 'antd/locale/vi_VN';

import config from 'config';
import store from 'store';
import ActionGlobal from 'lib/helpers/actionGlobal';

import Message from 'components/Fragments/Message';
import ShareWithSocial from 'components/Fragments/ShareWithSocial';

import GlobalStyle from 'styles/global';
import { themeDefault } from 'styles/theme';
import 'styles/lib/reset.min.css';
import 'styles/lib/bootstrap.min.css';

dayjs.extend(relativeTime);

function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState(enUS);

  useEffect(() => {
    if (config.deployEnv === 'production') {
      const tagManagerArgs = { gtmId: config.googleAnalyticsID };
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  const CheckLocale = useCallback(() => {
    switch (pageProps.language?.langCode) {
      case 'vn':
        setLocale(viVN);
        break;
      case 'kr':
        setLocale(koKR);
        break;
      case 'jp':
        setLocale(jaJP);
        break;
      default:
        setLocale(enUS);
        break;
    }
  }, [pageProps.language]);

  useEffect(() => {
    ActionGlobal();
    CheckLocale();
  }, [CheckLocale, pageProps]);

  return (
    <Provider store={store}>
      <ConfigProvider theme={themeDefault} locale={locale}>
        <App notification={{ placement: 'top' }}>
          <GlobalStyle />
          <Component {...pageProps} />
          <Message />
          <ShareWithSocial />
        </App>
      </ConfigProvider>
    </Provider>
  );
}

export default MyApp;
