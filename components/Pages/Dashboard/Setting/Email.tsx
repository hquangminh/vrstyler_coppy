import SettingEmail from 'components/Pages/User/MySettings/SettingEmail';

import { UserModel } from 'models/user.models';

import styled from 'styled-components';

type Props = {
  user: UserModel;
};

const EmailComponent = (props: Props) => {
  return (
    <EmailComponent_wrapper className='Setting__Content'>
      <SettingEmail user={props.user} />
    </EmailComponent_wrapper>
  );
};

export default EmailComponent;

const EmailComponent_wrapper = styled.div`
  .Header__Page__Content {
    display: none;
  }
  .Setting__Content {
    max-width: 320px;
    .ant-form .ant-form-item {
      margin-bottom: 32px;
    }
    .ant-input {
      height: 40px;
      border-radius: var(--border-radius-base);
    }
  }
  .settingEmail__Btn {
    justify-content: flex-start;
  }
  .Btn__Submit {
    min-width: 210px;
    height: 48px;
    font-weight: 600;
  }
`;
