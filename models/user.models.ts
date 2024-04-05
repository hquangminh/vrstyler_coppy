import { AuthModel } from './page.models';

export enum UserType {
  CUSTOMER = 1,
  SELLER = 2,
  SHOWROOM = 3,
  VRSTYLER = 4,
}

export enum RegisterType {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

//Data
export type UserModel = {
  id: string;
  nickname: string;
  email: string;
  name: string;
  image: string;
  work?: string;
  website?: string;
  location?: string;
  introduce?: string;
  softwares?: string[];
  skills?: string[];
  position?: string;
  email_subscription: boolean;
  status: boolean;
  is_vrstyler?: boolean;
  type: UserType;
  regtype: RegisterType;
  market_users_change_emails: UserChangeEmailModel[];
  market_seller_wallet: {
    available: number;
  };
  market_showroom?: {
    logo_dashboard?: string;
    is_vip: boolean;
    card: string;
    banner?: string;
  };
  market_items_aggregate: {
    aggregate: {
      count: number;
      sum?: { viewed_count: number | null; bought_count: number | null };
    };
  };
  marketReviewsByAuthorId_aggregate?: { aggregate: { avg: { rate: number | null } } };
  marketItemsBoughtsByAuthorId_aggregate?: { aggregate: { count: number | null } };
  createdAt: string;
};

export type UserChangeEmailModel = {
  email: string;
};

//Page
export enum UserPageTabName {
  MY_ORDERS = 'my-orders',
  MODELS = 'models',
  COINS = 'coins',
  SETTINGS = 'settings',
  LIKES = 'likes',
}
export enum UserPageOrderSubPage {
  DETAIL = 'detail',
}
export enum UserPageTabOrder {
  ALL = 'all',
}
export enum UserPageTabSetting {
  PROFILE = 'profile',
  EMAIL = 'email',
  CHANGE_PASSWORD = 'change-password',
  NOTIFICATION = 'notification',
  CARD_VIP = 'card-vip',
  BANNER = 'banner',
  PRODUCT_SHOWROOM = 'product-showroom',
}
export enum UserPageTabModels {
  ALL = 'all',
  DOWNLOADED = 'downloaded',
  NOT_DOWNLOADED = 'not-downloaded',
}
export enum UserPageTabCoins {
  ALL = 'all',
  RECEIVED = 'received',
  USED = 'used',
}

export type UserPageOptionFilterModel =
  | 'recently'
  | 'oldest'
  | 'lastweek'
  | 'lastmonth'
  | 'az'
  | 'za';

export type UserPageOrderProps = {
  userID?: string;
  tabName: UserPageTabOrder | null;
};

export type UserPageSettingProps = {
  tabName: UserPageTabSetting | null;
  auth?: AuthModel;
};

export type UserPageMyModelsProps = {
  userID?: string;
  tabName: UserPageTabModels | null;
};

export type UserPageCoinsProps = {
  tabName: UserPageTabCoins | null;
};

export type UserPageLikesProps = {
  auth: AuthModel;
};
