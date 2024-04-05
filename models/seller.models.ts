export type SellerCMSPageTabName =
  | 'dashboard'
  | 'general'
  | 'models'
  | 'orders'
  | 'sales'
  | 'withdraw'
  | 'reviews'
  | 'showroom-homepage'
  | 'showroom-card'
  | 'showroom-category'
  | 'setting';

import { CategoryModel } from './category.models';

export type MyProductDataFilterModel = {
  category?: CategoryModel[];
};

export type MyProductFilterPanelProps = {
  myProductType: MyProductType;
  category: CategoryModel[];
};

export type FilterOptionsType = {
  key: string;
  title: string;
};

export type FilterDropdownType = {
  category?: string;
  keyFilter: 'category' | 'formats' | 'license' | 'sort';
  options?: FilterOptionsType[];
  myProductType?: MyProductType;
};

export type FilterDropdownCheckType = {
  category?: string;
  keyFilter: 'formats' | 'licenses';
  options?: FilterOptionsType[];
  myProductType?: MyProductType;
};

export type FilterCheckListType = {
  category?: string;
  options?: FilterOptionsType[];
  myProductType?: MyProductType;
};

export type FilterCategoryMobileType = {
  category?: 'category' | 'sort';
  options?: FilterOptionsType[];
  myProductType?: MyProductType;
  onClose: () => void;
};

export type MyProductType = 'my-product' | 'sale-off' | 'free-models';
