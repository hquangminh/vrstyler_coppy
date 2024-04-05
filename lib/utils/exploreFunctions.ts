import { NextRouter } from 'next/router';
import urlPage from 'constants/url.constant';
import { ExploreType } from 'models/explore.model';

export const onCheckedFilterCheckMulti = (
  routerNextJs: NextRouter,
  key: 'formats' | 'licenses',
  value: string,
  exploreType: ExploreType
) => {
  let query: any = { ...routerNextJs.query };
  let filter: string[] = [];
  const product_id = query.product_id?.toString() || '';

  if (product_id) {
    delete query['product_id'];
  }

  if (query[key])
    if (typeof query[key] === 'string') filter.push(query[key]);
    else if (typeof query[key] === 'object') filter = query[key];

  if (filter?.length > 0 && filter?.includes(value)) {
    const index = filter.findIndex((m: string) => m === value);
    filter?.splice(index, 1);
  } else filter.push(value);

  if (filter?.length === 0) delete query[key];
  else query[key] = filter;

  delete query['category'];
  delete query['page'];

  let hardPathname = '';
  if (exploreType === 'showroom') {
    hardPathname = urlPage.showroom_detail.replace(
      '{nickName}',
      routerNextJs.query.nickName as string
    );
  } else {
    hardPathname =
      exploreType === 'free-models'
        ? urlPage.freeModels
        : exploreType === 'sale-off'
        ? urlPage.saleOff
        : urlPage.explore;
  }

  const category = routerNextJs.query.category?.toString() || 'all';
  const pathname = hardPathname.replace('{category}', category);
  routerNextJs.push({ pathname, query }, undefined, { shallow: true });
};

export const onCheckedFilterCheckList = (
  routerNextJs: NextRouter,
  key: string,
  exploreType: ExploreType
) => {
  let query = { ...routerNextJs.query };

  if (key === 'free' && !query.free) {
    delete query.min;
    delete query.max;
  }

  if (query[key]) delete query[key];
  else query[key] = '1';
  delete query.category;

  const hardPathname =
    exploreType === 'free-models'
      ? urlPage.freeModels
      : exploreType === 'sale-off'
      ? urlPage.saleOff
      : urlPage.explore;
  const category = routerNextJs.query.category?.toString() || 'all';
  const pathname = hardPathname.replace('{category}', category);

  routerNextJs.push({ pathname: pathname, query }, undefined, { shallow: true });
};

export const getOptionsFilter = (routerNextJs: NextRouter | any, key: 'formats' | 'licenses') => {
  let selected: string = '';
  const value = routerNextJs.query[key];
  if (!value) return 'Any';
  else if (typeof routerNextJs.query[key] === 'string') selected = routerNextJs.query[key];
  else
    routerNextJs.query[key]?.map(
      (i: string, index: number) =>
        (selected += `${i}${index < routerNextJs.query[key].length - 1 ? ', ' : ''}`)
    );
  return selected.trim();
};
