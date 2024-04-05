import styled from 'styled-components';
import isEmail from 'validator/lib/isEmail';
import { Button, Form, Input } from 'antd';

import useLanguage from 'hooks/useLanguage';
import formConstant from 'constants/form.constant';

import { maxMedia } from 'styles/__media';

const FormContact = () => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <Form layout='vertical'>
        <Form.Item
          label='What Is Your Name?'
          name='name'
          rules={[{ required: true, message: formConstant(langLabel).name?.empty }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='What Is Your E-mail Address?'
          name='email'
          rules={[
            { required: true, message: formConstant(langLabel).email?.empty },
            ({}) => ({
              validator(_, value) {
                if (isEmail(value)) return Promise.resolve();
                return Promise.reject(new Error(formConstant(langLabel).email?.format));
              },
            }),
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='What help do you need from us?'
          name='content'
          rules={[{ required: true, message: 'Please enter the content that needs support!' }]}>
          <Input.TextArea autoSize={{ minRows: 5.5 }} />
        </Form.Item>

        <Button type='primary' shape='round' htmlType='submit'>
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
};
export default FormContact;

const Wrapper = styled.section`
  ${maxMedia.medium} {
    text-align: center;
  }

  .ant-form {
    display: inline-block;
    width: 49rem;
    max-width: 100%;
    padding: 30px;
    text-align: center;

    background-color: var(--color-white);
    border-radius: 0.8rem;

    ${maxMedia.small} {
      width: 100%;
      padding: 20px;
    }

    .ant-form-item {
      margin-bottom: 4rem;
    }

    .ant-form-item-label label {
      margin-bottom: 0.6rem;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-title);
    }

    .ant-form-item-explain {
      text-align: left;
    }

    .ant-input {
      height: 4rem;

      ${maxMedia.small} {
        height: 4.4rem;
      }
    }

    .ant-btn {
      width: 77.21%;
      height: 42px;
      font-size: 14px;
      font-weight: 600;
    }
  }
`;
