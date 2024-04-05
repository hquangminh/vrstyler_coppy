import { useEffect, useState } from 'react';

import { Button, Spin, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

import useLanguage from 'hooks/useLanguage';
import { handlerMessage } from 'common/functions';
import { onBeforeUpload } from './helpers';

import BannerShowroom from 'components/Pages/Showroom/ShowroomDetail/Banner';

import showroomServices from 'services/showroom-services';

import { AuthModel } from 'models/page.models';
import { ShowroomStatisticalType } from 'models/showroom.models';

import styled from 'styled-components';

type Props = { auth: AuthModel };

const BannerComponent = (props: Props) => {
  const i18n = useLanguage();

  const [banners, setBanners] = useState({
    banner: props.auth.user?.market_showroom?.banner,
    oldBanner: props.auth.user?.market_showroom?.banner ?? '',
    filetypeBanner: '',
    filenameBanner: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingFetchData, setLoadingFetchData] = useState(true);

  const [statistical, setStatistical] = useState<ShowroomStatisticalType>();

  useEffect(() => {
    (async () => {
      try {
        const resp = await showroomServices.getShowroomStatistical(props.auth.user?.nickname || '');
        if (!resp.error) {
          setStatistical(resp.data);
          setLoadingFetchData(false);
        }
      } catch (error) {
        setLoadingFetchData(false);
      }
    })();
  }, [props.auth]);

  const onSetState = (imageBase64: string, file: RcFile) => {
    setBanners((prevState) => ({
      ...prevState,
      banner: imageBase64 as string,
      filetypeBanner: file.type,
      filenameBanner: file.name,
    }));
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const resp = await showroomServices.updateShowroom(banners);
      if (!resp.error) {
        setBanners((prevState) => ({
          ...prevState,
          oldBanner: resp.data.market_showroom.banner,
          banner: resp.data.market_showroom.banner,
        }));
        handlerMessage(i18n.t('message_edit_success'), 'success');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  return (
    <BannerComponent_wrapper className='banner'>
      {loadingFetchData ? (
        <div className='loading__wrapper'>
          <Spin />
        </div>
      ) : (
        <>
          <div className='note'>
            <h3>{i18n.t('dashboard_card_banner_title', 'Banner Showroom')}</h3>
            <ul dangerouslySetInnerHTML={{ __html: i18n.t('dashboard_card_banner_description') }} />
            <h4>{i18n.t('dashboard_card_banner_request_title', 'Image request')}:</h4>
            <ul
              dangerouslySetInnerHTML={{
                __html: i18n.t('dashboard_card_banner_request_description'),
              }}
            />
          </div>

          <Banner_wrapper>
            <BannerShowroom statistical={statistical} bannerImg={banners.banner || ''} />
          </Banner_wrapper>

          {!banners.banner && <p className='required'>{i18n.t('dashboard_card_banner_note')}</p>}

          {!banners.banner?.includes('base64') ? (
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
        </>
      )}
    </BannerComponent_wrapper>
  );
};

export default BannerComponent;

const BannerComponent_wrapper = styled.div`
  .btn__action {
    min-width: 213px;
    height: 48px;
  }

  .loading__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1340px;
    min-height: 400px;
  }
`;

const Banner_wrapper = styled.div`
  margin-top: 16px;
`;
