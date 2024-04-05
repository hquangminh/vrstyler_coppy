import { Skeleton } from 'antd';

import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px 0;
  .explore-product-skeleton-item {
    .explore-product-skeleton-avatar {
      width: 100%;
      aspect-ratio: 4 / 3;
      .ant-skeleton-avatar {
        width: 100%;
        height: 100%;
      }
    }
    .explore-product-skeleton-title {
      margin-top: 5px;
      .ant-skeleton-paragraph li {
        width: 100% !important;
        height: 30px;
        border-radius: 0;
      }
    }
  }
`;

const ProductSkeleton = ({ length }: { length: number }) => {
  return (
    <Wrapper className='ProductList__Grid'>
      {Array.from({ length }).map((_, index) => {
        return (
          <div className='explore-product-skeleton-item' key={index}>
            <Skeleton.Avatar className='explore-product-skeleton-avatar' active shape='square' />
            <Skeleton
              className='explore-product-skeleton-title'
              active
              title={false}
              paragraph={{ rows: 1 }}
            />
          </div>
        );
      })}
    </Wrapper>
  );
};
export default ProductSkeleton;
