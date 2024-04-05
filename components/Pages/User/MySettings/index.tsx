import Head from 'next/head';

import config from 'config';

import useLanguage from 'hooks/useLanguage';
import UserPageTabContent from '../Layout/TabContent';
import SettingProfile from './SettingProfile';
import SettingEmail from './SettingEmail';
import SettingPassword from './SettingPassword';
import SettingNotification from './SettingNotification';

import { UserPageSettingProps } from 'models/user.models';

import styled from 'styled-components';
import { ChangeRemMobileToPC, maxMedia } from 'styles/__media';

const MySettings = (props: UserPageSettingProps) => {
  const { auth, tabName } = props;
  const { langCode, langLabel } = useLanguage();

  if (!auth) return null;

  const title = `Settings | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <UserPageTabContent
        tabs={[
          {
            title: langLabel.my_profile_setting_tab_profile,
            url: `/${langCode}/user/settings/profile`,
            active: [null, 'profile'].includes(tabName),
          },
          {
            title: langLabel.my_profile_setting_tab_email,
            url: `/${langCode}/user/settings/email`,
            active: tabName === 'email',
          },
          {
            title: langLabel.my_profile_setting_tab_password,
            url: `/${langCode}/user/settings/change-password`,
            active: tabName === 'change-password',
          },
          {
            title: langLabel.my_profile_setting_tab_notification,
            url: `/${langCode}/user/settings/notification`,
            active: tabName === 'notification',
          },
        ]}
      />

      <Content>
        {[null, 'profile'].includes(tabName) && <SettingProfile auth={auth} />}
        {tabName === 'email' && <SettingEmail user={auth.user} />}
        {tabName === 'change-password' && <SettingPassword />}
        {tabName === 'notification' && <SettingNotification auth={auth} />}
      </Content>
    </>
  );
};

export default MySettings;

const Content = styled.div`
  padding: 20px 40px;

  ${maxMedia.medium} {
    padding-inline: 20px;
  }

  .Setting__Content {
    max-width: 640px;
    margin-top: 4.6rem;
  }
  .ant-form .ant-form-item {
    margin-bottom: 3rem;

    .ant-form-item-control-input-content {
      & > .ant-input,
      .ant-input-password .ant-input {
        border-radius: var(--border-radius-base);
      }
      .ant-input-password {
        border-radius: var(--border-radius-base);
      }
    }
  }
  .Btn__Submit {
    min-width: 224px;
    height: 41px;
    font-weight: 600;

    ${maxMedia.small} {
      height: ${ChangeRemMobileToPC('small', 4.2)};
    }
  }
`;
