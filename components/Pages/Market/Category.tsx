import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useSelector } from 'react-redux';
import { AppState } from 'store/type';

import styled from 'styled-components';
import { Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';

import { changeToSlug, createFakeArray } from 'common/functions';
import { imgAvailable } from 'common/constant';

import HeaderSection from './Fragments/HeaderSection';

import { Container } from 'styles/__styles';
import { ChangeRemMobileToPC, maxMedia } from 'styles/__media';

const dataFake = createFakeArray({ id: '', title: '' }, 14);

const Category: React.FC = () => {
  const { langLabel } = useLanguage();

  const [isLoading, setLoading] = useState<boolean>(true);
  const categories = useSelector((state: AppState) => state.web.categories);

  useEffect(() => {
    if (categories) setLoading(false);
  }, [categories]);

  return (
    <Wrapper>
      <Container>
        <HeaderSection
          title={langLabel.homepage_category_title}
          caption={langLabel.homepage_category_caption}
        />

        <Spin spinning={isLoading}>
          <List className='hide-scrollbar'>
            {isLoading
              ? dataFake.map((_, index) => {
                  return <div key={index} className='grid__item' />;
                })
              : categories?.map((cate) => (
                  <Link
                    key={cate.id}
                    href={isLoading ? '#' : `/explore/${changeToSlug(cate.title)}--${cate.id}`}
                    legacyBehavior>
                    <a className='grid__item'>
                      {cate?.icon && (
                        <Image
                          src={cate.icon ?? imgAvailable}
                          alt="Category's logo"
                          loading='lazy'
                          width={80}
                          height={80}
                        />
                      )}
                      {cate?.title && <h3 className='description'>{cate.title}</h3>}
                    </a>
                  </Link>
                ))}
          </List>
        </Spin>
      </Container>
    </Wrapper>
  );
};

export default Category;

export const Wrapper = styled.section`
  padding: 100px 0;

  ${maxMedia.small} {
    padding: 50px 0;
  }

  .subtitle {
    margin-bottom: 0;
    margin-top: 0.5rem;
    font-size: 1.6rem;
    color: var(--color-gray-9);
  }
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  margin-top: 40px;
  overflow-x: auto;

  .grid__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    aspect-ratio: 1/1;
    padding: 10px;
    border-radius: 10px;
    transition: all 200ms ease-in-out;
    text-align: center;

    &:hover {
      background-color: var(--color-primary-50);
    }

    img {
      display: inline-block;
      width: 80px;
      height: 80px;
    }

    .description {
      font-size: 14px;
      line-height: 2.4rem;
      color: var(--color-gray-11);
    }
  }

  ${maxMedia.medium} {
    gap: 0;
    margin: 0 -20px;
    margin-top: ${ChangeRemMobileToPC('medium', 2)};
    padding-left: 20px;
    padding-right: 20px;

    .grid__item {
      width: 145px;
      aspect-ratio: 1 / 1;

      img {
        width: 65px;
        height: 65px;
      }
    }
  }

  &::-webkit-scrollbar {
    width: 0;
  }
`;
