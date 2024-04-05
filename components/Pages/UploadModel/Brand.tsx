import { useCallback, useContext, useEffect, useMemo } from 'react';

import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { SelectProps } from 'antd/lib';

import isUUID from 'functions/isUUID';

import UploadModelSection from './Fragments/Section';
import { UploadModelContext } from './Provider';

const UploadFileBrand = () => {
  const form = Form.useFormInstance();
  const { data, brand } = useContext(UploadModelContext);

  const brandOptions: SelectProps['options'] = useMemo(() => {
    if (brand) return brand?.map(({ id, title }) => ({ value: id, label: title }));
    else if (data?.market_brand)
      return [{ value: data.market_brand?.id, label: data.market_brand.title }];
    else return undefined;
  }, [brand, data?.market_brand]);

  const brandSelected = Form.useWatch('brand_id', form);

  const onValidateBrand = useCallback(() => {
    const isBrandInactive =
      brandSelected !== undefined && !brand?.some((i) => i.id === brandSelected);

    if (data?.market_brand || isBrandInactive) {
      setTimeout(() => {
        form.validateFields(['brand_id']);
      }, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.market_brand, form, brand]);

  useEffect(() => {
    onValidateBrand();
  }, [onValidateBrand]);

  useEffect(() => {
    if (!brandSelected)
      form.resetFields(['brand_product_link', 'brand_product_price', 'brand_product_sku']);
  }, [brandSelected, form]);

  return (
    <UploadModelSection title='Brand'>
      <Row gutter={[20, 5]}>
        <Col span={24} id='field-item-brand_id'>
          <Form.Item
            label='Brand'
            name='brand_id'
            rules={[
              () => ({
                validator(_, value) {
                  const isBrandInactive =
                    value !== undefined && !brand?.some((i) => i.id === value);
                  if (isBrandInactive)
                    return Promise.reject(new Error('This brand does not exist'));
                  return Promise.resolve();
                },
              }),
            ]}>
            <Select className='upload-model-category-select' allowClear options={brandOptions} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='brand_product_link' label='Link' rules={[{ type: 'url' }]}>
            <Input disabled={!brandSelected} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='brand_product_price' label='Price' rules={[{ type: 'integer' }]}>
            <InputNumber className='w-100' controls={false} min={0} disabled={!brandSelected} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='brand_product_sku' label='SKU'>
            <Input disabled={!brandSelected} />
          </Form.Item>
        </Col>
      </Row>
    </UploadModelSection>
  );
};

export default UploadFileBrand;
