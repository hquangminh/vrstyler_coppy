import { useState } from 'react';

import { Button, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

import { abbreviateNumber, handlerMessage } from 'common/functions';
import showroomServices from 'services/showroom-services';
import { onBeforeUpload } from './helpers';

import MyImage from 'components/Fragments/Image';
import { AuthModel } from 'models/page.models';

import styled from 'styled-components';
import useLanguage from 'hooks/useLanguage';

type Props = {
  auth: AuthModel;
};

const CardVipComponent = (props: Props) => {
  const i18n = useLanguage();

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState({
    card: props.auth.user?.market_showroom?.card,
    oldCard: props.auth.user?.market_showroom?.card || '',
    filetypeCard: '',
    filenameCard: '',
  });

  const productTotal = abbreviateNumber(
    props.auth.user?.market_items_aggregate.aggregate.count || 0
  );

  const onSetState = (base64: string, file: RcFile) => {
    setCards((prevState) => ({ ...prevState, card: base64 }));
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const resp = await showroomServices.updateShowroom(cards);
      if (!resp.error) {
        setCards((prevState) => ({
          ...prevState,
          oldCard: resp.data.market_showroom.card,
          card: resp.data.market_showroom.card,
        }));
        handlerMessage(i18n.t('message_edit_success'), 'success');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  return (
    <div className='card__vip'>
      <div className='note'>
        <h3>{i18n.t('dashboard_card_vip_title')}</h3>
        <ul dangerouslySetInnerHTML={{ __html: i18n.t('dashboard_card_vip_description') }} />
        <h4>{i18n.t('dashboard_card_vip_request_title')}:</h4>
        <ul
          dangerouslySetInnerHTML={{ __html: i18n.t('dashboard_card_vip_request_description') }}
        />
      </div>

      <CardVip_wrapper>
        <div className='card__header'>
          <img
            src={
              cards.card ||
              'https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1676019311500_840813/banner-showroom-detail.png'
            }
            alt=''
          />
        </div>
        <div className='card__title'>
          <div className='title'>
            <div className='icon'>
              <MyImage src={props.auth.user?.image} alt='' width={56} height={56} />
            </div>

            <p className='name' title={props.auth.user?.name}>
              {props.auth.user?.name}
            </p>
          </div>
          <p className='total'>
            {productTotal.toString() +
              ' ' +
              ((props.auth.user?.market_items_aggregate.aggregate.count || 0) > 1
                ? i18n.t('modeling_products', 'products')
                : i18n.t('modeling_product', 'product')
              ).toLowerCase()}
          </p>
        </div>
      </CardVip_wrapper>

      {!cards.card && <p className='required'>{i18n.t('dashboard_card_vip_note')}</p>}

      {!cards.card?.includes('base64') ? (
        <Upload
          accept='.png, .jpg, .jpeg, .webp'
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => onBeforeUpload(file, 'image', i18n.langLabel, onSetState)}>
          <Button type='primary' className='btn__action'>
            {i18n.t('btn_edit', 'Edit')}
          </Button>
        </Upload>
      ) : (
        <Button type='primary' className='btn__action' onClick={onSave} loading={loading}>
          {i18n.t('btn_save', 'Save')}
        </Button>
      )}
    </div>
  );
};

export default CardVipComponent;

const CardVip_wrapper = styled.div`
  width: 397px;
  margin-top: 16px;
  box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3);
  border-radius: 8px;
  overflow: hidden;
  .card__header {
    height: 132px;
    overflow: hidden;
  }

  .card__title {
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      display: flex;

      gap: 10px;
      align-items: center;
      margin-top: -16px;

      .name {
        margin-bottom: 12px;
        font-weight: 500;
        font-size: 16px;
        color: var(--color-gray-11);
        align-self: end;
        width: 200px;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .total {
      font-size: 12px;
      color: var(--color-gray-7);
      margin-top: 5px;
    }

    .icon {
      background-color: #fff;
      border: 2px solid #fff;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      margin-bottom: 8.5px;
    }
  }
`;
