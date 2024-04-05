import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button, ConfigProvider, Typography } from 'antd';

import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';
import { avtDefault } from 'common/constant';
import { urlGoToProfile } from 'common/functions';
import { SelectAuthInfo } from 'store/reducer/auth';

import MyImage from 'components/Fragments/Image';
import HeaderNotification from 'components/Layout/Header/Fragments/Notification';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  left: 0;
  z-index: 9;

  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;

  .Dashboard__Header {
    &__Right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }
  .text-truncate-line {
    color: #161723;
    line-height: 1.4;
    font-weight: 500;
  }
`;
const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  color: var(--color-gray-11);
  cursor: pointer;
`;

export default function DashboardHeader() {
  const { push } = useRouter();
  const { t } = useLanguage();

  const UserInfo = useSelector(SelectAuthInfo);

  const handelGoToProfile = () => {
    if (UserInfo) {
      const url = urlGoToProfile(UserInfo?.type, UserInfo?.nickname ?? '');
      if (url) push(url);
    }
  };

  return (
    <Wrapper>
      <div className='Dashboard__Header__Left'>
        {UserInfo?.type === 3 && (
          <ConfigProvider
            theme={{ token: { colorPrimary: '#368bd9', borderRadius: 4, fontSizeLG: 14 } }}>
            <Button type='primary' size='large'>
              <Link href={urlPage.upload}>{t('btn_upload_model', 'Upload 3D model')}</Link>
            </Button>
          </ConfigProvider>
        )}
      </div>
      <div className='Dashboard__Header__Right'>
        <HeaderNotification />
        {UserInfo && (
          <UserAvatar onClick={handelGoToProfile}>
            <MyImage
              src={UserInfo.image}
              img_error={avtDefault}
              alt=''
              width={32}
              height={32}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <Typography.Paragraph className='mb-0 text-truncate-line'>
              {UserInfo?.name}
            </Typography.Paragraph>
          </UserAvatar>
        )}
      </div>
    </Wrapper>
  );
}
