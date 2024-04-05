import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import blogServices from 'services/blog-services';

import BlogCard from 'components/Fragments/BlogCard';

import { BlogModel } from 'models/blog.models';

import { maxMedia } from 'styles/__media';

type Props = {
  articleId: string;
  categoryId: string;
  langCode: string;
};

const ArticleRelateBlog = memo(function ArticleRelateBlog(props: Props) {
  const { articleId, categoryId, langCode } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BlogModel[]>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    await blogServices
      .getArticleRelate(articleId, categoryId, 2, langCode)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
    setLoading(false);
  }, [articleId, categoryId, langCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div />;

  return (
    <Wrapper>
      {data?.map((article) => {
        return <BlogCard key={article.id} data={article} />;
      })}
    </Wrapper>
  );
});
export default ArticleRelateBlog;

const Wrapper = styled.div`
  margin: 30px 0 0 30px;
  width: 298px;
  display: flex;
  flex-direction: column;
  ${maxMedia.medium} {
    margin: 30px 0;
    width: auto;
  }
  ${maxMedia.small} {
    margin: 20px 0;
    width: auto;
  }
  ${maxMedia.xsmall} {
    margin: 20px 0;
    width: auto;
  }
`;
