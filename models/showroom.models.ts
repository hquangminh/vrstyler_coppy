import { ProductModel } from './product.model';
import { UserModel } from './user.models';

export type ShowroomType = 'review' | 'view' | 'sold';
export type ShowroomPage = 'products' | 'view' | 'screen-shot';

export type ShowroomModel = {
  logo_dashboard: string | null;
  banner: string | null;
  card: null;
  is_vip: boolean;
  market_user: UserModel & {
    market_items: ProductModel[];
    marketItemsBoughtsByAuthorId_aggregate?: { aggregate?: { count: number } };
    products?: { aggregate?: { count: number } };
  };
};

export type ListShowroom = {
  topReview: ShowroomModel[];
  topSold: ShowroomModel[];
  topView: ShowroomModel[];
};

export type market_showroom_section_images = {
  id: string;
  image: string;
};

export type market_items_bought_aggregate = {
  aggregate: { count: number };
};

export type market_reviews_aggregate = {
  aggregate: { avg: { rate: number } };
};

export type UpdateShowroomBodyType = {
  name?: string;
  image?: string;
  logo_dashboard?: string;
  filenameImage?: string;
  filetypeImage?: string;
  oldImage?: string;
  filenameDashboard?: string;
  filetypeDashboard?: string;
  oldDashboard?: string;
  card?: string;
  filenameCard?: string;
  filetypeCard?: string;
  oldCard?: string;
  banner?: string;
  filenameBanner?: string;
  filetypeBanner?: string;
  oldBanner?: string;
};

export type ShowroomDetailType = {
  id: string;
  carousel_aspect: number;
  createdAt: Date | string;
  image: string;
  name: string;
  orderId: number;
  showroom_id: string;
  type: 1 | 2 | 3;
  updatedAt: string;
  market_showroom_section_images?: market_showroom_section_images[];
  market_showroom_section_products?: { market_item: ProductModel }[];
};

export type ShowroomStatisticalType = {
  market_items_bought_aggregate: market_items_bought_aggregate;
  market_users: (UserModel & { products: { aggregate: { count: number } } })[];
  nickName: string;
};

export type BrandModel = {
  id: string;
  contact: string;
  image: string;
  status: boolean;
  website: string;
  title: string;
};

// Decorations
export type ShowroomThemeModel = {
  id: string;
  name: string;
  status: boolean;
  screenshot?: string;
  market_showroom_sections_aggregate: { aggregate: { count: number } };
};
export type ShowroomDecorationModel = {
  id: string;
  type: number;
  image?: string;
  name?: string;
  status?: boolean;

  // Carousel
  carousel_aspect?: number;
  market_showroom_section_images?: market_showroom_section_images[];

  market_showroom_section_products?: { market_item: ProductModel }[];
};

export type ShowroomDecorationSection = {
  orderid: number;
  market_showroom_section: ShowroomDecorationModel;
};
