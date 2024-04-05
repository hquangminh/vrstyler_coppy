import { AppProps } from 'next/app';
import {
  UserModel,
  UserPageTabModels,
  UserPageTabName,
  UserPageTabOrder,
  UserPageTabSetting,
} from './user.models';

export type AuthModel = {
  token: string;
  user: UserModel;
};

export type SeoPage = { title: string; descriptions: string; keywords?: string; image: string };
export type LanguageType = {
  image: string;
  language_code: string;
  language_name: string;
  is_default: boolean;
};
export type Language = {
  languages: LanguageType[];
  langCode: string;
  langLabel?: Record<string, string>;
};

export type PageProps = {
  language?: Language;
  auth?: AuthModel | null;
  seo?: SeoPage;
};

export type UserPageProps = AppProps &
  PageProps & {
    username: string;
    isExistUser: boolean;
    page: UserPageTabName;
    pageSub: UserPageTabOrder & UserPageTabSetting & UserPageTabModels;
    orderId: string | null;
  };
