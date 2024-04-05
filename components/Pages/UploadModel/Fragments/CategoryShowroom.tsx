import { useRef, useState } from 'react';

import { Button, Form, Input, message, Modal, ModalProps } from 'antd';
import { useWatch } from 'antd/lib/form/Form';

import regex from 'common/regex';

import useLanguage from 'hooks/useLanguage';
import showroomServices from 'services/showroom-services';

import { CategoryModel } from 'models/category.models';

import styled from 'styled-components';

const Wrapper = styled.div`
  .ant-modal-content {
    padding: 24px;
    border-radius: 5px;
    overflow: hidden;
  }
  .ant-modal-header {
    padding: 0 0 15px;

    .ant-modal-title {
      font-size: 18px;
      color: var(--color-gray-11);
      font-weight: 500;
    }
  }
  .ant-modal-body {
    padding: 16px 0 0;

    .line {
      border-color: var(--color-gray-4);
      margin: 16px 0;
    }

    .btn__submit {
      width: 100%;
      height: 41px;
      font-weight: 500;
    }

    .ant-input-affix-wrapper {
      height: 42px;
      border-radius: 4px;
      color: var(--color-gray-9);
      background-color: #f5f5f5;
      &::placeholder {
        color: #8c8c8c;
      }
    }
  }
  .ant-form-horizontal .ant-form-item-control {
    flex: none;
  }
`;

interface CategoryShowroomProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onAddCategory: (category: CategoryModel) => void;
  onClose: () => void;
}

export default function CategoryShowroom(props: CategoryShowroomProps) {
  const { langLabel, t } = useLanguage();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const value = useWatch('category', form);

  const onCreateCategory = async () => {
    if (value) {
      setLoading(true);
      await showroomServices
        .createCategory({ title: value.trim() })
        .then((res) => {
          message.success(t('dashboard_category_message_add_success', 'Added successfully'));
          props.onAddCategory(res.data);
          setLoading(false);
          props.onClose();
        })
        .catch((error: any) => {
          setLoading(false);
          console.log('Create Failed', error);
        });
    }
  };

  const modalProps: ModalProps = {
    title: langLabel.upload_model_modal_add_category_title,
    open: props.open,
    footer: false,
    centered: true,
    destroyOnClose: true,
    closable: false,
    zIndex: 10,
    okText: false,
    okButtonProps: { disabled: !value, loading },
    getContainer: () => wrapperRef.current || document.body,
    afterClose: () => form.resetFields(),
    onCancel: props.onClose,
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Modal {...modalProps}>
        <Form form={form} onFinish={onCreateCategory}>
          <Form.Item
            name='category'
            rules={[
              { whitespace: true, message: langLabel.upload_model_form_category_not_empty },
              {
                pattern: regex.allCharacters,
                message: langLabel.upload_model_form_category_not_special_character,
              },
            ]}>
            <Input
              autoFocus
              maxLength={20}
              showCount={{
                formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
              }}
              bordered={false}
              placeholder={langLabel.upload_model_form_category_placeholder}
            />
          </Form.Item>

          <hr className='line' />

          <Button
            className='btn__submit'
            type='primary'
            disabled={!value?.trim() || loading}
            htmlType='submit'>
            {value?.trim()
              ? langLabel.upload_model_category_btn_create
              : langLabel.upload_model_category_btn_create_new}
          </Button>
        </Form>
      </Modal>
    </Wrapper>
  );
}
