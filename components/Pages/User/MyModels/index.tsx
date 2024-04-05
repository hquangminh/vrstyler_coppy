import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { Spin } from 'antd';

import useWindowScroll from 'hooks/useWindowScroll';

import assetsServices, { BodyGetModel } from 'services/assets-services';

import config from 'config';
import useLanguage from 'hooks/useLanguage';
import useRouterChange from 'hooks/useRouterChange';

import ResultEmpty from 'components/Fragments/ResultEmpty';
import UserPageTabContent from '../Layout/TabContent';
import FilterModel from './Fragments/FilterModel';
import HeaderPage from '../Fragments/HeaderPage';
import ModelItem from './Fragments/ModelItem';

import { UserPageMyModelsProps } from 'models/user.models';
import { AssetModel } from 'models/asset.models';

import * as L from './style';

const pageSize = 30;
const paramFilterDefault: BodyGetModel = {
  type: 'all',
  keywords: '',
  sort: 'recently',
  offset: 0,
  limit: pageSize,
};

const MyModels = (props: UserPageMyModelsProps) => {
  const pageYOffset = useWindowScroll();
  const { langCode, langLabel, t } = useLanguage();

  const [models, setModels] = useState<{ list: AssetModel[]; total: number } | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [paramFilter, setParamFilter] = useState<BodyGetModel>();

  useRouterChange(
    () => undefined,
    () => setParamFilter({ ...paramFilterDefault, type: props.tabName ?? 'all' })
  );

  // Get models when change Tab
  useEffect(() => {
    setModels(undefined);
    setParamFilter({ ...paramFilterDefault, type: props.tabName ?? 'all' });
  }, [props.tabName, props.userID]);

  // Check scroll Load more
  useEffect(() => {
    const spinTop = document.getElementById('spin-load-more')?.offsetTop ?? 0;
    const isScrollBottom = spinTop <= pageYOffset + window.innerHeight - 50;

    if (isScrollBottom && models && models.total > models.list.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setParamFilter((p = paramFilterDefault) => ({ ...p, offset: p.offset + pageSize }));
    }
  }, [isLoadingMore, models, pageYOffset]);

  // Get Model
  const fetchModel = useCallback(async () => {
    if (paramFilter) {
      setIsLoading(true);
      await assetsServices
        .getModel(paramFilter)
        .then(({ data, total }) =>
          setModels((m = { list: [], total: 0 }) => ({
            list: m.list.length <= paramFilter.offset ? m.list.concat(data) : data,
            total,
          }))
        )
        .finally(() => {
          setIsLoading(false);
          setIsLoadingMore(false);
        });
    }
  }, [paramFilter]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  const onSearch = (value: string) => {
    if (paramFilter?.keywords.trim() !== value.trim()) {
      setParamFilter((p = paramFilterDefault) => ({ ...p, offset: 0, keywords: value.trim() }));
    }
  };

  const title = `My Models | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <UserPageTabContent
        tabs={[
          {
            title: langLabel.all || 'ALL',
            url: `/${langCode}/user/models/all`,
            active: [null, 'all'].includes(props.tabName),
          },
          {
            title: langLabel.my_profile_download,
            url: `/${langCode}/user/models/downloaded`,
            active: props.tabName === 'downloaded',
          },
          {
            title: langLabel.my_profile_not_download,
            url: `/${langCode}/user/models/not-downloaded`,
            active: props.tabName === 'not-downloaded',
          },
        ]}
        isSearch
        placeholder={langLabel.search || 'Search'}
        isResetSearchChangeTab
        onSearch={(keywords) => onSearch(keywords)}
      />

      <L.MyModels_wrapper>
        <L.Header_wrapper>
          <HeaderPage
            title={
              models && (models.total > 1 || models.total === 0)
                ? langLabel.my_profile_models_title
                : langLabel.my_profile_model_title
            }
            total={models?.total}
            className='model__title'
          />

          <FilterModel
            selected={paramFilter?.sort}
            onChange={(sort) =>
              setParamFilter((p = paramFilterDefault) => ({ ...p, sort, offset: 0 }))
            }
          />
        </L.Header_wrapper>

        <Spin spinning={isLoading}>
          <L.MyModels__List>
            {!models && <div style={{ height: 300 }} />}
            {models && !models.total && (
              <ResultEmpty description={t('my_profile_model_empty_title')} />
            )}
            {models?.list.map((item) => (
              <ModelItem key={item.id} data={item} />
            ))}
          </L.MyModels__List>
        </Spin>

        {models && models.total > models.list.length && (
          <div className=' pt-3 pb-3 text-center' id='spin-load-more'>
            <Spin />
          </div>
        )}
      </L.MyModels_wrapper>
    </>
  );
};

export default MyModels;
