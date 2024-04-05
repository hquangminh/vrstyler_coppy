import SettingPassword from 'components/Pages/User/MySettings/SettingPassword';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const PasswordComponent = () => {
  return (
    <PasswordComponent_wrapper>
      <SettingPassword type='showroom' />
    </PasswordComponent_wrapper>
  );
};

const PasswordComponent_wrapper = styled.div`
  .ant-input-affix-wrapper {
    height: 40px;
    max-width: 320px;

    ${maxMedia.small} {
      max-width: 100%;
    }
  }

  .text-center {
    text-align: left !important;
  }

  .Btn__Submit {
    margin-top: 20px;
    height: 48px;
    min-width: 213px;
  }
`;

export default PasswordComponent;
