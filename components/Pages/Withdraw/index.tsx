import { useState } from 'react';

import { useRouter } from 'next/router';

import {
  Badge,
  Button,
  Col,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Row,
  Spin,
  Tooltip,
} from 'antd';

import { formatNumber } from 'common/functions';
import regex from 'common/regex';
import useLanguage from 'hooks/useLanguage';
import Modal from './Modal';

import { ParamWithdraw } from 'models/seller.model';

import { Container } from 'styles/__styles';
import * as L from './style';

type Props = {
  minWithdraw: number;
  loading: boolean;
  loadingMaxWithdraw: boolean;
  maxWithdraw: number;
};

const WithdrawComponent = (props: Props) => {
  const { minWithdraw, loading, loadingMaxWithdraw, maxWithdraw } = props;

  const router = useRouter();
  const { langLabel, langCode } = useLanguage();

  const [modalLists, setModalLists] = useState<{
    isShow: boolean;
    data: ParamWithdraw | null;
  }>({
    isShow: false,
    data: null,
  });

  const [form] = Form.useForm();

  const onFinish = (values: ParamWithdraw) => {
    values.amount = values?.amount_withdraw || 0;
    delete values['amount_withdraw'];

    setModalLists({
      isShow: true,
      data: values,
    });
  };

  return (
    <L.Withdraw_wrapper>
      <Container>
        {loading || loadingMaxWithdraw ? (
          <Spin />
        ) : (
          <Form layout='vertical' form={form} onFinish={onFinish}>
            <Row gutter={[0, 18]}>
              <Col span={24}>
                <Form.Item
                  label={langLabel.bank_name}
                  name='bank_name'
                  rules={[
                    { required: true, message: langLabel.withdraw_form_bank_name_required },
                    { whitespace: true, message: langLabel.withdraw_form_bank_name_empty },
                    () => ({
                      validator(_, value) {
                        const arrCharacters: string[] = value?.replace(/\s+/g, '').split('');
                        if (value && arrCharacters.every((i) => '`~!@#$%^&*;:?/'.includes(i)))
                          return Promise.reject(
                            new Error(langLabel.withdraw_form_bank_name_format)
                          );
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <Input
                    maxLength={50}
                    showCount={{
                      formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                    }}
                    placeholder={langLabel.withdraw_form_bank_name_placeholder}
                    disabled={maxWithdraw < minWithdraw}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={langLabel.swift_code}
                  name='swift_code'
                  rules={[
                    {
                      required: true,
                      message: langLabel.withdraw_form_swift_code_required,
                    },
                    {
                      whitespace: true,
                      message: langLabel.withdraw_form_swift_code_empty,
                    },
                    {
                      min: 8,
                      message: langLabel.withdraw_form_swift_code_min,
                    },
                    {
                      max: 11,
                      message: langLabel.withdraw_form_swift_code_max,
                    },
                    {
                      pattern: /^[a-zA-Z0-9]*$/,
                      message: langLabel.withdraw_form_swift_code_format,
                    },
                  ]}>
                  <Input
                    placeholder={langLabel.withdraw_form_swift_code_placeholder}
                    disabled={maxWithdraw < minWithdraw}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={langLabel.account_name}
                  name='account_name'
                  rules={[
                    { required: true, message: langLabel.withdraw_form_account_name_required },
                    { whitespace: true, message: langLabel.withdraw_form_account_name_empty },
                    () => ({
                      validator(_, value) {
                        const arrCharacters: string[] = value?.replace(/\s+/g, '').split('');
                        if (value && arrCharacters.every((i) => '`~!@#$%^&*;:?/'.includes(i)))
                          return Promise.reject(
                            new Error(langLabel.withdraw_form_account_name_format)
                          );
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <Input
                    maxLength={50}
                    showCount={{
                      formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                    }}
                    placeholder={langLabel.withdraw_form_account_name_placeholder}
                    disabled={maxWithdraw < minWithdraw}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={langLabel.account_number}
                  name='card_number'
                  rules={[
                    { required: true, message: langLabel.withdraw_form_account_number_required },
                    { whitespace: true, message: langLabel.withdraw_form_account_number_empty },
                    {
                      pattern: new RegExp(regex.notCharacter),
                      message: langLabel.withdraw_form_account_number_format,
                    },
                  ]}>
                  <Input
                    maxLength={50}
                    showCount={{
                      formatter: ({ value, maxLength }) => `${value.split('').length}/${maxLength}`,
                    }}
                    placeholder={langLabel.withdraw_form_account_number_placeholder}
                    disabled={maxWithdraw < minWithdraw}
                  />
                </Form.Item>
              </Col>

              <Col span={24} className='position-relative'>
                <Form.Item
                  label={langLabel.withdraw_amount_number}
                  name='amount_withdraw'
                  className='btn__withdraw--group'
                  required
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value === undefined) {
                          return Promise.reject(new Error(langLabel.withdraw_form_amount_required));
                        } else if (value > maxWithdraw) {
                          return Promise.reject(
                            new Error(
                              langLabel.withdraw_form_amount_maximum.replace(
                                '{{maximum}}',
                                formatNumber(maxWithdraw, '$')
                              )
                            )
                          );
                        } else if (value < minWithdraw) {
                          return Promise.reject(
                            new Error(
                              langLabel.withdraw_form_amount_minimum.replace(
                                '{{minimum}}',
                                formatNumber(minWithdraw, '$')
                              )
                            )
                          );
                        } else return Promise.resolve();
                      },
                    }),
                  ]}>
                  <InputNumber
                    formatter={(value) =>
                      value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    addonBefore='$'
                    placeholder={`${
                      langLabel.withdraw_minimum_draw || 'Minimum withdrawal amount'
                    } ${formatNumber(minWithdraw, '$')}`}
                    controls={false}
                    addonAfter={
                      <Tooltip
                        title={`${langLabel.withdraw_current_amount}: ${formatNumber(
                          maxWithdraw,
                          '$'
                        )}`}>
                        <Button
                          type='text'
                          disabled={maxWithdraw < minWithdraw}
                          className={`btn__draw ${maxWithdraw === 0 ? 'disable' : ''}`}
                          onClick={
                            maxWithdraw > 0
                              ? () =>
                                  form.setFieldsValue({
                                    amount_withdraw: maxWithdraw,
                                  })
                              : undefined
                          }>
                          {langLabel.withdraw_maximum || 'Maximum'}
                        </Button>
                      </Tooltip>
                    }
                    disabled={maxWithdraw < minWithdraw}
                    min={0}
                    precision={2}
                    className='w-100'
                  />
                </Form.Item>
              </Col>

              <div className='note'>
                <Badge dot status='error' />
                {langLabel.withdraw_warning_not_cancel}
                <br />
                <Badge dot status='error' />
                {langLabel.withdraw_warning_info}
              </div>

              <div className='text-center w-100 btn__withdraw--group'>
                <ConfigProvider theme={{ token: { colorPrimary: '#8c8c8c' } }}>
                  <Button
                    className='btn__cancel'
                    type='primary'
                    loading={loading}
                    onClick={() => router.push(`/${langCode}/dashboard/withdraw`)}>
                    {langLabel.btn_cancel || 'Cancel'}
                  </Button>
                </ConfigProvider>

                <Button
                  className='btn__submit'
                  type='primary'
                  disabled={maxWithdraw < minWithdraw}
                  loading={loading}
                  htmlType='submit'>
                  {langLabel.btn_preview || 'Preview'}
                </Button>
              </div>
            </Row>
          </Form>
        )}
        <Modal isShow={modalLists.isShow} data={modalLists.data} setModalLists={setModalLists} />
      </Container>
    </L.Withdraw_wrapper>
  );
};

export default WithdrawComponent;
