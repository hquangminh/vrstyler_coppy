import { CategoryModel } from './category.models';

export type ExploreDataFilterModel = {
  category?: CategoryModel[];
};

export type ExploreFilterPanelProps = {
  exploreType: ExploreType;
  category: CategoryModel[];
};

export type FilterOptionsType = {
  key: string;
  title: string;
};

export type FilterDropdownType = {
  category: string;
  keyFilter: 'category' | 'formats' | 'license' | 'sort';
  options: FilterOptionsType[];
  exploreType: ExploreType;
};

export type FilterDropdownCheckType = {
  category: string;
  keyFilter: 'formats' | 'licenses';
  options: FilterOptionsType[];
  exploreType: ExploreType;
};

export type FilterCheckListType = {
  category: string;
  options: FilterOptionsType[];
  exploreType: ExploreType;
};

export type FilterCategoryMobileType = {
  category: 'category' | 'sort';
  options: FilterOptionsType[];
  exploreType: ExploreType;
  onClose: () => void;
};

export type ExploreType = 'explore' | 'sale-off' | 'free-models' | 'showroom';
