import React, { useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Button, Form, Input, Modal, Rate, Typography } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { handlerMessage } from 'common/functions';
import reviewServices from 'services/review-services';

import MyImage from 'components/Fragments/Image';

import { ReviewModel } from 'models/seller.model';

type Props = {
  modalLists: { isShow: boolean; data: ReviewModel | null };
  setModalLists: React.Dispatch<
    React.SetStateAction<{ isShow: boolean; data: ReviewModel | null }>
  >;
  setReviewLists: React.Dispatch<
    React.SetStateAction<{ total: number; data: ReviewModel[] | null }>
  >;
};

const ModalComponent = (props: Props) => {
  const { setModalLists, modalLists, setReviewLists } = props;
  const { langLabel, t } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onFetchReplyReview = async (id: string, body: { content: string }) => {
    setLoading(true);
    try {
      const resp: any = await reviewServices.replyReview(id, body);

      if (!resp.error) {
        setReviewLists((prevState) => ({
          ...prevState,
          data:
            prevState.data?.map((item) =>
              item.id === id
                ? { ...item, is_replied: true, market_reviews: [{ content: resp?.data?.content }] }
                : item
            ) ?? prevState.data,
        }));
        setModalLists((prevState) => ({
          ...prevState,
          data: prevState.data && {
            ...prevState.data,
            is_replied: true,
            market_reviews: [{ content: resp?.data?.content as string }],
          },
        }));
        setLoading(false);
        handlerMessage(langLabel.dashboard_review_reply_success, 'success');
      }
    } catch (error: any) {
      console.log('Reply Failed', error);
      setLoading(false);
    }
  };

  const onFinish = (value: { content: string }) => {
    value.content = value.content.trim();
    onFetchReplyReview(modalLists.data?.id as string, value);
  };

  const onClose = () => {
    if (router.query.view) router.replace({ query: undefined }, undefined, { shallow: true });
    setModalLists({ isShow: false, data: null });
  };

  return (
    <Modal
      title={langLabel.dashboard_review_reply_title}
      footer=''
      centered
      destroyOnClose={true}
      onCancel={onClose}
      open={modalLists.isShow}>
      <ModalComponentWrapper id='myModal'>
        <div className='product'>
          <div className='product__img'>
            {modalLists.data && (
              <MyImage
                src={modalLists.data.market_item.image}
                alt='Thumbnail'
                width={74.5}
                height={56}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
            )}
          </div>

          <div className='product__title'>
            <h3 className='text-truncate'>{modalLists.data?.market_item.title}</h3>
            <Rate value={modalLists.data?.rate} disabled={true} />
          </div>
        </div>

        <div className='content__review w-100'>
          <div className='left w-100'>
            <h3 className='title__view'>{langLabel.dashboard_review_content}: </h3>
            {modalLists.data?.content ? (
              <div
                className='view__reviews'
                dangerouslySetInnerHTML={{
                  __html: modalLists.data.content
                    ?.trim()
                    .replace(/&nbsp;/g, ' ')
                    .replace(/\n/g, '<br />'),
                }}
              />
            ) : (
              <Typography.Text type='secondary'>{t('no_content')}</Typography.Text>
            )}
          </div>
        </div>
        <Form onFinish={onFinish}>
          <h3 className='title__view'>{langLabel.dashboard_review_reply_content}: </h3>
          <Form.Item
            name='content'
            rules={[
              { required: true, message: t('dashboard_review_form_content_required') },
              { whitespace: true, message: t('dashboard_review_form_content_empty') },
            ]}
            initialValue={modalLists.data?.market_reviews[0]?.content?.trim()}>
            {modalLists.data?.is_replied ? (
              <div
                className='view__reviews'
                dangerouslySetInnerHTML={{
                  __html: modalLists.data.market_reviews[0]?.content
                    .replace(/\n\s*\n\s*\n/g, '\n\n')
                    .replaceAll('\n', '<br/>')
                    .replace(/\s+/g, '&nbsp;'),
                }}
              />
            ) : (
              <Input.TextArea
                disabled={loading}
                rows={6}
                placeholder={langLabel.dashboard_review_reply_write}
                readOnly={modalLists.data?.is_replied}
              />
            )}
          </Form.Item>

          <div className='btn__group text-right'>
            <Button onClick={onClose}>
              {modalLists.data?.is_replied
                ? langLabel.modeling_order_btn_close
                : langLabel.modeling_order_btn_cancel}
            </Button>
            {!modalLists.data?.is_replied && (
              <Button type='primary' htmlType='submit' loading={loading}>
                {langLabel.btn_submit || 'Submit'}
              </Button>
            )}
          </div>
        </Form>
      </ModalComponentWrapper>
    </Modal>
  );
};

const ModalComponentWrapper = styled.div`
  .ant-modal-content {
    border-radius: 4px;
  }

  .product__title {
    max-width: 80%;
    h3 {
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--text-title);
      font-weight: 500;
    }
  }

  h3.title__view {
    font-size: 14px;
    color: var(--text-title);
    font-weight: 500;
    margin-bottom: 10px;
  }

  .view__reviews {
    max-height: 146px;
    overflow-y: auto;
  }

  textarea {
    resize: none !important;

    &:read-only {
      padding: 0;
      border: 0;
    }

    /* &:active {
      border: 0;
    } */
  }

  textarea,
  .view__reviews {
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-gray-5);
    }

    &::-webkit-scrollbar {
      width: 4px;
    }
  }

  form h3.title__view {
    margin-top: 16px;
  }

  .ant-input[disabled] {
    color: rgba(0, 0, 0, 1);
    padding: 4px 11px;
  }

  .product {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .btn__group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;

    button {
      min-height: 41px;
      min-width: 145px;
      border-radius: 4px;
    }
  }

  .content__review {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    max-height: 300px;
    overflow-y: auto;

    .left {
      h3 {
        margin-bottom: 5px;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-title);
      }

      .text--truncate {
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        white-space: normal;
        overflow: hidden;
        font-size: 14px;
        color: var(--color-gray-9);
        white-space: pre-wrap;
        word-break: break-word;
        text-align: justify;

        &.show {
          -webkit-line-clamp: unset;
          -webkit-box-orient: initial;
          display: initial;
          white-space: inherit;
          overflow: initial;
        }
      }

      .btn__seemore {
        cursor: pointer;
        transform: rotate(90deg);
      }
    }

    button {
      font-weight: 500;
      font-size: 14px;

      &:hover {
        background-color: transparent;
      }
    }
  }
`;

export default ModalComponent;
