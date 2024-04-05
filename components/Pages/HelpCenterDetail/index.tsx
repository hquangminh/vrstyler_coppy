import Link from 'next/link';

import { Breadcrumb } from 'antd';

import urlPage from 'constants/url.constant';
import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';
import { changeToSlug } from 'common/functions';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import DividerMain from 'components/Fragments/DividerMain';
import RenderHtmlEditor from 'components/Fragments/RenderHTMLEditor';

import { HelpModel } from 'models/help.models';

import styled from 'styled-components';
import { Container, TextLineCamp } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

type HelpCategory = {
  title: string;
  id: string;
};
type Props = {
  data: HelpModel;
  helpCategory: HelpCategory[];
};

const HelpCenterArticleComponent = (props: Props) => {
  const { width } = useWindowSize();
  const { langCode, t } = useLanguage();

  const collectionName = props.data.market_category_help.title;
  const collectionNamePost = props.helpCategory.map(
    (item) => changeToSlug(item.title) + '--' + item.id
  );
  const collectionLink = urlPage.helpCenterCollection.replace(
    '{slug}',
    changeToSlug(collectionName) + '--' + props.data.market_category_help.id
  );

  return (
    <Wrapper>
      <Container>
        <Breadcrumb
          className='help-article-breadcrumb my-breadcrumb'
          separator='>'
          items={[
            { title: <Link href={urlPage.help}>{t('help_center')}</Link> },
            { title: <Link href={collectionLink}>{collectionName}</Link> },
            { title: props.data.title },
          ]}
        />
        <div className='help_frame'>
          <div className='help_left'>
            <h1 className='Article__Title'>{props.data.title}</h1>
            <p className='help_time'>
              <Moment date={props.data.createdAt} langCode={langCode} fromNow />
            </p>
            <div className={width >= 992 ? 'help_background' : undefined}>
              <article className='Article__Content'>
                <RenderHtmlEditor html={props.data.content} />
              </article>
            </div>
          </div>
          {width <= 990 && (
            <div className='icon__mobile' style={{ display: 'block' }}>
              <DividerMain height={96} />
            </div>
          )}
          {props.helpCategory.length !== 0 && (
            <div className='help_right'>
              <h3 className='Help_Right__Title'>{t('blog_related_post_label')}</h3>
              {props.helpCategory.map((item, index) => {
                const postSlug = collectionNamePost[index];
                const collectionLinkPost = `${collectionLink}/${postSlug}`;

                return (
                  <div className='Help_Right_List' key={item.id}>
                    <TextLineCamp line={2}>
                      <Link href={collectionLinkPost} title={item.title}>
                        {item.title}
                      </Link>
                    </TextLineCamp>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {width > 992 && (
          <Link href={collectionLink} legacyBehavior>
            <a className='Go__HelpCenter'>
              <Icon iconName='arrow-left-line' />
              {t('help_center_back_to_collection').replace('{{collection_name}}', collectionName)}
            </a>
          </Link>
        )}
      </Container>
    </Wrapper>
  );
};
export default HelpCenterArticleComponent;

const Wrapper = styled.main`
  padding-bottom: 50px;

  .help-article-breadcrumb {
    padding: 24px 0;

    ${maxMedia.medium} {
      padding: 15px 0;
    }
  }
  .help_frame {
    display: grid;
    grid-template-columns: 1fr 266px;
    gap: 57px;

    ${maxMedia.medium} {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .help_left {
      width: 100%;
      .Article__Title {
        font-size: 20px;
        font-weight: 500;
        color: var(--text-title);
        word-break: break-word;
        line-height: normal;
        ${maxMedia.medium} {
          font-size: 24px;
        }
      }

      .help_time {
        color: #7f7f8d;
        font-size: 14px;
        margin-top: 8px;
        margin-bottom: 16px;
      }

      .background_help {
        padding: 32px;
      }
    }
  }
  .help_right {
    ${maxMedia.medium} {
      margin-left: 8.5px;
    }
    .Help_Right__Title {
      font-size: 18px;
      font-weight: 500;
      line-height: 1.4;
      color: #161723;
    }
    .Help_Right_List {
      display: block;
      margin-top: 16px;
      ${maxMedia.medium} {
        margin-top: 8px;
      }
      a {
        display: inline-block;
        font-size: 14px;
        line-height: 1.4;
        color: #424153;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .help_background {
    background-color: #f4f5f8;
  }
  .Article__Content {
    margin-top: 30px;
    padding: 32px;

    ${maxMedia.medium} {
      padding: 0;
      margin-top: 15px;
    }
  }
  .Go__HelpCenter {
    display: inline-flex;
    align-items: center;

    margin-top: 60px;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    color: var(--color-gray-7);

    .my-icon {
      font-size: 24px;
      margin-right: 8px;
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
