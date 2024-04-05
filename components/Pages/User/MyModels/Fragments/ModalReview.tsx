import { useState } from 'react';

import {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Rate,
} from 'antd';
import { ThemeConfig } from 'antd/lib';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';
import convertToHtml from 'common/functions/convertToHtml';
import reviewServices from 'services/review-services';

import MyImage from 'components/Fragments/Image';

import { AssetModel } from 'models/asset.models';
import { ReviewModel } from 'models/review.models';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const recommends = [
  'Nice and quality product',
  'Website easy to buy and easy to use',
  'Very worth the money',
  'Detailed and easy-to-use models',
  'Excellent product quality',
  'New and modern model',
];

type Props = {
  review: ReviewModel;
  product: AssetModel;
  visible: boolean;
  onClose: () => void;
  onUpdateReview: (review: any) => void;
};

const ModalReviewProduct = (props: Props) => {
  const { visible, review, product, onClose, onUpdateReview } = props;
  const { langLabel, langCode, t } = useLanguage();
  const { width: screenW } = useWindowSize();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseModal = () => {
    form.resetFields();
    props.onClose();
  };

  const onSelectRecommend = (text: string) => {
    const currentContent = form.getFieldValue('content');
    const newContent = currentContent ? `${currentContent}\n- ${text}` : `- ${text}`;
    form.setFields([{ name: 'content', value: newContent }]);
  };

  const onRate = async (values: any) => {
    try {
      setLoading(true);
      const content =
        values.content
          ?.trim()
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .replaceAll('\n', '<br/>')
          .replace(/\s+/g, '&nbsp;') || undefined;
      const param = { ...values, content };
      const response = await reviewServices.addReview(product.item_id, param);

      if (!response.error) {
        message.success(langLabel.my_profile_review_success);
        onUpdateReview(response.data);
        onClose();
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };

  const modalProps: ModalProps = {
    title: t('my_profile_review_title'),
    open: visible,
    closable: false,
    centered: true,
    width: 726,
    destroyOnClose: true,
    confirmLoading: loading,
    cancelText: review ? t('modeling_order_btn_close') : t('modeling_order_btn_cancel'),
    footer: (_, { CancelBtn, OkBtn }) => (
      <Flex gap={10} justify='flex-end'>
        <ConfigProvider theme={buttonTheme}>
          <CancelBtn />
          {!review && <OkBtn />}
        </ConfigProvider>
      </Flex>
    ),
    onCancel: onClose,
    onOk: form.submit,
    afterClose: handleCloseModal,
  };

  const modalTheme: ThemeConfig = {
    token: {
      paddingMD: screenW <= 480 ? 20 : 30,
      paddingContentHorizontalLG: screenW <= 480 ? 20 : 30,
    },
  };

  const buttonTheme: ThemeConfig = {
    token: { borderRadius: 4, controlHeight: 36 },
    components: { Button: { paddingInline: screenW <= 480 ? 20 : 40 } },
  };

  return (
    <ConfigProvider theme={modalTheme}>
      <Modal {...modalProps}>
        <Divider style={{ marginTop: 0 }} />
        <ReviewWrapper>
          <Form onFinish={onRate} form={form}>
            <ReviewBody className='my-scrollbar'>
              <ReviewProduct>
                <MyImage src={product.image} alt={product.title} width={80} height={60} />
                <p>{product.title}</p>
              </ReviewProduct>

              <ReviewPoint>
                <Form.Item
                  label={t('my_profile_review_form_point_label')}
                  name='rate'
                  initialValue={review?.rate ?? 5}>
                  <Rate allowClear={false} disabled={typeof review !== 'undefined'} />
                </Form.Item>
              </ReviewPoint>

              {!review && (
                <Flex gap='10px 15px' wrap='wrap' style={{ marginBottom: 20 }}>
                  {recommends.map((tag) => {
                    return (
                      <ConfigProvider
                        key={tag}
                        theme={{
                          token: { borderRadius: 4 },
                          components: { Button: { defaultBg: 'var(--color-gray-3)' } },
                        }}>
                        <Button disabled={loading} onClick={() => onSelectRecommend(tag)}>
                          {tag}
                        </Button>
                      </ConfigProvider>
                    );
                  })}
                </Flex>
              )}

              <ReviewTextarea>
                {review ? (
                  <div className='Review__Content'>
                    <p>{langLabel.content + ': '}</p>
                    <div
                      className='scroll-bar'
                      dangerouslySetInnerHTML={{
                        __html: review.content
                          ? convertToHtml(review.content, langCode)
                          : langLabel.no_content,
                      }}
                    />
                  </div>
                ) : (
                  <Form.Item
                    name='content'
                    rules={[
                      {
                        whitespace: true,
                        message: t('my_profile_review_form_content_validate_not_empty'),
                      },
                    ]}>
                    <Input.TextArea
                      disabled={loading}
                      placeholder={langLabel.my_profile_review_write}
                      rows={6}
                    />
                  </Form.Item>
                )}
              </ReviewTextarea>
            </ReviewBody>
          </Form>
        </ReviewWrapper>
      </Modal>
    </ConfigProvider>
  );
};
export default ModalReviewProduct;

const ReviewWrapper = styled.div``;
const ReviewBody = styled.div`
  overflow: hidden;

  .ant-btn {
    ${maxMedia.xsmall} {
      padding: 4px 8px;
    }
  }
`;
const ReviewProduct = styled.div`
  display: flex;
  gap: 10px;
  img {
    object-fit: cover;
  }

  p {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-caption);
    max-width: 500px;
  }
`;
const ReviewPoint = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  margin-top: 20px;

  .ant-form-item-label label {
    margin-top: 2px;
    &::before {
      content: ':';
      margin-right: 5px;
    }
  }

  .ant-rate {
    font-size: 24px;
    ${maxMedia.xsmall} {
      font-size: 20px;
    }
  }
`;
const ReviewTextarea = styled.div`
  .Review__Content {
    & > p {
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: 500;
    }
    .scroll-bar {
      max-height: calc(100vh - 700px);
      overflow-y: auto;

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--color-gray-5);
      }
    }
  }
`;
