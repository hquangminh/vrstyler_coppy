import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { AxiosError } from 'axios';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Flex,
  Input,
  Modal,
  ModalProps,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { CloseOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import useLanguage from 'hooks/useLanguage';
import { isUUID } from 'common/functions';
import debounce from 'common/functions/debounce';
import showroomServices from 'services/showroom-services';

import Icon from 'components/Fragments/Icons';
import MyImage from 'components/Fragments/Image';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import { ShowroomDecorationModel } from 'models/showroom.models';
import { ProductModel, ProductStatus } from 'models/product.model';

import styled from 'styled-components';

type Props = {
  type?: 'product-section';
  themeId?: string;
  data?: ShowroomDecorationModel;
  open: boolean;
  selected?: ProductModel[];
  checkShowroomCart?: boolean;
  onClose: () => void;
  onFinish?: (data: ShowroomDecorationModel) => void;
  onSubmitFail?: (data: ProductModel[]) => void;
  onFinishCard?: (data: ProductModel[]) => void;
};

const pageSize = 7;

export default function ProductModal(props: Readonly<Props>) {
  const { t, langLabel } = useLanguage();

  const wrapRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<ProductModel[]>([]);
  const [name, setName] = useState<string>();
  const [pageProduct, setPageProduct] = useState(1);
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [productList, setProductList] = useState<{ total: number; data: ProductModel[] }>({
    total: 0,
    data: [],
  });
  const [textSearch, setTextSearch] = useState<string>('');

  const isHasProductInactive = selected.some(
    (i) =>
      i.status !== ProductStatus.ACTIVE ||
      i.market_item_categories?.every((x) => !x.market_category.status)
  );

  const onFetchAllProduct = useCallback(
    async (signal?: AbortSignal) => {
      setLoadingLoad(true);
      try {
        const params = {
          limit: pageSize,
          offset: (pageProduct - 1) * pageSize,
          name: textSearch,
        };
        const resp = await showroomServices.getListShowroomSection(params, { signal });

        setProductList((current) => ({
          data: pageProduct === 1 ? resp.data : [...current.data, ...resp.data],
          total: resp.total,
        }));

        setLoadingLoad(false);
      } catch (error) {
        setLoadingLoad(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textSearch, pageProduct]
  );

  useEffect(() => {
    if (props.open) {
      const controller = new AbortController();
      onFetchAllProduct(controller.signal);
      return () => controller.abort();
    }
  }, [props.open, onFetchAllProduct]);

  useEffect(() => {
    props.open && setSelected(props.selected ?? []);
  }, [props.open, props.selected]);

  const onScroll = async (e: any) => {
    if (pageProduct * pageSize >= productList.total || loadingLoad) return;

    e.persist();
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight + 10 >= scrollHeight) {
      setPageProduct(productList.data.length / 7 + 1);
    }
  };

  const onSelect = (data: ProductModel) => {
    let select = [...selected];
    if (select.some((i) => i.id === data.id)) {
      select.splice(
        select.findIndex((i) => i.id === data.id),
        1
      );
    } else select.push(data);

    setSelected(select);
  };

  const onResetState = () => {
    setPageProduct(1);
    setName(undefined);
    setSelected([]);
    setTextSearch('');
  };

  const modalProps: ModalProps = {
    title: t('dashboard_theme_decoration_product_carousel_add_product', 'Add Products'),
    open: props.open,
    centered: true,
    closable: false,
    width: 688,
    maskClosable: false,
    destroyOnClose: true,
    footer: null,
    getContainer: () => wrapRef.current ?? document.body,
    onCancel: props.onClose,
    afterClose: onResetState,
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      let params: any = { type: 3 };

      params['listItemId'] = selected.map((i) => i.id);
      params['name'] = name;

      if (props.type && props.data && props.themeId) {
        let responseAPI: any;

        if (isUUID(props.data.id)) {
          responseAPI = await showroomServices.updateDecorationSection(
            props.themeId,
            props.data.id,
            params
          );
        } else responseAPI = await showroomServices.addDecorationSection(props.themeId, params);
        if (!responseAPI.error && props.type) {
          if (props.onFinish) props.onFinish(responseAPI.data.market_showroom_section);
          props.onClose();
        }
      } else if (props.onFinishCard) props.onFinishCard(selected);

      setSubmitting(false);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const productUnavailable: ProductModel[] = error.response?.data?.items_unavailable;
        if (productUnavailable && props.onSubmitFail) props.onSubmitFail(productUnavailable);
      }
      setSubmitting(false);
      props.onClose();
    }
  };

  return (
    <Wrapper ref={wrapRef}>
      <Modal {...modalProps}>
        <Divider />
        <InputSearch>
          <Input
            placeholder={t(
              'dashboard_theme_decoration_product_carousel_search_product_placeholder',
              'Enter product name to search'
            )}
            onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
              setPageProduct(1);
              setTextSearch(e.target.value);
            })}
          />

          <div className='modeling-order-list-filter-search-btn'>
            <Icon iconName='search' />
          </div>
        </InputSearch>
        <Divider />

        {selected?.length !== 0 && productList.data.length !== 0 && (
          <>
            <div className='applied_product'>
              <p>
                {t(
                  'dashboard_theme_decoration_product_carousel_add_product_selected',
                  'Selected products'
                )}
              </p>

              <div className='clear' onClick={() => setSelected([])}>
                <p>
                  {t(
                    'dashboard_theme_decoration_product_carousel_add_product_clear_all',
                    'Clear all'
                  )}
                </p>
                <CloseOutlined style={{ fontSize: '10px' }} />
              </div>
            </div>
            <Flex wrap='wrap' className='tag'>
              {selected?.map((item) => {
                const isActive =
                  item.status === ProductStatus.ACTIVE &&
                  item.market_item_categories?.some((i) => i.market_category.status);
                return (
                  <Tag
                    key={item.id}
                    icon={isActive ? undefined : <InfoCircleTwoTone twoToneColor={gold[5]} />}
                    closable
                    onClose={() => onSelect(item)}>
                    <p className='text-truncate'>{item.title}</p>
                  </Tag>
                );
              })}
            </Flex>
            {isHasProductInactive && (
              <Typography.Text type='warning' italic>
                * {t('dashboard_card_product_inactive_warning')}
              </Typography.Text>
            )}
            <Divider className='line_bottom_select' />
          </>
        )}

        <div className='vertical'>
          {loadingLoad && pageProduct === 1 ? (
            <div className='loading__init'>
              <Spin />
            </div>
          ) : (
            <>
              {productList.data?.length > 0 ? (
                <>
                  {props.type && (
                    <div className='input_section'>
                      <Input
                        name={name}
                        placeholder={t('dashboard_theme_decoration_product_carousel_section_name')}
                        style={{ height: '40px' }}
                        onChange={(e) => setName(e.target.value)}
                        defaultValue={props.type ? props.data?.name : ''}
                      />
                    </div>
                  )}

                  <div onScroll={onScroll} className='my-scrollbar'>
                    {productList?.data?.map((item) => {
                      const disable = props.type
                        ? selected.length === 8 && !selected?.some((i) => i.id === item.id)
                        : selected.length === 3 && !selected?.some((i) => i.id === item.id);

                      return (
                        <div
                          key={item.id}
                          className='product_item'
                          onClick={() => {
                            if (!disable) onSelect(item);
                          }}>
                          <div className='product_left'>
                            <MyImage
                              src={item?.image}
                              alt='Thumbnail'
                              width={74.5}
                              height={56}
                              style={{ objectFit: 'cover', borderRadius: 4 }}
                            />
                            <p className='text-truncate'>{item?.title}</p>
                          </div>
                          <div className='product_right'>
                            <Checkbox
                              checked={selected?.some((i) => i.id === item.id)}
                              disabled={disable}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {productList.data.length < productList.total && (
                      <div className='text-center mt-4'>
                        <Spin />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <ResultEmpty
                  customStyle={{
                    padding: '40px 50px',
                    height: '350px',
                  }}
                  title={t(
                    'dashboard_theme_decoration_product_carousel_search_product_empty_title',
                    'No products found'
                  )}
                  description={t(
                    'dashboard_theme_decoration_product_carousel_search_product_empty_description',
                    'Please check your product listing again or try changing your search keywords'
                  )}
                />
              )}
            </>
          )}
          <Divider className='line_bottom_select' />

          <Footer>
            <p className='product_caption'>
              {props.checkShowroomCart
                ? t('dashboard_card_product_select_counter')
                : langLabel.dashboard_theme_decoration_product_carousel_add_product_select_counter}
            </p>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    contentFontSizeLG: 14,
                    defaultColor: '#369ca5',
                    defaultBorderColor: '#369ca5',
                  },
                },
              }}>
              <Space size={16}>
                <Button size='large' disabled={submitting} onClick={props.onClose}>
                  {t('btn_cancel', 'Cancel')}
                </Button>

                <Button
                  type='primary'
                  size='large'
                  loading={submitting}
                  onClick={() => onSubmit()}
                  disabled={selected.length < (props.type ? 4 : 3)}>
                  {t('btn_confirm', 'Confirm')}
                </Button>
              </Space>
            </ConfigProvider>
          </Footer>
        </div>
      </Modal>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  .ant-modal-content {
    padding: 32px 24px 24px;
    border-radius: 5px;
    overflow: hidden;
  }
  .ant-modal-header {
    margin: 0;
  }
  .ant-modal-title {
    margin-bottom: 32px;
  }

  .ant-modal-footer {
    padding: 16px 0 0;
  }
  .ant-upload {
    &:has(.ant-upload-drag-container .decoration-banner-editor-upload-icon) {
      aspect-ratio: 372/200;
    }
    .ant-upload-btn {
      padding: 0;
    }
  }

  .input_section {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 220px;
  }
  .line_bottom_select {
    margin: 15px 0 !important;
  }
  .ant-divider {
    margin: 15px 0;
  }

  .applied_product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    p {
      font-size: 14px;
      font-weight: 500;
      color: #434343;
    }
    .clear {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      cursor: pointer;
      a {
        font-size: 12px;
        font-weight: 400;
        color: #434343;
      }
      .anticon-close {
        color: #8c8c8c;
        margin-left: 5.5px;
      }
    }
  }

  .tag {
    margin: 15px 0;

    gap: 12px 16px;
    display: flex;
    flex-wrap: wrap;
    .ant-tag {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: default;
      .text-truncate {
        max-width: 120px;
      }
    }
  }

  .my-scrollbar {
    height: 350px;
    overflow: auto;
    transition: overflow 0.3s ease;

    .product_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .text-truncate {
        max-width: 418px;
      }

      .product_left {
        display: flex;
        align-items: center;
        width: 550px;
        p {
          margin-left: 16px;
          width: 100%;
        }
      }
      .product_right {
        margin-right: 16px;
      }
    }
  }

  .loading__init {
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const InputSearch = styled.div`
  position: relative;
  width: 640px;
  height: 41px;
  .ant-input {
    height: 40px;
    padding-right: 40px;
    border-radius: 6px;
    background-color: #f5f5f5;
  }
  .modeling-order-list-filter-search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    .my-icon {
      font-size: 20px;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;
  .image-crop-size {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-gray-7);
  }
`;
