import { useRouter } from 'next/router';
import Link from 'next/link';
import useLanguage from 'hooks/useLanguage';

import { changeToSlug } from 'common/functions';

import { BlogCategory } from 'models/blog.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  highlight?: string;
  categoryList?: BlogCategory[];
};

const BlogCategoryList = (props: Props) => {
  const router = useRouter();
  const categoryId = router.query.category?.toString().split('--')[1];
  const { langCode, langLabel } = useLanguage();

  return (
    <Wrapper>
      <nav className='navMenu hide-scrollbar'>
        <Link className={!categoryId ? ' --active' : ''} href={`/${langCode}/blog/all`} shallow>
          {langLabel.all}
        </Link>
        {props.categoryList?.map((categoryMenu, index) => {
          return (
            <Link
              key={index}
              className={categoryId === categoryMenu.id ? ' --active' : ''}
              href={`/${langCode}/blog/${changeToSlug(categoryMenu.title)}--${categoryMenu.id}`}
              shallow>
              {categoryMenu.title}
            </Link>
          );
        })}
      </nav>
    </Wrapper>
  );
};
export default BlogCategoryList;

const Wrapper = styled.section`
  ${maxMedia.medium} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${maxMedia.small} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${maxMedia.xsmall} {
    grid-template-columns: 100%;
  }
  .navMenu {
    margin: 76px 0 50px;
    display: flex;
    justify-content: center;
    gap: 30px;
    width: 100%;
    overflow: auto;

    ${maxMedia.medium} {
      margin: 50px auto 30px;
      width: max-content;
      max-width: 100%;
      justify-content: flex-start;
    }
    ${maxMedia.small} {
      margin: 30px auto 30px;
    }

    .--active {
      font-weight: 600;
      color: var(--color-primary-700);
    }
  }
  .navMenu a {
    display: inline-block;
    white-space: nowrap;
    color: var(--color-gray-8);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    text-transform: capitalize;

    &:hover {
      font-weight: 600;
      color: var(--color-primary-700);
    }
    ${maxMedia.medium} {
      padding-top: 10px;
    }
    ${maxMedia.small} {
      padding-top: 10px;
    }
    ${maxMedia.xsmall} {
      padding-top: 10px;
    }
  }
  .navMenu a:hover {
    color: var(--color-primary-700);
  }
`;
