import { CategoryModel } from './category.models';
import { FormatFiles } from './formatFiles.models';
import { LicenseModel } from './license.models';
import { BrandModel } from './showroom.models';
import { UserModel } from './user.models';

export enum ProductStatus {
  ACTIVE = 1,
  APPROVAL = 2,
  INACTIVE = 3,
  CANCELLED = 4,
  DRAFT = 5,
  DELETE_TEMPORARY = 6,
  HIDE = 7,
}

export type ProductModel = {
  id: string;
  title: string;
  image: string;
  market_item_galleries: { id: string; image: string }[];
  old_price?: number;
  price: number;
  demo: string;
  demo_usdz?: string;
  model: string;
  viewer_bg?: string;
  config_3d_viewer?: Record<string, string | number>;
  tags?: string;
  status: ProductStatus;

  cat_id: string;
  market_category?: CategoryModel;
  market_item_categories?: { market_category: CategoryModel }[];
  market_item_category_showrooms?: { market_category: CategoryModel }[];

  license_id?: string;
  market_license?: LicenseModel;

  viewed_count: number;
  totalComment?: number;
  totalReview: number;
  avgReview?: number;

  like_count: number;
  market_likes?: { user_id: string }[];

  author_id: null | string;
  market_user: UserModel;
  is_temporary?: true;

  file_details?: FormatFiles[];
  files: { [key: string]: string };

  unit: 1 | 2 | 3;
  dimensions: string;
  materials: string;
  is_animated: boolean;
  color: string;
  is_uv: boolean;
  is_pbr: boolean;
  is_rigged: boolean;
  description: string;
  geometry: {
    quads: string;
    triangles: string;
    total_triangles: string;
  } | null;
  textures: string;
  vertices: string;
  quads: string;
  total_triangles: string;

  is_bought: boolean;
  is_cart: boolean;

  seo_title?: string;
  seo_description?: string;

  createdAt: string;
  publish_date?: string;

  market_items_boughts_aggregate?: { aggregate: { count: number } };
  market_reviews_aggregate: { aggregate: { count: number; avg: { rate: number } } };
  summary_review: { aggregate: { avg: { rate?: number }; count: number } };
  summary_comment: { aggregate: { count: number } };
  summary_sold: { aggregate: { sum: { price: number } } };

  market_brand?: BrandModel;
  link?: string;
  sell_price?: number;
  item_no?: string;
};
