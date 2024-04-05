import { CategoryModel } from 'models/category.models';
import { CouponModel, ProductCartModel } from 'models/checkout.models';
import { AuthModel, LanguageType } from 'models/page.models';
import { BannerModel } from 'models/banner.models';

export type CartReduxModel = {
  products?: ProductCartModel[];
  coupon?: CouponModel;
};

export type WebsiteSettingsModel = {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
  behance?: string;
  pinterest?: string;
  artstation?: string;
};

export type TypeOrderActionModel = 'cancel' | 'cancel-success' | null;
export type DataOrderActionModel = { id: string; order_no?: string; payment_note?: string };
export type OrderActionModel = {
  type?: TypeOrderActionModel;
  order?: DataOrderActionModel;
};

export type AppStateWeb = {
  setting?: WebsiteSettingsModel;
  languages?: LanguageType[];
  langLabel?: Record<string, string>;
  langCode?: string;
  categories?: CategoryModel[];
  notificationBar?: boolean;
  movingPage?: boolean;
  notificationTotal?: number;
  banner?: BannerModel;
  share?: { link: string };
};

export type AppStateModal = {
  search: boolean;
  menuMobile: boolean;
  menuAvatar: boolean;
  cartPreview: boolean;
  share?: { open: boolean; link: string };
  sellerRegister: boolean;
  isCloseBanner: boolean;
};

export type AppState = {
  web: AppStateWeb;
  modal: AppStateModal;
  auth?: AuthModel;
  cart: CartReduxModel;
  order?: OrderActionModel;
};
