import { Card, Col, Row } from 'antd';

import DecorationSectionAction from './SectionAction';

import { ProductModel, ProductStatus } from 'models/product.model';

import styled from 'styled-components';
import MyImage from 'components/Fragments/Image';
interface ToolCategoryProductProps {
  focused?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  listProduct?: { market_item: ProductModel }[];
}

const ToolCategoryProduct = (props: ToolCategoryProductProps) => {
  return (
    <Wrapper className={'decoration-section' + (props.focused ? ' active' : '')}>
      {props.listProduct ? (
        <div className='productList' onClick={props.onSelect}>
          <Row gutter={20}>
            {props.listProduct.slice(0, 3).map(({ market_item: item }) => {
              const isActive =
                (!item.status || item.status === ProductStatus.ACTIVE) &&
                (!item.market_item_categories ||
                  item.market_item_categories.some((i) => i.market_category.status));
              return (
                <Col key={item.id} span={8}>
                  <Card
                    bordered={false}
                    cover={<MyImage src={item.image} alt='' width={200} height={150} />}
                    style={{ opacity: isActive ? 1 : 0.5 }}>
                    <div className='toolbar-category-item'>
                      <div className='title-item'>
                        <p className='text-truncate'>{item.title}</p>
                      </div>
                      <p className='toolbar-category-item-price'>
                        {item.price ? '$' + item.price : 'Free'}
                      </p>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ) : (
        <div className='productList_Empty' onClick={props.onSelect}>
          <Row gutter={16}>
            {Array.from({ length: 3 }).map((_item, index) => {
              return (
                <Col span={8} key={index}>
                  <Card
                    cover={
                      <img
                        alt='img-product'
                        src='/static/images/showroom/decoration/toolbar-category-product-thumbnail-empty.jpg'
                      />
                    }
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      <DecorationSectionAction onDelete={props.onDelete} />
    </Wrapper>
  );
};

export default ToolCategoryProduct;

const Wrapper = styled.div<{ focused?: boolean; aspect?: number }>`
  background-color: #fff;
  text-align: center;
  transition: all 100ms ease-in-out;
  position: relative;
  cursor: pointer;

  box-shadow: 0 0 0 2px ${({ focused }) => (focused ? 'var(--color-primary-500)' : 'transparent')};
  .slick-track {
    display: flex;
  }
  .slick-slide {
    margin: 0 10px;
  }
  .slick-list {
    margin: 0 -10px;
  }
  .ant-col {
    border: none;
  }

  .ant-card-cover img {
    border-radius: 0;
  }
  .ant-card-body {
    background-color: var(--color-gray-3);
    padding: 0;
    width: 200px;
    height: 100%;
    border-radius: 0;
    .toolbar-category-item {
      padding: 10.5px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-item {
        width: 120px;
        display: flex;
        justify-content: flex-start;
        .text-truncate {
          color: var(--color-gray-9);
          font-size: 10px;
          font-weight: 400;
        }
      }
      .toolbar-category-title-empty {
        color: var(--color-gray-7);
        font-size: 10px;
        font-weight: 400;
      }
      .toolbar-category-item-price {
        color: var(--color-primary-700);
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
  .productList_Empty {
    padding: 40px;

    .ant-card-body {
      background-color: var(--color-gray-3);
      padding: 0;
    }

    .ant-card-cover {
      img {
        height: 166px;
        width: 100%;
        transition: all 100ms ease-in-out;
        border: none;
      }
    }
  }

  .productList {
    padding: 16px 0;
  }
`;
