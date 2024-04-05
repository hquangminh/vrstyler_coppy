import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import styled from 'styled-components';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { changeToSlug } from 'common/functions';
import homepageServices from 'services/homepage-services';
import urlPage from 'constants/url.constant';

import HeaderSection from './Fragments/HeaderSection';

import { ProductModel } from 'models/product.model';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const FeaturedProducts = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [products, setProduct] = useState<{ id: string; market_item: ProductModel }[]>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const { error, data } = await homepageServices.getFeatured();
        if (!error) setProduct(data);
        setLoading(false);
      } catch (error) {}
    };

    getProduct();
  }, []);

  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <Container>
        <HeaderSection
          title={langLabel.homepage_featured_title}
          caption={langLabel.homepage_featured_caption}
        />

        {isLoading ? (
          <Spin
            className='mt-5'
            indicator={<LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />}
          />
        ) : (
          <List className='hide-scrollbar' $itemCount={products?.length || 3}>
            {products?.map((product) => {
              const link = urlPage.productDetail.replace(
                '{slug}',
                changeToSlug(product.market_item.title) + '--' + product.market_item.id
              );
              return (
                <Item key={product.id} onClick={() => router.push(link)}>
                  <Image
                    fill
                    src={product.market_item.image}
                    alt={product.market_item.title}
                    title={product.market_item.title}
                    loading='lazy'
                  />
                  <div className='ProductFeatured__Content'>
                    <ul className='ProductFeatured__Characteristics'>
                      {product.market_item.is_animated && <li>Animated</li>}
                      {product.market_item.is_rigged && <li>Rigged</li>}
                      {product.market_item.is_pbr && <li>PBR</li>}
                    </ul>
                  </div>
                </Item>
              );
            })}
          </List>
        )}

        {products && (
          <Button type='primary'>
            <Link href='/explore/all'>{langLabel.btn_explore_all || 'Export All'}</Link>
          </Button>
        )}
      </Container>
    </Wrapper>
  );
};
export default FeaturedProducts;

const Wrapper = styled.section`
  padding: 100px 0 100px;
  background-color: var(--color-primary-25);
  text-align: center;

  ${maxMedia.small} {
    padding: 50px 0 50px;
  }

  .ant-btn {
    width: 212px;
    height: 48px;
    margin-top: 60px;

    font-size: 14px;
    font-weight: 600;
    border: none;

    ${maxMedia.small} {
      margin-top: 30px;
    }
  }
`;

const List = styled.div<{ $itemCount: number }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 2rem;

  margin-top: 4rem;

  ${maxMedia.small} {
    grid-template-columns: repeat(
      ${(props) => (props.$itemCount < 3 ? props.$itemCount : 3)},
      300px
    );
    gap: 20px;
    margin: 0 -20px;
    padding: 20px;
    overflow-x: auto;
  }
`;

export const Item = styled.div`
  position: relative;
  border-radius: 1rem;
  background-color: rgba(var(--color-gray-rgb-11), 20%);
  aspect-ratio: 400 / 298;
  overflow: hidden;
  cursor: pointer;

  &:nth-child(2),
  &:nth-child(4),
  &:nth-child(5) {
    aspect-ratio: 400 / 547;

    grid-row: span 2;
  }

  &:hover .ProductFeatured__Content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  img {
    height: 100%;
    object-fit: cover;
  }

  .ProductFeatured__Content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(50%);
    opacity: 0;
    visibility: hidden;
    transition: all 250ms ease-in-out;

    .ProductFeatured__Characteristics {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 15px;
      list-style: none;

      li {
        padding: 7px;
        border-radius: 7px;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-caption);
        background-color: var(--color-primary-100);
      }
    }
  }
`;
