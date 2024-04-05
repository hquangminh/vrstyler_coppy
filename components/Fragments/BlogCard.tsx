import Link from 'next/link';

import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useLanguage from 'hooks/useLanguage';
import { changeToSlug } from 'common/functions';

import MyImage from './Image';
import Moment from './Moment';

import { BlogModel } from 'models/blog.models';

import { maxMedia } from 'styles/__media';

dayjs.extend(relativeTime);

const BlogCard = ({ data }: { data: BlogModel }) => {
  const { langCode } = useLanguage();

  const dataLanguage = data.market_blog_languages[0];

  const linkToDetail = `/blog/${changeToSlug(data.market_category_blog.title)}/${data.slug}`;

  return (
    <Wrapper>
      <div className='site-card-wrapper'>
        <div className='BlogCard__Image'>
          <Link href={linkToDetail}>
            <MyImage fill src={data.image} alt={dataLanguage.title} />
          </Link>
        </div>
        <div className='BlogCard_Info'>
          <div className='BlogCard_Category'>{data.market_category_blog?.title}</div>
          <div className='BlogCard_Time'>
            <Moment date={data.publish_date} langCode={langCode} fromNow />
          </div>
        </div>
        <div className='BlogCard__Title'>
          <h3 title={dataLanguage.title}>
            <Link href={linkToDetail}>{dataLanguage.title}</Link>
          </h3>
        </div>
        <div className='BlogCard__Content'>
          <p>{dataLanguage.sumary}</p>
        </div>
      </div>
    </Wrapper>
  );
};
export default BlogCard;

const Wrapper = styled.div`
  .site-card-wrapper {
    .BlogCard__Image {
      position: relative;
      aspect-ratio: 295 / 187;
      border-radius: 6px;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .BlogCard_Info {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    .BlogCard_Category {
      font-size: 14px;
      font-weight: normal;
      color: var(--color-primary-500);
    }
    .BlogCard_Time {
      font-size: 13px;
      font-weight: 500;
      font-weight: normal;
      color: var(--color-gray-7);
      opacity: 0.6;
    }
    ${maxMedia.small} {
      margin: 5px 0 5px 0;
    }
  }
  .BlogCard__Title {
    h3 a {
      font-size: 18px;
      font-weight: 500;
      line-height: 1.61;
      color: var(--text-title);
      margin: 5px 0 5px 0;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
      &:hover {
        text-decoration: underline;
      }
      ${maxMedia.small} {
        font-size: 16px;
      }
    }
  }
  .BlogCard__Content {
    margin-bottom: 30px;
    p {
      font-size: 14px;
      color: var(--color-gray-8);
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
    }
    ${maxMedia.small} {
      margin: 5px 0 20px 0;
    }
    ${maxMedia.xsmall} {
      margin: 5px 0 20px 0;
    }
  }
`;
