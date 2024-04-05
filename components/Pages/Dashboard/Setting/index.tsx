import { useSelector } from 'react-redux';

import styled from 'styled-components';

import useLanguage from 'hooks/useLanguage';
import { AppState } from 'store/type';

import DashboardTab from 'components/Layout/Dashboard/Tab';
import ProfileComponent from 'components/Pages/Dashboard/Setting/Profile';
import EmailComponent from 'components/Pages/Dashboard/Setting/Email';
import PasswordComponent from 'components/Pages/Dashboard/Setting/Password';

export default function DashboardSetting() {
  const i18n = useLanguage();
  const auth = useSelector((state: AppState) => state.auth);

  if (!auth) return null;

  return (
    <SettingComponentWrapper>
      <DashboardTab
        tabItems={[
          {
            key: 'profile',
            label: i18n.t('dashboard_setting_tab_profile', 'Profile'),
            children: <ProfileComponent auth={auth} />,
          },
          {
            key: 'email',
            label: 'Email',
            children: <EmailComponent user={auth.user} />,
          },
          {
            key: 'password',
            label: i18n.t('password', 'Password'),
            children: <PasswordComponent />,
          },
        ]}
      />
    </SettingComponentWrapper>
  );
}

export const SettingComponentWrapper = styled.div`
  .ant-form-item-required {
    color: var(--color-gray-11);
  }

  .btn__submit {
    height: 48px;
    min-width: 213px;
  }

  .ant-form .ant-form-item .ant-form-item-label > label {
    margin-bottom: 6px;
  }
`;
