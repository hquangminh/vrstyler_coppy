import { useEffect, useState } from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Breadcrumb } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { changeToSlug } from 'common/functions';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import urlPage from 'constants/url.constant';

import MyImage from 'components/Fragments/Image';
import Moment from 'components/Fragments/Moment';
import RenderHtmlEditor from 'components/Fragments/RenderHTMLEditor';
import Icon from 'components/Fragments/Icons';
import DividerMain from 'components/Fragments/DividerMain';
import ArticleRelateBlog from './ArticleRelate';
import BlogDetailProductSuggest from './ProductSuggest';

import { BlogModel } from 'models/blog.models';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const BlogDetailComponent = ({ data }: { data: BlogModel }) => {
  const { langCode, langLabel, t } = useLanguage();

  const [banner, setBanner] = useState<string>(data.banner);

  useEffect(() => {
    if (banner !== data.banner) setBanner(data.banner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.banner]);

  const blogLanguage = data.market_blog_languages[0];
  const category = data.market_category_blog;
  const urlBlogCategory = urlPage.blogCategory.replace(
    '{category}',
    `${changeToSlug(category.title)}--${category.id}`
  );

  return (
    <Wrapper>
      <Container>
        <Breadcrumb
          className='my-breadcrumb'
          separator='>'
          items={[
            { key: 'blog', title: <Link href='/blog/all'>{t('blog')}</Link> },
            { key: 'category', title: <Link href={urlBlogCategory}>{category.title}</Link> },
            { key: 'detail', title: blogLanguage.title },
          ]}
        />
        <div className='BlogDetail__Banner'>
          {banner === data.banner && (
            <MyImage fill src={banner} alt={blogLanguage.title} style={{ objectFit: 'cover' }} />
          )}
        </div>
        <div className='BlogDetail__Info'>
          <div className='BlogDetail__Header'>
            <h3>{data.market_category_blog.title}</h3>
            <h1>{blogLanguage.title}</h1>
            <p className='BlogDetail__Summary'>{blogLanguage.sumary}</p>
            <p className='BlogDetail_time'>
              <Moment date={data.publish_date} langCode={langCode} fromNow />
            </p>
            <div className='BlogDetail__Content'>
              <RenderHtmlEditor html={blogLanguage?.content} />
            </div>
            <div className='BlogDetail__Content__Frame'>
              {blogLanguage.hashtag && blogLanguage.hashtag.length > 0 && (
                <ul className='BlogDetail__Hashtags'>
                  {blogLanguage.hashtag.map((ht) => {
                    return <li key={ht}>#{ht}</li>;
                  })}
                </ul>
              )}
            </div>
          </div>
          {data && (
            <ArticleRelateBlog
              articleId={data.id}
              categoryId={data.market_category_blog.id}
              langCode={blogLanguage.market_language.language_code}
            />
          )}
        </div>
        <Link href='/blog' className='BlogDetail__GoBack'>
          <Icon iconName='arrow-left-line' />
          {langLabel.blog_btn_go_back}
        </Link>
        <div
          className='icon__mobile'
          style={{ display: isArrayEmpty(data.market_blog_items) ? 'none' : 'block' }}>
          <DividerMain height={112} />
        </div>
        {!isArrayEmpty(data.market_blog_items) && (
          <BlogDetailProductSuggest products={data.market_blog_items ?? []} />
        )}
      </Container>
    </Wrapper>
  );
};
export default BlogDetailComponent;

const Wrapper = styled.main`
  .site-card-wrapper {
    ${maxMedia.medium} {
      margin-left: auto;
      margin-right: auto;
    }
    ${maxMedia.small} {
      margin-left: auto;
      margin-right: auto;
    }
    ${maxMedia.xsmall} {
      margin-left: auto;
      margin-right: auto;
    }
  }
  padding-bottom: 20px;
  .BlogDetail__Banner {
    position: relative;
    text-align: center;
    height: 400px;
    img {
      border-radius: 8px;
    }

    ${maxMedia.medium} {
      width: 100% !important;
      height: 187px;
    }
  }
  .BlogDetail__Info {
    display: flex;
    width: 100%;
    ${maxMedia.medium} {
      flex-direction: column;
      max-width: unset;
    }
  }
  .BlogDetail_time {
    font-size: 14px;
    color: var(--color-gray-7);
    padding: 8px 0 30px 0;
    ${maxMedia.small} {
      font-size: 14px;
      padding: 15px 0 30px 0;
    }
    ${maxMedia.xsmall} {
      font-size: 14px;
      padding: 6px 0 15px 0;
    }
  }
  .BlogDetail__Header {
    margin: 30px 0 20px 0;
    width: 100%;
    flex: 1;
    ${maxMedia.medium} {
      margin: 0;
    }
    & > h3 {
      font-size: 16px;
      font-weight: normal;
      color: var(--color-primary-500);
      padding: 0 0 8px 0;
      ${maxMedia.small} {
        margin: 15px 0 6px 0;
      }
    }
    & > h1 {
      font-size: 38px;
      color: var(--color-gray-11);
      word-break: break-word;
      ${maxMedia.small} {
        margin: 6px 0;
        font-size: 18px;
        font-weight: 500px;
      }
    }
    .BlogDetail__Summary {
      padding: 8px 0 8px 0;
      font-size: 16px;
      font-style: italic;
      color: var(--color-gray-9);
      text-align: justify;
      word-break: break-word;
      ${maxMedia.small} {
        font-size: 14px;
        padding: 6px 0 15px 0;
      }
    }
    ${maxMedia.medium} {
      max-width: unset;
    }
  }
  .BlogDetail__Content {
    max-width: calc(100% - 5px);
    word-break: break-word;
    font-size: 14px;
    color: var(--color-gray-9);
  }
  .BlogDetail__Hashtags {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin: 40px 0 31.5px 0;
    list-style: none;
    ${maxMedia.small} {
      margin: 20px 0;
    }
    ${maxMedia.xsmall} {
      margin: 20px 0;
    }
    li {
      padding: 10px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      color: #fefefe;
      background-color: var(--color-primary-700);
    }
  }
  .BlogDetail__GoBack {
    width: 100%;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    color: var(--color-gray-7);
    .my-icon {
      font-size: 24px;
      margin-right: 8px;
    }
    ${maxMedia.medium} {
      display: none;
    }
    ${maxMedia.small} {
      display: none;
    }
    ${maxMedia.xsmall} {
      display: none;
    }
  }
  .ant-breadcrumb {
    ol {
      display: initial;
      flex-wrap: nowrap;
      li {
        display: inline;
        float: none;
      }
    }
  }
`;
