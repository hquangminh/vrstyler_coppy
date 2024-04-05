import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Breadcrumb, Button, ConfigProvider, Dropdown, Flex, Input, Spin, theme } from 'antd';
import type { MenuProps } from 'antd';

import useDebounce from 'hooks/useDebounce';
import useLanguage from 'hooks/useLanguage';
import { useClickOutside } from 'hooks/useClickOutside';

import { changeToSlug, convertToHighlightText } from 'common/functions';
import urlPage from 'constants/url.constant';
import helpCenterServices from 'services/helpCenter-services';

import Icon from 'components/Fragments/Icons';

import { HelpModel } from 'models/help.models';

import styled from 'styled-components';
import { Container, TextLineCamp } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const Wrapper = styled.section`
  .help-center-banner-content {
    position: relative;
    padding: 36px 50px;
    border-radius: 16px;
    color: #fff;
    background-color: #2b5ca6;
    background-image: url(/static/images/help-center/banner-icon.png);
    background-repeat: no-repeat;
    background-position: center right 100px;

    ${maxMedia.custom(768)} {
      padding-bottom: 50px;
      background-size: 150px auto;
      background-position: bottom 50px right 50px;
    }

    ${maxMedia.small} {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 95px 20px 50px;
      background-size: 80px auto;
      background-position: top 20px left 20px;
    }
  }
  .help-center-title {
    font-size: 40px;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;

    ${maxMedia.small} {
      font-size: 24px;
    }
  }
  .help-center-banner-caption {
    font-size: 16px;
    font-weight: 300;
    ${maxMedia.small} {
      font-size: 12px;
      text-align: center;
      br {
        display: none;
      }
    }
  }
  .help-center-btn-contact {
    margin-top: 20px;
    padding: 5px 48px;
    height: 41px;
    font-weight: 500;
  }
  .help-center-search {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 610px;
    max-width: calc(100% - 40px);
    height: 51px;
    padding: 4px 15px;

    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.1);
    .ant-input-prefix {
      margin-right: 8px;
      .my-icon {
        font-size: 20px;
      }
    }
    .ant-input {
      color: var(--color-gray-7);
    }
  }
`;
const GroupSearch = styled.div`
  .ant-dropdown {
    min-width: 100% !important;
    max-width: 100%;
  }
  .ant-dropdown-menu-item:not(:last-child) {
    border-bottom: 1px solid #e3e3e8;
  }
  .my-scrollbar {
    max-height: 35vh;
    transition: overflow 0.3s ease;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #e3e3e8;
      border-radius: 10px;
    }
  }
`;
const ArticleSearchItem = styled.div`
  p {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #1890ff;
    &:last-child {
      color: #7f7f8d;
    }
    .hl {
      font-weight: 600;
    }
  }
`;
const ResultNotFound = styled(Flex)`
  height: 100px;
  padding: 20px;
  color: var(--color-gray-7);
`;

const HelpCenterBanner = () => {
  const router = useRouter();
  const { token } = theme.useToken();
  const { langLabel, langCode } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [articles, setArticles] = useState<HelpModel[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const refSearch = useRef<HTMLDivElement>(null);
  const debouncedKeywords = useDebounce<string>(keyword, 500);

  useClickOutside(refSearch, () => setVisible(false));

  const onSearchArticle = useCallback(async () => {
    setLoading(true);
    setArticles([]);
    await helpCenterServices.searchArticle({ title: debouncedKeywords }).then((res) => {
      setArticles(res.data || []);
      setVisible(!res.error);
    });
    setLoading(false);
  }, [debouncedKeywords]);

  useEffect(() => {
    if (debouncedKeywords) onSearchArticle();
    setVisible(debouncedKeywords.length > 0);
  }, [debouncedKeywords, onSearchArticle]);

  const searchResult: MenuProps['items'] = articles.map(({ id, title, market_category_help }) => {
    const articleLink = urlPage.helpDetail
      .replace(
        '{collection-slug}',
        changeToSlug(market_category_help.title) + '--' + market_category_help.id
      )
      .replace('{article-slug}', changeToSlug(title) + '--' + id);

    return {
      key: id,
      label: (
        <ArticleSearchItem>
          <TextLineCamp
            line={1}
            dangerouslySetInnerHTML={{ __html: convertToHighlightText(title, debouncedKeywords) }}
          />
          <ConfigProvider
            theme={{
              components: {
                Breadcrumb: {
                  itemColor: 'var(--color-gray-7)',
                  lastItemColor: 'var(--color-gray-7)',
                },
              },
            }}>
            <Breadcrumb
              separator='>'
              items={[{ title: langLabel.help_center }, { title: market_category_help.title }]}
            />
          </ConfigProvider>
        </ArticleSearchItem>
      ),
      onClick: () => router.push(articleLink),
    };
  });

  const contentStyle: CSSProperties = {
    maxHeight: 300,
    overflowY: 'auto',
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <Wrapper>
      <Container>
        <div className='help-center-banner-content'>
          <h1 className='help-center-title'>{langLabel.help_center_title}</h1>
          <p
            className='help-center-banner-caption'
            dangerouslySetInnerHTML={{ __html: langLabel.help_center_caption }}
          />
          <Button className='help-center-btn-contact'>
            <Link href={`/${langCode}/contact-us`}>{langLabel.contact_us}</Link>
          </Button>

          <GroupSearch ref={refSearch}>
            <ConfigProvider
              theme={{
                token: {
                  borderRadiusLG: 0,
                  borderRadiusSM: 0,
                  boxShadowSecondary: 'none',
                  motionDurationMid: '0s',
                  paddingXXS: 0,
                },
                components: { Dropdown: { paddingBlock: 12 } },
              }}>
              <Dropdown
                open={visible}
                trigger={['click']}
                placement='bottom'
                overlayStyle={{ backgroundColor: 'none' }}
                autoAdjustOverflow={false}
                menu={{ items: searchResult }}
                dropdownRender={(menu) => {
                  if (loading)
                    return (
                      <Spin tip='Searching...' style={contentStyle}>
                        <div style={{ height: 100 }} />
                      </Spin>
                    );
                  return (
                    <div style={contentStyle} className='my-scrollbar'>
                      {articles.length > 0 && menu}
                      {articles.length === 0 && (
                        <ResultNotFound align='center' justify='center'>
                          {langLabel.help_center_search_not_found}
                        </ResultNotFound>
                      )}
                    </div>
                  );
                }}
                getPopupContainer={(triggerNode) => triggerNode || document.body}>
                <Input
                  className='help-center-search'
                  placeholder={langLabel.help_center_search_placeholder}
                  bordered={false}
                  prefix={<Icon iconName='search' style={{ width: 20 }} />}
                  onClick={(e) => e.preventDefault()}
                  onFocus={() => setVisible(debouncedKeywords.length > 0)}
                  onChange={(e) => setKeyword(e.target.value.trim())}
                />
              </Dropdown>
            </ConfigProvider>
          </GroupSearch>
        </div>
      </Container>
    </Wrapper>
  );
};

export default HelpCenterBanner;
