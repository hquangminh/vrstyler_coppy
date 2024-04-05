import { useCallback, useEffect, useState } from 'react';
import { Pagination, Skeleton, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import sellerServices from 'services/seller-services';

import ProductCard from 'components/Fragments/ProductCard';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import { ProductModel } from 'models/product.model';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  sellerId: string | string[] | undefined;
};

const ContentComponent = (props: Props) => {
  const { sellerId } = props;
  const { langLabel } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<{ total: number; data: ProductModel[] }>({
    total: 0,
    data: [],
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

  const fetchProduct = useCallback(
    async (id: string, pageSize: number) => {
      setLoading(true);
      try {
        const resp = await sellerServices.getProduct(id, pageSize, (page - 1) * pageSize);

        if (!resp.error) {
          setProducts({ total: resp.total, data: resp.data });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    if (sellerId) {
      let pageSizeResponsive = window.innerWidth > 992 ? 9 : 10;

      setPageSize(pageSizeResponsive);
      fetchProduct(sellerId as string, pageSizeResponsive);
    }
  }, [sellerId, fetchProduct]);

  return (
    <ContentComponent_wrapper>
      {loading ? (
        <Skeleton active paragraph={{ rows: 0 }} />
      ) : (
        <h2
          className='title'
          dangerouslySetInnerHTML={{
            __html: langLabel[
              products.total > 1 ? 'seller_profile_model_counters' : 'seller_profile_model_counter'
            ].replace('{{count}}', `<span>${products.total || 0}</span>`),
          }}
        />
      )}

      <Model_wrapper>
        {loading && (
          <>
            <Spin className='custom__spin' />

            <div className='overlay__spin' />
          </>
        )}

        {!loading && !products?.total ? <ResultEmpty description='No Results' /> : ''}

        <div className='cart__box'>
          {products.data?.length > 0
            ? products.data?.map((item) => (
                <ProductCard
                  key={item.id}
                  pageName='profile-seller'
                  data={item}
                  className='profile__seller--card'
                />
              ))
            : ''}
        </div>

        <div className='text-center mt-5'>
          {products?.total > pageSize && (
            <Pagination
              pageSize={pageSize}
              total={products?.total}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
            />
          )}
        </div>
      </Model_wrapper>
    </ContentComponent_wrapper>
  );
};

const ContentComponent_wrapper = styled.div`
  h2.title {
    font-size: 24px;
    color: var(--color-gray-11);

    span {
      color: var(--color-primary-700);
      font-weight: 600;
    }

    &::after {
      content: '';
      display: block;
      border-bottom: 1px solid var(--color-gray-4);
      margin: 15px -20px 0 -20px;
    }
  }

  .cart__box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px 20px;

    margin-top: 20px;
  }

  .btn__viewall {
    min-width: 224px;
    height: 41px;
    margin-top: 20px;
    background: var(--color-primary-700);
    border-radius: 4px;
    font-weight: 500;
  }

  .profile__seller--card {
    .product_name {
      font-weight: 400;

      a {
        font-size: 14px;
        color: var(--color-gray-11);
      }
    }

    .product_image {
      aspect-ratio: 313 / 235;
    }

    .product_content {
      min-height: 41px;
      padding: 10px;
      background-color: var(--color-gray-3);
    }
  }

  .ant-pagination-item {
    color: var(--color-primary-700);
  }

  ${maxMedia.medium} {
    .cart__box {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  ${maxMedia.small} {
    .cart__box {
      grid-template-columns: 100%;
    }
  }
`;

const Model_wrapper = styled.div`
  min-height: 300px;
  position: relative;

  .custom__spin {
    position: absolute !important;
    z-index: 2;
  }

  .overlay__spin {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.4;
    background-color: #fff;
    transition: 0.3s;
    z-index: 2;
  }
`;

export default ContentComponent;
