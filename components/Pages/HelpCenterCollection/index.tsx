import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Breadcrumb, Skeleton } from 'antd';
import { changeToSlug } from 'common/functions';

import urlPage from 'constants/url.constant';
import useLanguage from 'hooks/useLanguage';
import helpCenterServices from 'services/helpCenter-services';

import { HelpCategory, HelpModel } from 'models/help.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';
import { Container, TextLineCamp } from 'styles/__styles';

const Wrapper = styled.main`
  .help-collection-breadcrumb {
    padding: 30px 0;
    ${maxMedia.medium} {
      padding: 15px 0;
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
  .help-collection-title {
    font-size: 32px;
    font-weight: 500;
    color: var(--text-title);

    ${maxMedia.medium} {
      font-size: 24px;
    }
  }
  .help-collection-description {
    margin-top: 4px;
    font-size: 14px;
    color: var(--color-gray-7);
  }
  .help-collection-article-list {
    margin-top: 16px;
  }
`;
const ArticleCard = styled.div`
  border: var(--border-1px);
  border-radius: 8px;
  transition: all 0.16s ease 0s;
  margin-bottom: 24px;
  ${maxMedia.medium} {
    margin-bottom: 16px;
  }
  cursor: pointer;
  &:hover {
    border-color: var(--color-primary-700);
  }
  a {
    color: currentColor;
    line-height: normal;
    display: block;
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  .help-collection-article-card-title {
    font-size: 18px;
    font-weight: 400;
    color: var(--text-caption);
    cursor: pointer;
    ${maxMedia.medium} {
      font-size: 16px;
    }
  }
  .skeleton {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
`;

type Props = {
  helpCollection: HelpCategory;
};

const HelpCollection = (props: Props) => {
  const { helpCollection } = props;
  const { t } = useLanguage();
  const [helpList, setHelpList] = useState<HelpModel[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (helpCollection) {
      setLoading(true);
      helpCenterServices.searchArticle({ category: helpCollection?.id }).then((res) => {
        setHelpList(res.data);
        setLoading(false);
      });
    }
  }, [helpCollection]);

  return (
    <Wrapper>
      <Container>
        <Breadcrumb
          className='help-collection-breadcrumb my-breadcrumb'
          separator='>'
          items={[
            { title: <Link href={urlPage.help}>{t('help_center')}</Link> },
            { title: helpCollection?.title },
          ]}
        />

        <div className='help-collection-content'>
          <TextLineCamp line={1} className='help-collection-title'>
            {helpCollection?.title}
          </TextLineCamp>
          <TextLineCamp line={2} className='help-collection-description'>
            {helpCollection?.description}
          </TextLineCamp>
          <div className='help-collection-article-list'>
            {loading ? (
              <Skeleton />
            ) : (
              <>
                {helpList?.map((article) => {
                  const link = urlPage.helpDetail
                    .replace(
                      '{collection-slug}',
                      `${changeToSlug(article.market_category_help.title)}--${
                        article.market_category_help.id
                      }`
                    )
                    .replace('{article-slug}', `${changeToSlug(article.title)}--${article.id}`);
                  return (
                    <ArticleCard key={article.id}>
                      <Link href={link}>
                        <TextLineCamp className='help-collection-article-card-title' line={2}>
                          {article.title}
                        </TextLineCamp>
                      </Link>
                    </ArticleCard>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};
export default HelpCollection;
