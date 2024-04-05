import { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';
import useLanguage from 'hooks/useLanguage';

import { Flex, Pagination, Spin } from 'antd';

import config from 'config';
import likeServices from 'services/like-services';

import HeaderPage from '../Fragments/HeaderPage';
import ResultEmpty from 'components/Fragments/ResultEmpty';
import ProductCard from 'components/Fragments/ProductCard';

import { LikeProductModel } from 'models/like.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const pageSize = 12;

const MyLikes = () => {
  const { langLabel } = useLanguage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ models: LikeProductModel[]; total: number }>();

  const fetchMyLike = useCallback(async (page: number) => {
    setIsLoading(true);
    await likeServices
      .getLikes(pageSize, (page - 1) * pageSize)
      .then(({ data, total }) => setData({ models: data, total }))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchMyLike(1);
  }, [fetchMyLike]);

  const title = `My Likes | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Wrapper>
        <HeaderPage
          title={
            data && (data?.total > 1 || data?.total === 0)
              ? langLabel.my_profile_models_title
              : langLabel.my_profile_model_title
          }
          total={data?.total}
        />
        {!isLoading && data && data.total === 0 && (
          <ResultEmpty description={langLabel.my_profile_like_empty} />
        )}
        <Spin spinning={isLoading}>
          <ListItem style={{ minHeight: isLoading ? 300 : 'inherit' }}>
            {data?.models.map((item) => (
              <ProductCard key={item.id} data={item.market_item} />
            ))}
          </ListItem>

          {data && data.total > pageSize && (
            <Flex justify='center' style={{ marginTop: 20 }}>
              <Pagination
                pageSize={pageSize}
                total={data?.total}
                showSizeChanger={false}
                onChange={fetchMyLike}
              />
            </Flex>
          )}
        </Spin>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding: 20px 40px;

  ${maxMedia.medium} {
    padding: 20px;
  }
`;

const ListItem = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: min-content;
  gap: 2rem 2rem;

  margin-top: 20px;

  ${maxMedia.small} {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 5rem;

    .card__item {
      flex-shrink: 0;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  ${maxMedia.tiny} {
    grid-template-columns: 100%;
  }
`;

export default MyLikes;
