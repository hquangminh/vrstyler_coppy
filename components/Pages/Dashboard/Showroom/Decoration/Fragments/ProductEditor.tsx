import { useState } from 'react';
import { Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { isUUID } from 'common/functions';

import ProductModal from './ProductModal';
import MyImage from 'components/Fragments/Image';

import { ProductModel, ProductStatus } from 'models/product.model';
import { ShowroomDecorationModel } from 'models/showroom.models';

import styled from 'styled-components';

type Props = {
  themeId: string;
  data: ShowroomDecorationModel;
  onFinish?: (data: ShowroomDecorationModel) => void;
  setShouldPromptUnload: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ProductEditor = (props: Props) => {
  const { t } = useLanguage();
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const type = 'product-section';

  const handleClose = () => {
    setOpenSetting(false);
    props.setShouldPromptUnload((prevState) => {
      if (prevState !== undefined) return undefined;
      return prevState;
    });
  };

  const handleOpen = () => {
    setOpenSetting(true);
    props.setShouldPromptUnload((prevState) => {
      if (prevState === undefined) return 'inProgress';
      return prevState;
    });
  };

  const onSubmitFail = (productUnavailable: ProductModel[]) => {
    if (props.data && isUUID(props.data.id) && props.onFinish) {
      const market_showroom_section_products = props.data.market_showroom_section_products?.map(
        (i) => {
          const prodUnavailable = productUnavailable.find((p) => p.id === i.market_item.id);
          if (prodUnavailable) return { market_item: { ...i.market_item, ...prodUnavailable } };
          else return i;
        }
      );
      props.onFinish({ ...props.data, market_showroom_section_products });
    }
  };

  return (
    <>
      <ProductWrapper>
        <div className='decoration-product-title'>
          {t('dashboard_theme_decoration_product_carousel_title')}
        </div>
        <div className='decoration-product-caption'>
          {t(
            'dashboard_theme_decoration_product_carousel_description',
            'Featured Products are specifically selected and prominently displayed on an e-commerce website or sales funnel to attract customer attention, improve product visibility, and increase sales for showroom owners.'
          )}
        </div>
        <div className='decoration-product-editor-setting'>
          <p>{t('dashboard_theme_decoration_product_carousel_request_title', 'Request:')}</p>
          <ul
            dangerouslySetInnerHTML={{
              __html: t(
                'dashboard_theme_decoration_product_carousel_request_description',
                '<li>Choose from 4-8 products.</li>'
              ),
            }}
          />
        </div>
        <div className='decoration-product-setting'>
          <p>{t('product', 'Products')}:</p>
        </div>
        {props.data.market_showroom_section_products ? (
          <div
            className={
              props.data.market_showroom_section_products.length > 2
                ? 'my-scrollbar '
                : 'scrollbar_one'
            }>
            {props.data.market_showroom_section_products?.map(({ market_item: item }) => {
              const isActive =
                (!item.status || item.status === ProductStatus.ACTIVE) &&
                (!item.market_item_categories ||
                  item.market_item_categories.some((i) => i.market_category.status));
              return (
                <div key={item.id} style={{ opacity: isActive ? 1 : 0.5 }}>
                  <div className='list_product'>
                    <MyImage
                      className='img-avatar'
                      src={item.image}
                      alt='Product Image'
                      width={56}
                      height={42}
                    />
                    <div>
                      <p className='text-truncate'>{item.title}</p>
                    </div>
                  </div>
                  <Divider />
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <Button
              className='UploadModel__BtnAddFile'
              icon={<PlusOutlined />}
              onClick={() => handleOpen()}>
              {t('dashboard_theme_decoration_product_carousel_add_product', 'Add Products')}
            </Button>
            <Divider />
          </>
        )}

        <div className='edit-product'>
          <Button
            type='primary'
            className='btn_edit'
            disabled={!props.data.market_showroom_section_products}
            onClick={() => handleOpen()}>
            {t('btn_edit', 'Edit')}
          </Button>
        </div>
      </ProductWrapper>
      <ProductModal
        type={type}
        selected={props.data.market_showroom_section_products?.map((i) => i.market_item)}
        open={openSetting}
        themeId={props.themeId}
        data={props.data}
        onClose={handleClose}
        onFinish={props.onFinish}
        onSubmitFail={onSubmitFail}
      />
    </>
  );
};

export default ProductEditor;

const ProductWrapper = styled.div`
  position: sticky;
  top: 50px;

  padding: 24px;
  background-color: var(--color-gray-4);

  .decoration-product-title {
    font-size: 20px;
    font-weight: 500;
    color: var(--color-gray-11);
    margin-bottom: 4px;
  }
  .decoration-product-caption {
    margin: 4px 0 16px 0;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray-9);
  }
  .decoration-product-editor-setting {
    p {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-gray-9);
      margin-bottom: 16px;
    }
    ul {
      list-style-type: disc;
      padding-left: 24px;
      li {
        font-size: 14px;
        font-weight: 400;
        color: var(--color-gray-9);
      }
    }
  }
  .decoration-product-setting {
    p {
      margin: 16px 0 8px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--color-gray-9);
    }
  }
  .edit-product {
    display: flex;
    justify-content: right;
    margin-top: 16px;
    margin-bottom: 16px;
    .--active {
      width: 122px;
      height: 41px;
      color: #369ca5;
      border: 1px solid #369ca5;
      background-color: var(--color-gray-4);
    }
    .btn_edit {
      width: 122px;
      height: 41px;
    }
  }
  .ant-divider-horizontal {
    height: 1px;
    margin: 0;
  }
  .my-scrollbar {
    overflow-y: auto;
    width: 100%;
    display: grid;
    gap: 16px;
    height: 210px;
    cursor: pointer;

    .list_product {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .img-avatar {
        border-radius: 4px;
        object-fit: cover;
      }
      .text-truncate {
        max-width: 220px;
      }
      p {
        margin-left: 16px;
      }
    }
  }

  .scrollbar_one {
    .ant-divider-horizontal {
      height: 14px;
    }
    .list_product {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .img-avatar {
        border-radius: 4px;
      }
      .text-truncate {
        max-width: 220px;
      }
      p {
        margin-left: 16px;
      }
    }
  }

  .UploadModel__BtnAddFile {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 25px 0 10px;
    width: 372px;
    color: var(--color-primary-700);
    border: solid 1px var(--color-primary-700);
    background-color: var(--color-gray-4);
    .anticon {
      font-size: 12px;
    }
  }
`;
