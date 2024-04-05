/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Checkbox, Collapse, ConfigProvider, Input, Radio, Space } from 'antd';

import useLanguage from 'hooks/useLanguage';
import useDebounce from 'hooks/useDebounce';
import useWindowSize from 'hooks/useWindowSize';
import useIsFirstRender from 'hooks/useIsFirstRender';

import { onCheckedFilterCheckMulti } from 'lib/utils/exploreFunctions';

import { changeToSlug } from 'common/functions';

import * as FilterConstant from 'constants/explore.constant';

import Icon from 'components/Fragments/Icons';

import { CategoryModel } from 'models/category.models';
import { ExploreType } from 'models/explore.model';
import { LicenseModel } from 'models/license.models';
import { BrandModel } from 'models/showroom.models';

import { ExploreFilterPanelItem, ExploreFilterPanelWrapper } from './style';

type Props = {
  exploreType: ExploreType;
  categories?: CategoryModel[] | null;
  license?: LicenseModel[];
  brands?: BrandModel[] | null;
  handelReset?: () => void;
};

const ExploreFilterPanel = (props: Props) => {
  const router = useRouter();
  const { width: screenW, height: screenH } = useWindowSize();
  const { langLabel } = useLanguage();

  const isFirstRender = useIsFirstRender();
  const [height, setHeight] = useState<number>(0);
  const [keywords, setKeywords] = useState<string>(
    router.query.s?.toString().trim().replaceAll('+', ' ') ?? ''
  );

  const debouncedKeywords = useDebounce<string>(keywords.trim(), 500);
  const valuePrice = useMemo(() => {
    if (router.query.free) return 'free';
    else if (!router.query.min && !router.query.max) return 'all';
    else return (router.query.min ?? 1) + '-' + (router.query.max ?? '');
  }, [router.query.free, router.query.max, router.query.min]);

  // const screenH = screen[1];

  // useEffect(() => {
  //   const header = document.getElementsByTagName('header')[0];
  //   const footer = document.getElementsByTagName('footer')[0];
  //   const category = document.getElementById('explore-category-banner');

  //   const headerHeight = header.clientHeight;
  //   const categoryHeight = category?.clientHeight ?? 0;
  //   const heightAdditional = pageYOffset < categoryHeight ? pageYOffset : categoryHeight;
  //   const heightEliminate =
  //     pageYOffset + screenH >= footer.offsetTop ? pageYOffset + screenH + 77 - footer.offsetTop : 0;

  //   setHeight(screenH - headerHeight - categoryHeight + heightAdditional - heightEliminate);
  // }, [screenH, pageYOffset, props.products]);

  const handelSelectFilter = (key: string, value: string) => {
    let query = { ...router.query };

    delete query['category'];
    delete query['nickName'];
    delete query['page'];

    const sort = (query.sort ?? '').toString();
    const isCheckSortFree = key === 'price' && value === 'free';

    // Check sort free
    if (['lower-price', 'higher-price'].includes(sort) && isCheckSortFree) {
      delete query['sort'];
    }

    let categoryFilter: string = router.query.category?.toString() ?? 'all';

    if (query.product_id && !isFirstRender) delete query['product_id'];

    switch (key) {
      case 'brand':
        if (value === 'all') delete query['brand_id'];
        else query.brand_id = value;

        break;

      case 'category':
        if (value !== 'all') {
          categoryFilter =
            changeToSlug(props.categories?.find((c) => c.id === value)?.title || '') + '--' + value;
        } else categoryFilter = 'all';

        break;

      case 'price':
        if ((value === 'free' && !query['free']) || (value !== 'free' && query['free']))
          delete query['licenses'];

        delete query['min'];
        delete query['max'];
        delete query['free'];

        if (value === 'free') query['free'] = '1';
        else if (value !== 'all') {
          const priceRange: [number, number] = [1, 500];
          const price: [number, number] = [
            Number(value.split('-')[0]),
            Number(value.split('-')[1]),
          ];
          if (price[0] && price[0] !== priceRange[0]) query.min = price[0].toString();
          if (price[1] && price[1] !== priceRange[1]) query.max = price[1].toString();
        }

        break;

      case 'other':
        if (query[value]) delete query[value];
        else query[value] = '1';

        break;

      case 'sort':
        if (value === 'relevance') delete query['sort'];
        else query['sort'] = value;

        break;

      case 'search':
        if (value.trim()) query.s = value.trim();
        else delete query['s'];

        break;

      default:
        break;
    }

    const pathname =
      '/' + router.asPath.split('?')[0].split('/').slice(1, -1).join('/') + '/' + categoryFilter;

    router.push({ pathname, query }, undefined, { shallow: true });
  };

  useEffect(() => {
    const query = router.query.s?.toString().trim();

    if (router.query.s === undefined || query !== keywords.trim()) {
      setKeywords(query || '');
    }
  }, [router.query.s]);

  useEffect(() => {
    if (!isFirstRender) handelSelectFilter('search', debouncedKeywords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeywords]);

  return (
    <ExploreFilterPanelWrapper className='hide-scrollbar' height={height}>
      {props.exploreType !== 'showroom' && (
        <ExploreFilterPanelItem>
          <Input
            placeholder={langLabel.explore_search_placeholder}
            prefix={<Icon iconName='search' />}
            bordered={false}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onPressEnter={() => handelSelectFilter('search', keywords)}
          />
        </ExploreFilterPanelItem>
      )}

      <Collapse
        expandIconPosition='end'
        bordered={false}
        defaultActiveKey={['category', 'price', 'brand']}>
        {/* Brands */}
        {props.exploreType !== 'showroom' && (
          <Collapse.Panel header={langLabel.explore_filter_brand} key='brand'>
            <Radio.Group
              value={router.query.brand_id ?? 'all'}
              onChange={(e) => handelSelectFilter('brand', e.target.value)}>
              <Space direction='vertical'>
                <Radio key='all' value='all'>
                  {langLabel.all}
                </Radio>
                {props.brands?.map((brand) => (
                  <Radio key={brand.id} value={brand.id}>
                    {brand.title}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Collapse.Panel>
        )}

        {/* Category */}
        <Collapse.Panel header={langLabel.category || 'Category'} key='category'>
          <Radio.Group
            value={router.query.category?.toString().split('--')[1] ?? 'all'}
            onChange={(e) => handelSelectFilter('category', e.target.value)}>
            <Space direction='vertical'>
              <Radio value='all'>
                {props.exploreType === 'showroom'
                  ? langLabel.showroom_channel_all_product
                  : langLabel.explore_all_categories}
              </Radio>
              {props.categories?.map((cate) => {
                return (
                  <Radio key={cate.id} value={cate.id}>
                    {cate.title}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </Collapse.Panel>

        {/* Price */}
        {props.exploreType !== 'free-models' && (
          <Collapse.Panel header={langLabel.price || 'Price'} key='price' className='--price'>
            <Radio.Group
              value={valuePrice}
              onChange={(e) => handelSelectFilter('price', e.target.value)}>
              <Space direction='vertical'>
                {(props.exploreType === 'explore' || props.exploreType === 'showroom') && (
                  <Radio value='free'>{langLabel.free || 'Free'}</Radio>
                )}
                <Radio value='all'>{langLabel.all}</Radio>
                <Radio value='1-50'>$1 to $50</Radio>
                <Radio value='50-150'>$50 to $150</Radio>
                <Radio value='150-350'>$150 to $350</Radio>
                <Radio value='350-'>$350+</Radio>
              </Space>
            </Radio.Group>
          </Collapse.Panel>
        )}

        {/* Formats */}
        <Collapse.Panel header={langLabel.format || 'Formats'} key='formats'>
          <Space direction='vertical'>
            {FilterConstant.filterFormats.map((i) => {
              return (
                <Checkbox
                  key={i.key}
                  value={i.key}
                  checked={router.query.formats?.includes(i.key)}
                  onChange={() =>
                    onCheckedFilterCheckMulti(router, 'formats', i.key, props.exploreType)
                  }>
                  {i.title}
                </Checkbox>
              );
            })}
          </Space>
        </Collapse.Panel>

        {/* License */}
        {props.license && (
          <Collapse.Panel header={langLabel.license || 'License'} key='licenses'>
            <Space direction='vertical'>
              {props.license
                .filter((i) =>
                  router.query.free || router.asPath.split('/')[1] === 'free-models'
                    ? i.is_free
                    : !i.is_free
                )
                .map((i) => {
                  return (
                    <Checkbox
                      key={i.id}
                      value={i.id}
                      checked={router.query.licenses?.toString().includes(i.id)}
                      onChange={() =>
                        onCheckedFilterCheckMulti(
                          router,
                          'licenses',
                          `${changeToSlug(i.title)}--${i.id}`,
                          props.exploreType
                        )
                      }>
                      {i.title}
                    </Checkbox>
                  );
                })}
            </Space>
          </Collapse.Panel>
        )}

        {/* Other */}
        <Collapse.Panel header={langLabel.other || 'Other'} key='other'>
          <Space direction='vertical'>
            {FilterConstant.filterOther(langLabel).map((i) => {
              return (
                <Checkbox
                  key={i.key}
                  value={i.key}
                  checked={typeof router.query[i.key] !== 'undefined'}
                  onChange={() => handelSelectFilter('other', i.key)}>
                  {i.title}
                </Checkbox>
              );
            })}
          </Space>
        </Collapse.Panel>

        {/* Sort by */}
        <Collapse.Panel header={langLabel.explore_filter_sort_by} key='sort'>
          <Radio.Group
            value={router.query.sort ?? 'relevance'}
            onChange={(e) => handelSelectFilter('sort', e.target.value)}>
            <Space direction='vertical'>
              {FilterConstant.filterSort(langLabel)
                .filter((f) => {
                  if (router.query.free) {
                    return !f.isFree;
                  } else {
                    return f;
                  }
                })
                .map((i) => {
                  return (
                    <Radio key={i.key} value={i.key}>
                      {i.title}
                    </Radio>
                  );
                })}
            </Space>
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>

      {screenW > 800 && (
        <ConfigProvider theme={{ token: { colorPrimary: '#ba3d4f' } }}>
          <Button
            className='explore-filter-panel-btn-reset'
            type='primary'
            onClick={() =>
              Object.keys(router.query)[0] && props.handelReset && props.handelReset()
            }>
            {langLabel.reset || 'Reset'}
          </Button>
        </ConfigProvider>
      )}
    </ExploreFilterPanelWrapper>
  );
};

export default ExploreFilterPanel;
