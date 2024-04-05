import Link from 'next/link';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tag,
  Upload,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import useLanguage from 'hooks/useLanguage';

import isOnlyEmoji from 'functions/isOnlyEmoji';
import convertCommas from 'common/functions/convertCommas';
import getBase64 from 'functions/getBase64';

import isBase64Image from 'functions/isBase64Image';
import sortArrayByObjectKey from 'functions/sortArrayByObjectKey';

import { SelectAuthInfo } from 'store/reducer/auth';

import { UploadModelContext } from './Provider';
import MyImage from 'components/Fragments/Image';
import UploadModelSection, { UploadModelSectionHeader } from './Fragments/Section';
import CategoryShowroom from './Fragments/CategoryShowroom';
import LabelWithTooltip from './Fragments/LabelWithTooltip';
import FormItemTextEditor from 'components/Fragments/FormItemTextEditor';

import { CategoryModel } from 'models/category.models';
import { UserType } from 'models/user.models';

import styled from 'styled-components';
import isArrayEmpty from 'common/functions/isArrayEmpty';

type Props = { saveType?: 'draft' | 'public' };

const UploadFileInformation = (props: Props) => {
  const form = Form.useFormInstance();
  const user = useSelector(SelectAuthInfo);
  const i18n = useLanguage();

  const { saveType } = props;
  const {
    data,
    updateFieldChanged,
    category,
    categoryShowroom,
    updateCategoryShowroom,
    license,
    avatar,
    updateAvatar,
  } = useContext(UploadModelContext);

  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);

  const isPublish = saveType === 'public';
  const isFree = Form.useWatch('free', form);
  const categoriesSelected: string[] = Form.useWatch('cat_ids', form) ?? [];
  const categoriesShowroomSelected: string[] = Form.useWatch('cat_ids_showroom', form) ?? [];
  const licenseSelected = Form.useWatch('license_id', form);
  const licenseLink = license?.find((i) => i.id === licenseSelected)?.link;

  const onValidateCategory = useCallback(() => {
    if (category) {
      const cateEmpty = isArrayEmpty(form.getFieldValue('cat_ids'));
      if (cateEmpty && !isArrayEmpty(data?.market_item_categories)) {
        const categories = data?.market_item_categories?.map((i) => i.market_category.id);
        setTimeout(() => {
          form.setFieldValue('cat_ids', categories);
          form.validateFields(['cat_ids']);
        }, 0);
      } else if (!isArrayEmpty(form.getFieldValue('cat_ids'))) form.validateFields(['cat_ids']);
    }
  }, [category, data?.market_item_categories, form]);

  useEffect(() => onValidateCategory(), [onValidateCategory]);

  const onUpdatePrice = useCallback(() => {
    if (isFree) {
      form.setFields([
        { name: 'price', value: undefined, errors: [] },
        { name: 'old_price', value: undefined, errors: [] },
      ]);
    }
  }, [form, isFree]);

  useEffect(() => onUpdatePrice(), [onUpdatePrice]);

  const onValidateLicense = useCallback(() => {
    if (license) {
      if (!form.getFieldValue('license_id') && data?.market_license) {
        setTimeout(() => {
          const licenseItem = license.find(
            (i) => i.id === data.market_license?.id && i.is_free === (data.price === 0)
          );
          form.setFieldValue('license_id', licenseItem?.id ?? data.market_license?.title);
          form.validateFields(['license_id']);
        }, 0);
      } else if (form.getFieldValue('license_id')) form.validateFields(['license_id']);
    }
  }, [data?.market_license, data?.price, form, license]);

  useEffect(() => onValidateLicense(), [onValidateLicense]);

  const normalFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onBeforeUploadAvatar = async (file: RcFile) => {
    const fileName = file?.name;
    const fileFormat = fileName?.split('.')?.slice(-1)[0]?.toLowerCase();
    const fileSize = file?.size;
    let formatError = false;
    let sizeError = false;

    if (!['png', 'jpg', 'jpeg', 'webp'].includes(fileFormat)) formatError = true;
    if (fileSize > 1024 * 1024 * 2) sizeError = true;

    if (formatError || sizeError) {
      message.error(
        i18n
          .t('message_validate_image_file')
          .replace('{{file_extension}}', 'JPG, JPEG, PNG, WEBP')
          .replace('{{limit_size}}', '2MB')
      );
      return Upload.LIST_IGNORE;
    }

    const base64 = await getBase64(file);
    const isImage = await isBase64Image(base64);
    if (!isImage) {
      message.error(i18n.t('message_cant_read_files'));
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const onCrop = async (file: any) => {
    form.setFieldValue('image', [Object.assign(file, { originFileObj: file })]);
    form.validateFields(['image']);
    updateAvatar(await getBase64(file));
    updateFieldChanged(true);
  };

  const onRemoveAvatar = () => {
    form.setFieldValue('image', undefined);
    form.validateFields(['image']);
    updateAvatar(undefined);
    const isFieldFilled = Object.entries(form.getFieldsValue()).some(([_, value]) => {
      return (Array.isArray(value) && value.length) || Boolean(value);
    });
    updateFieldChanged(isFieldFilled);
  };

  const onAddCategory = (category: CategoryModel) => {
    updateCategoryShowroom((current = []) =>
      sortArrayByObjectKey(current.concat([category]), 'title')
    );
  };

  return (
    <>
      <UploadModelSection title='Information'>
        <Wrapper>
          <Row gutter={[20, 5]}>
            <Col span={24} id='field-item-image'>
              <Form.Item
                label={
                  <LabelWithTooltip
                    title=' Preview image'
                    tooltip={
                      <ul>
                        <li>
                          <CheckOutlined /> Ratio 4:3, size less 2MB.
                        </li>
                        <li>
                          <CheckOutlined /> Show your product from all sides, including a wireframe
                          preview image.
                        </li>
                        <li>
                          <CheckOutlined /> Use lighting and shadows to create a realistic image of
                          your product.
                        </li>
                        <li>
                          <CheckOutlined /> Use a neutral background to make the product stand out.
                        </li>
                        <li>
                          <CloseOutlined /> Don&apos;t include any assets or details that are not
                          part of the product.
                        </li>
                      </ul>
                    }
                  />
                }
                name='image'
                valuePropName='fileList'
                getValueFromEvent={normalFile}
                rules={[{ required: isPublish, message: 'Please upload pictures for this model' }]}>
                <ImgCrop
                  fillColor='transparent'
                  aspect={4 / 3}
                  beforeCrop={(file) => onBeforeUploadAvatar(file)}
                  onModalOk={onCrop}>
                  <Upload maxCount={1} showUploadList={false} accept='image/*'>
                    <AvatarUpload>
                      {avatar ? (
                        <>
                          <MyImage fill src={avatar} alt='' />
                          <div className='delete d-flex align-items-center justify-content-center'>
                            <DeleteOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveAvatar();
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadOutlined />
                          Upload
                        </>
                      )}
                    </AvatarUpload>
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col span={24} id='field-item-title'>
              <Form.Item
                label={
                  <LabelWithTooltip
                    title='Product name'
                    tooltip={
                      <ul>
                        <li>
                          <CheckOutlined /> The title should be relevant and specific to your model.
                        </li>
                        <li>
                          <CheckOutlined /> It should be short, with a maximum of 70 characters.
                        </li>
                        <li>
                          <CheckOutlined /> It should also note the general category and type of the
                          model.
                        </li>
                        <li>
                          <CloseOutlined /> You should not write the title of the wrong product.
                        </li>
                      </ul>
                    }
                  />
                }
                name='title'
                required
                rules={[
                  { required: true, message: 'Product name is required' },
                  {
                    validator: async (_, value) => {
                      if (value && isOnlyEmoji(value))
                        return Promise.reject(
                          new Error('The product name cannot contain only emojis')
                        );

                      return Promise.resolve();
                    },
                  },
                  { whitespace: true, message: 'Name cannot be empty' },
                ]}>
                <Input
                  placeholder=''
                  maxLength={70}
                  showCount={{
                    formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <FormItemTextEditor
                name='description'
                label={
                  <LabelWithTooltip
                    title='Description'
                    tooltip={
                      <ul>
                        <li>
                          <CheckOutlined /> Standard product description, with complete technical
                          information.
                        </li>
                        <li>
                          <CheckOutlined /> Write an attractive description that attracts customers
                          and increases trust.
                        </li>
                        <li>
                          <CloseOutlined /> Don&apos;t write an incorrect description of the
                          product.
                        </li>
                      </ul>
                    }
                  />
                }
              />
            </Col>

            <Col
              span={24}
              md={user?.type === UserType.SELLER || user?.type === UserType.VRSTYLER ? 24 : 12}
              id='field-item-cat_ids'>
              <Form.Item
                label='Categories'
                name='cat_ids'
                rules={[
                  { required: isPublish, message: 'Please choose the category of the model' },
                  () => ({
                    validator(_, value) {
                      if (value) {
                        const isCategoryInactive = value?.some(
                          (i: string) => !category?.some((c) => c.id === i)
                        );
                        if (isCategoryInactive)
                          return Promise.reject(new Error('This category does not exist'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}>
                <Select
                  className='upload-model-category-select'
                  loading={!category}
                  mode='multiple'
                  maxLength={2}
                  options={category?.map(({ id, title }) => {
                    const disabled =
                      categoriesSelected.length >= 2 && !categoriesSelected.includes(id);
                    return { value: id, label: title, disabled };
                  })}
                  optionLabelProp='label'
                  optionRender={(option) => {
                    const checked = categoriesSelected.includes(option.value as string);
                    const disabled = categoriesSelected.length >= 2 && !checked;
                    const checkboxProps = { checked, disabled };
                    return (
                      <Checkbox {...checkboxProps} style={{ pointerEvents: 'none' }}>
                        {option.label}
                      </Checkbox>
                    );
                  }}
                  tagRender={(props) => {
                    const { label, value, ...tagProps } = props;
                    const isAvailable = category?.some((item) => item.id === value);
                    const categoryUnavailable =
                      data?.market_item_categories?.find((i) => i.market_category.id === label)
                        ?.market_category.title ?? label;

                    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                      event.preventDefault();
                      event.stopPropagation();
                    };

                    return (
                      <ConfigProvider
                        theme={{ token: { fontSizeSM: 14, fontSizeIcon: 12, paddingXXS: 5 } }}>
                        <Tag
                          {...tagProps}
                          color={!isAvailable ? 'error' : undefined}
                          bordered={false}
                          onMouseDown={onPreventMouseDown}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: isAvailable ? 'rgb(0 0 0 / 6%)' : '',
                          }}>
                          {isAvailable ? label : categoryUnavailable}
                        </Tag>
                      </ConfigProvider>
                    );
                  }}
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  getPopupContainer={(triggerNode) => triggerNode}
                />
              </Form.Item>
            </Col>

            {user?.type === UserType.SHOWROOM && (
              <Col span={24} md={12}>
                <Form.Item
                  name='cat_ids_showroom'
                  label={
                    <LabelWithTooltip
                      title='My Category'
                      tooltip={
                        <ul>
                          <li>
                            <CheckOutlined /> Each category will contain related products.
                          </li>
                          <li>
                            <CheckOutlined /> Using category helps customers easily find the
                            products they want to buy.
                          </li>
                          <li>
                            <CloseOutlined /> Don&apos;t create a category without products.
                          </li>
                        </ul>
                      }
                    />
                  }>
                  <Select
                    className='upload-model-category-select'
                    mode='multiple'
                    options={categoryShowroom?.map(({ id, title }) => ({
                      value: id,
                      label: title,
                      disabled:
                        categoriesShowroomSelected.length >= 2 &&
                        !categoriesShowroomSelected.includes(id),
                    }))}
                    optionRender={(option) => {
                      const checked = categoriesShowroomSelected?.includes(option.value as string);
                      const disabled = categoriesShowroomSelected.length >= 2 && !checked;
                      const checkboxProps = { checked, disabled };
                      return (
                        <Checkbox {...checkboxProps} style={{ pointerEvents: 'none' }}>
                          {option.label}
                        </Checkbox>
                      );
                    }}
                    optionLabelProp='label'
                    getPopupContainer={(triggerNode) => triggerNode}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    dropdownRender={(menu) => (
                      <>
                        <ButtonCreateCategory
                          className='ant-select-item'
                          onClick={() => setOpenAddCategory(true)}>
                          <PlusOutlined /> Create categories
                        </ButtonCreateCategory>
                        {menu}
                      </>
                    )}
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item
                label={
                  <LabelWithTooltip
                    title='Tags'
                    tooltip={
                      <ul>
                        <li>
                          <CheckOutlined /> Take note of the product&apos;s attributes.
                        </li>
                        <li>
                          <CheckOutlined /> Use both specific and general keywords to tag products.
                        </li>
                        <li>
                          <CloseOutlined /> Avoid tagging products with irrelevant words.
                        </li>
                      </ul>
                    }
                  />
                }
                name='tags'
                rules={[
                  {
                    validator: (_, value) => {
                      if (/\s/g.test(value))
                        return Promise.reject('Tags cannot contain whitespace');

                      return Promise.resolve();
                    },
                  },
                ]}>
                <Select mode='tags' open={false} tokenSeparators={[' ']} suffixIcon={null} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <UploadModelSectionHeader
                title='Pricing and license'
                tooltip={
                  <Link
                    href='https://vrstyler.com/en/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/pricing-license--514d30d7-8efb-4cfe-96e7-78af8830c93e'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Find out 3D model licenses available on VRStyler to decide which one to offer
                  </Link>
                }
                className='header-section-only-text'
              />
            </Col>

            <Col span={24} md={16}>
              <Row gutter={[20, 5]}>
                <Col span={24} md={12} id='field-item-price'>
                  <Form.Item
                    label='Sold Price'
                    name='price'
                    rules={[
                      {
                        required: isPublish && !isFree,
                        message: 'Please enter the price for this product',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const oldPrice = getFieldValue('old_price');
                          if (!isFree && value && oldPrice && value >= oldPrice) {
                            return Promise.reject(
                              new Error('The selling price must be less than the original price')
                            );
                          }
                          form.setFields([{ name: 'old_price', errors: [] }]);

                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <InputNumber
                      max={999}
                      min={1}
                      className='w-100'
                      addonBefore='$'
                      disabled={isFree}
                      precision={2}
                      formatter={(value) => convertCommas(value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={24} md={12} id='field-item-price'>
                  <Form.Item
                    label='Original Price'
                    name='old_price'
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const valuePrice = getFieldValue('price');

                          if (value && valuePrice && value <= valuePrice) {
                            return Promise.reject(
                              new Error('Original price must be greater than selling price')
                            );
                          }

                          form.setFields([{ name: 'price', errors: [] }]);
                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <InputNumber
                      precision={2}
                      max={999}
                      className='w-100'
                      min={1}
                      addonBefore='$'
                      disabled={isFree}
                      formatter={(value) => convertCommas(value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    className='upload-model-free-checkbox'
                    name='free'
                    valuePropName='checked'>
                    <Checkbox
                      onChange={() =>
                        form.setFields([{ name: 'license_id', value: undefined, errors: [] }])
                      }>
                      Share for free
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={24} md={8} id='field-item-license_id'>
              <Form.Item
                label='License'
                name='license_id'
                rules={[
                  { required: isPublish, message: 'Please choose a license' },
                  () => ({
                    validator(_, value) {
                      if (value && !license?.some(({ id }) => id === value))
                        return Promise.reject(new Error('This license does not exist'));

                      return Promise.resolve();
                    },
                  }),
                ]}>
                <Select
                  loading={!license}
                  options={license
                    ?.filter((i) => (isFree ? i.is_free : !i.is_free))
                    .map((i) => ({ label: i.title, value: i.id }))}
                />
              </Form.Item>

              {licenseLink && (
                <a href={licenseLink} target='__blank'>
                  {licenseLink}
                </a>
              )}
            </Col>

            <Col span={24}>
              <UploadModelSectionHeader
                title='Technical detail'
                tooltip='Help buyers decide to purchase your product – state the software, polycount, maps, scripts and plugins you used to create the product.'
                className='header-section-only-text'
              />
            </Col>

            <Col span={24} md={6}>
              <Form.Item name='is_animated' valuePropName='checked'>
                <Checkbox> Is Animation</Checkbox>
              </Form.Item>
            </Col>

            <Col span={24} md={6}>
              <Form.Item name='is_pbr' valuePropName='checked'>
                <Checkbox>Is PBR</Checkbox>
              </Form.Item>
            </Col>

            <Col span={24} md={6}>
              <Form.Item name='is_rigged' valuePropName='checked'>
                <Checkbox>Is Rigged</Checkbox>
              </Form.Item>
            </Col>

            <Col span={24} md={6}>
              <Form.Item name='is_uv' valuePropName='checked'>
                <Checkbox>UV Layers</Checkbox>
              </Form.Item>
            </Col>

            <Col span={24} md={8} id='field-item-unit'>
              <Form.Item
                label='Unit'
                name='unit'
                rules={[
                  {
                    required: isPublish,
                    message: 'Please select the unit that you use to make the model',
                  },
                ]}>
                <Select
                  placeholder='Unit'
                  options={[
                    { label: 'Meter', value: 1 },
                    { label: 'Centimeter', value: 2 },
                    { label: 'millimeter', value: 3 },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label='Quads'
                name='quads'
                rules={[{ whitespace: true, message: 'Quads cannot be empty' }]}>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label='Total triangles'
                name='total_triangles'
                rules={[{ whitespace: true, message: 'Total Triangles cannot be empty' }]}>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label='Vertices'
                name='vertices'
                rules={[{ whitespace: true, message: 'Vertices cannot be empty' }]}>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label='Textures'
                name='textures'
                rules={[{ whitespace: true, message: 'Textures cannot be empty' }]}>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label='Materials'
                name='materials'
                rules={[{ whitespace: true, message: 'Materials cannot be empty' }]}>
                <Input placeholder='' />
              </Form.Item>
            </Col>
          </Row>
        </Wrapper>
      </UploadModelSection>

      <CategoryShowroom
        open={openAddCategory}
        onAddCategory={onAddCategory}
        onClose={() => setOpenAddCategory(false)}
      />
    </>
  );
};

export default UploadFileInformation;

const Wrapper = styled.main`
  .header-section-only-text {
    margin: 28px 0 20px;
  }
  #field-item-image .ant-form-item-control-input-content {
    line-height: 1;
    > span {
      display: inline-block;
      line-height: 1;
    }
  }
  .upload-model-category-select {
    .ant-select-item-option:hover {
      background-color: inherit;
      .ant-checkbox-inner {
        border-color: #369ca5;
      }
    }
    .ant-select-item-option-selected {
      background-color: inherit;
      .ant-select-item-option-state {
        display: none;
      }
    }
    .ant-checkbox-wrapper {
      margin-right: 8px;
      .ant-checkbox-input {
        cursor: pointer;
      }
    }
  }
  .upload-model-free-checkbox .ant-form-item-control-input {
    min-height: unset;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
`;
const AvatarUpload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 138px;
  height: 104px;
  padding: 1px;
  border-radius: 5px;
  border: solid 1px var(--color-gray-5);
  background-color: var(--color-gray-2);
  overflow: hidden;

  img {
    height: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover .delete {
    opacity: 1;
    visibility: visible;
  }

  .anticon {
    margin-bottom: 9px;
    font-size: 20px;
    color: var(--color-primary-700);
  }
  .delete {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;

    background-color: #0000002e;

    .anticon {
      font-size: 16px;
      color: #ff4d4f;
    }
  }
`;
const ButtonCreateCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gray-9);
`;
