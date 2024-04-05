import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { DEPLOY_ENV } = publicRuntimeConfig;

let configs: Record<string, string> = {};

switch (DEPLOY_ENV) {
  case 'prod':
    configs = {
      deployEnv: 'production',
      websiteName: 'VRStyler',
      domain: '.vrstyler.com',
      apiRoot: 'https://api.vrstyler.com',
      urlRoot: 'https://vrstyler.com',
      urlModelViewer: 'https://modelviewer.vrstyler.com',
      stripePublicKey: 'pk_live_26WxvKJCQk1JEgSX6SAGmG8O',
      paypalClientId:
        'AZGWaTPud66oIduiQKs1IGJg_dBDtKhUZJrKhXWDyjDcQa4PqAwUegJbbGRVV6dl6iZhAagrF7KWyYRG',
      googleClientId: '1082773571620-fcutq2fsm6krteolq8b8ktkjodpc5a8k.apps.googleusercontent.com',
      googleAnalyticsID: 'G-DQEWEVFE1T',
      facebookAppId: '577772940724693',
    };
    break;
  case 'dev':
    configs = {
      websiteName: 'VRStyler (DEV)',
      domain: '.tainguyenviet.com',
      apiRoot: 'https://market-api.tainguyenviet.com',
      urlRoot: 'https://vrstyler.tainguyenviet.com',
      urlModelViewer: 'https://modelviewer.tainguyenviet.com',
      stripePublicKey: 'pk_test_HJSCHlbzNt0bsS2oJiShWA2I',
      paypalClientId:
        'AQrE0Y9RVP1L2IF4LauVLgdBZlixbbdHG6MZEzPT5ohgAA1USMRWwNztGiBHNmLPuN9M9HBkveOr_T6M',
      googleClientId: '1082773571620-fcutq2fsm6krteolq8b8ktkjodpc5a8k.apps.googleusercontent.com',
      googleAnalyticsID: 'G-DQEWEVFE1T',
      facebookAppId: '577772940724693',
    };
    break;
  default:
    configs = {
      websiteName: 'VRStyler (DEV)',
      domain: 'localhost',
      apiRoot: 'https://market-api.tainguyenviet.com',
      urlRoot: 'http://localhost:3008',
      urlModelViewer: 'https://modelviewer.tainguyenviet.com',
      stripePublicKey: 'pk_test_HJSCHlbzNt0bsS2oJiShWA2I',
      paypalClientId:
        'AQrE0Y9RVP1L2IF4LauVLgdBZlixbbdHG6MZEzPT5ohgAA1USMRWwNztGiBHNmLPuN9M9HBkveOr_T6M',
      googleClientId: '1082773571620-fcutq2fsm6krteolq8b8ktkjodpc5a8k.apps.googleusercontent.com',
      googleAnalyticsID: 'G-DQEWEVFE1T',
      facebookAppId: '577772940724693',
    };
    break;
}

const config = Object.assign(configs);

export default config;
