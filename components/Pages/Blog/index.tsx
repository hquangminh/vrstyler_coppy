import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Button, Spin } from 'antd';

import useDebounce from 'hooks/useDebounce';
import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';
import blogServices, { GetBlogBody } from 'services/blog-services';
import isArrayEmpty from 'common/functions/isArrayEmpty';

import ResultEmpty from 'components/Fragments/ResultEmpty';
import HelpCenterHeader from './Header';
import HelpCenterCategoryList from './BlogTab';
import HelpCenterList from './List';

import { BlogCategory, BlogModel } from 'models/blog.models';

import { Container } from 'styles/__styles';

type Props = { langCode?: string; category: BlogCategory[] };

const BlogComponent = ({ langCode = 'en', category }: Props) => {
  const router = useRouter();
  const { langLabel } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<GetBlogBody>({ language_code: langCode });
  const [textSearch, setTextSearch] = useState<string>('');
  const [data, setData] = useState<BlogModel[]>();
  const [page, setPage] = useState<number>(1);

  const { width: screenW } = useWindowSize();

  const debouncedTextSearch = useDebounce<string>(textSearch, 500);

  const pageSize: number = useMemo(() => {
    if (screenW > 0) {
      if (screenW <= 991) return 6;
      else return 8;
    }
    return 0;
  }, [screenW]);

  useEffect(() => {
    const cateOnURI = router.query.category?.toString();
    const category = cateOnURI === 'all' ? undefined : cateOnURI?.split('--')[1];
    const title = debouncedTextSearch.trim() || undefined;
    const newSearch = { language_code: langCode, category, title };
    if (JSON.stringify(newSearch) !== JSON.stringify(search)) setSearch(newSearch);
  }, [langCode, debouncedTextSearch, router, search]);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true);
        await blogServices.getList(search, { signal }).then(({ data }) => setData(data));
        setPage(1);
        setLoading(false);
      } catch (error) {}
    },
    [search]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return (
    <HelpCenterWrapper>
      <Container>
        <HelpCenterHeader onSearch={setTextSearch} />
        <HelpCenterCategoryList categoryList={category} />
        <Spin spinning={loading} style={{ minHeight: 100 }}>
          {loading && !data ? (
            <div style={{ minHeight: '300px' }} />
          ) : (
            <>
              <HelpCenterList
                blogList={data?.slice(0, page * pageSize)}
                highlight={debouncedTextSearch.toLowerCase()}
              />
              {(!data || isArrayEmpty(data)) && (
                <ResultEmpty description={langLabel.blog_empty_title} />
              )}
            </>
          )}
        </Spin>
        {data && data?.length > page * pageSize && (
          <div className='blog-button-see-more'>
            <Button type='primary' onClick={() => setPage((page) => page + 1)}>
              {langLabel.btn_see_more || 'See More'}
            </Button>
          </div>
        )}
      </Container>
    </HelpCenterWrapper>
  );
};
export default BlogComponent;

const HelpCenterWrapper = styled.main`
  padding-bottom: 50px;

  .blog-button-see-more {
    margin-top: 50px;
    text-align: center;
    .ant-btn {
      width: 224px;
      height: 41px;
    }
  }
`;
