import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Button, ConfigProvider, Drawer, Pagination } from 'antd';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';
import { message } from 'lib/utils/message';
import productServices from 'services/product-services';
import licenseServices from 'services/license-services';
import brandsServices from 'services/brands-services';
import showroomServices from 'services/showroom-services';
import { AppState } from 'store/type';

import ResultEmpty from 'components/Fragments/ResultEmpty';
import CategoryExplore from './Fragments/Category';
import ExploreFilterPanel from './FilterPanel';
import ExploreResult from './Result';
import ProductSkeleton from './Fragments/Skeleton';

import { ExploreType } from 'models/explore.model';
import { ProductModel } from 'models/product.model';
import { LicenseModel } from 'models/license.models';
import { BrandModel, ShowroomStatisticalType } from 'models/showroom.models';
import { CategoryModel } from 'models/category.models';

import * as SC from './style';
import { ContainerFreeSize } from 'styles/__styles';

type Props = {
  exploreType?: ExploreType;
  statistical?: ShowroomStatisticalType;
  nickName?: string;
};

const ExplorePage = (props: Props) => {
  const { exploreType = 'explore' } = props;

  const { langLabel, langCode, t } = useLanguage();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const categories = useSelector((state: AppState) => state.web.categories);

  const { width } = useWindowSize();

  const [openPanel, setOpenPanel] = useState<boolean>(false);
  const [license, setLicense] = useState<LicenseModel[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filtering, setFiltering] = useState<boolean>(false);
  const [queryUrl, setQueryUrl] = useState<string>('');
  const [products, setProducts] = useState<{ data: ProductModel[]; total: number }>({
    data: [],
    total: 0,
  });

  const [brands, setBrands] = useState<BrandModel[] | null>(null);
  const [category, setCategory] = useState<CategoryModel[] | null>(null);

  const rowsPerPage = 10;
  let itemOfPage = 0;

  if (props.exploreType === 'showroom') {
    if (width) {
      if (width > 1920) itemOfPage = rowsPerPage * 5;
      else itemOfPage = rowsPerPage * 3;
    }
  } else if (width) {
    if (width > 1920) itemOfPage = rowsPerPage * 5;
    else if (width > 1440) itemOfPage = rowsPerPage * 4;
    else if (width >= 1024) itemOfPage = rowsPerPage * 3;
    else itemOfPage = rowsPerPage * 2;
  }

  // get data initial
  useEffect(() => {
    (async () => {
      await licenseServices
        .getList()
        .then((res) => setLicense(res.data))
        .catch((err) => console.error(err));
    })();

    if (exploreType === 'showroom') {
      (async () => {
        try {
          const resp = await showroomServices.getCategoryByNickName(
            props.statistical?.nickName ?? ''
          );
          if (!resp.error) setCategory(resp.data);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      (async () => {
        try {
          const resp = await brandsServices.listBrands({
            limit: 2147483647, // 2147483647: get all record (max integer postgresql)
            offset: 0,
            params: { status: true },
          });

          if (!resp.error) setBrands(resp.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [exploreType, props.statistical?.nickName]);

  useEffect(() => {
    if (JSON.stringify(router.query) !== queryUrl) setQueryUrl(JSON.stringify({ ...router.query }));
  }, [queryUrl, router.query]);

  //Filter Product
  const onFilterProduct = useCallback(
    async (signal: AbortSignal) => {
      if (itemOfPage && queryUrl) {
        const controller = new AbortController();
        setFiltering(true);
        const filter: any = JSON.parse(queryUrl);
        try {
          let params: any = {
            saleoff: exploreType === 'sale-off' ? true : undefined,
            minPrice: exploreType === 'free-models' || filter.free ? 0 : 1,
            maxPrice: exploreType === 'free-models' || filter.free ? 0 : undefined,
            is_pbr: filter.pbr === '1' || filter.pbr,
            is_animated: filter.animated === '1' || filter.animated,
            is_rigged: filter.rigged === '1' || filter.rigged,
            sort_by:
              filter.sort === 'best-selling'
                ? 'bought_count'
                : filter.sort === 'newest' || filter.sort === 'oldest'
                ? 'publish_date'
                : ['lower-price', 'higher-price'].includes(filter.sort)
                ? 'price'
                : !filter.sort
                ? 'viewed_count'
                : filter.sort,
            sort_type: filter.sort === 'lower-price' || filter.sort === 'oldest' ? 'asc' : 'desc',
            offset: (Number(filter.page || 1) - 1) * itemOfPage,
            limit: itemOfPage,
            product_id: filter.product_id,
          };

          if (filter.s) {
            params.keyword = filter.s;
            // Convert multi space to one space
            params.keyword = params.keyword.replace(/[\s]/gi, ' ');
            // Convert + on url to space
            params.keyword = params.keyword.replace(/\+/g, ' ');
            // Remove 2 leading spaces
            params.keyword = params.keyword.replace(/\s+/g, ' ').trim();
            // Convert to array
            params.keyword = params.keyword.split(' ');
          }

          if (exploreType === 'showroom') {
            params.author_id = props.statistical?.market_users[0].id;

            if (filter.category && filter.category !== 'all')
              params.category_showroom = filter.category.split('--')[1];
          } else {
            params.brand_id = filter.brand_id;
            if (filter.category && filter.category !== 'all')
              params.category = [filter.category.split('--')[1]];
          }

          if (filter.min && exploreType !== 'free-models') params.minPrice = Number(filter.min);
          if (filter.max && exploreType !== 'free-models') params.maxPrice = Number(filter.max);
          if (filter.formats)
            params.format =
              typeof filter.formats === 'string'
                ? [filter.formats.toUpperCase()]
                : filter.formats.map((i: string) => i.toUpperCase());
          if (filter.licenses)
            params.license_ids =
              typeof filter.licenses === 'string'
                ? [filter.licenses.split('--')[1]]
                : filter.licenses.map((i: string) => i.split('--')[1]);

          const { data, total } = await productServices.filterProducts(params, {
            signal,
          });
          setProducts({ data, total: total ?? 0 });
          setFiltering(false);
          setLoading(false);
        } catch (error) {
          message.destroy();
          setLoading(false);
          setFiltering(false);
          if (Object.keys(router.query).length > 0) handelReset();
        }

        return () => controller.abort();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemOfPage, queryUrl]
  );

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onFilterProduct(controller.signal);
    return () => controller.abort();
  }, [onFilterProduct]);

  const handelChangePage = (page: number) => {
    if ((!router.query.page && page !== 1) || Number(router.query.page || 1) !== page) {
      let query = { ...router.query };
      delete query['category'];
      delete query['nickName'];
      delete query['product_id'];

      if (page === 1) delete query['page'];
      else query['page'] = page.toString();

      const pathname = router.asPath.split('?')[0];

      router.push({ pathname, query }, undefined, { shallow: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handelReset = () => {
    let pathname = '';
    if (exploreType === 'showroom') {
      const nickName = router.query.nickName;
      pathname = '/' + langCode + '/showroom/' + nickName + '/products' + '/all';
    } else {
      const currentPath = router.asPath.split('/')[1];
      pathname = '/' + langCode + '/' + currentPath + '/all';
    }
    router.push({ pathname }, undefined, { shallow: true });
    if (openPanel) setOpenPanel(false);
  };

  return (
    <SC.Wrapper ref={wrapperRef} className={props.exploreType === 'showroom' ? 'pb-0' : ''}>
      {props.exploreType !== 'showroom' && (
        <CategoryExplore
          category={categories?.find(
            (cate) => cate.id === router.query.category?.toString().split('--')[1]
          )}
          isBestSelling={router.query.sort === 'best-selling'}
        />
      )}
      <SC.Explore__Layout>
        <ContainerFreeSize className='explore-layout'>
          {width > 800 && (
            <ExploreFilterPanel
              exploreType={exploreType}
              categories={
                exploreType === 'showroom'
                  ? category
                  : categories?.filter((cate) => cate.status === true)
              }
              license={license}
              handelReset={handelReset}
              brands={brands}
            />
          )}
          <div className='explore-product-list'>
            {!filtering && (
              <ExploreResult products={products.data} exploreType={props.exploreType} />
            )}

            {!loading && !filtering && products.total === 0 && (
              <ResultEmpty
                title={langLabel.explore_search_result_empty_title}
                description={langLabel.explore_search_result_empty_description}
              />
            )}

            {(loading || filtering) && <ProductSkeleton length={(itemOfPage / rowsPerPage) * 3} />}

            {products.total > itemOfPage && (
              <SC.Explore__Pagination>
                <Pagination
                  pageSize={itemOfPage}
                  total={products.total}
                  showSizeChanger={false}
                  current={router.query.page ? Number(router.query.page?.toString()) : 1}
                  onChange={handelChangePage}
                />
              </SC.Explore__Pagination>
            )}
          </div>
        </ContainerFreeSize>
      </SC.Explore__Layout>
      {width > 0 && width <= 800 && (
        <>
          <Drawer
            open={openPanel}
            title='Filter Panel'
            placement='left'
            width='100vw'
            getContainer={() => wrapperRef.current ?? document.body}
            onClose={() => setOpenPanel(false)}>
            <ExploreFilterPanel
              exploreType={exploreType}
              categories={exploreType === 'showroom' ? category : categories}
              license={license}
              brands={brands}
            />
            <SC.Explore__ButtonFilter>
              <ConfigProvider theme={{ token: { colorError: '#ba3d4f' } }}>
                <Button
                  type='text'
                  danger
                  onClick={() => Object.keys(router.query)[0] && handelReset()}>
                  {langLabel.reset || 'Reset'}
                </Button>
              </ConfigProvider>

              <ConfigProvider theme={{ token: { colorPrimary: '#3fc1d1' } }}>
                <Button type='primary' onClick={() => setOpenPanel(!openPanel)}>
                  {t('btn_apply', 'Apply')}
                </Button>
              </ConfigProvider>
            </SC.Explore__ButtonFilter>
          </Drawer>

          <SC.Explore__ButtonFilter>
            <ConfigProvider theme={{ token: { colorPrimary: '#3fc1d1' } }}>
              <Button type='primary' onClick={() => setOpenPanel(!openPanel)}>
                {t('btn_filter', 'Filter')}
              </Button>
            </ConfigProvider>
          </SC.Explore__ButtonFilter>
        </>
      )}
    </SC.Wrapper>
  );
};

export default ExplorePage;
