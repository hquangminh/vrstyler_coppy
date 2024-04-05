import Link from 'next/link';

import { Button, Typography } from 'antd';

import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import UserSidebarTabs from 'components/Pages/User/Layout/SidebarTabs';
import AvatarUser from 'components/Pages/User/Fragments/AvatarUser';

import { UserPageTabName } from 'models/user.models';
import { AuthModel } from 'models/page.models';

import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

type Props = {
  tabName: UserPageTabName;
  auth?: AuthModel;
};

const UserPageSidebar = (props: Props) => {
  const { langCode, langLabel } = useLanguage();
  const { auth, tabName } = props;

  return (
    <Wrapper>
      <User>
        <AvatarUser avatar={auth?.user.image} isUpload={false} />
        <Typography.Paragraph className='user_name mb-0'>{auth?.user.name}</Typography.Paragraph>

        <Button shape='round'>
          <Link href={`/${langCode}/user/settings`}>{langLabel.my_profile_edit_profile}</Link>
        </Button>
        <hr />
      </User>

      <UserSidebarTabs tabName={tabName} />

      <RegisterSince>
        {langLabel.my_profile_member_since + ': '}
        <Moment date={auth?.user.createdAt} langCode={langCode} />
      </RegisterSince>

      <Footer>
        <Icon iconName='logo-main' />
        <Button shape='round'>
          <Link href='/contact-us'>{langLabel.contact_us}</Link>
        </Button>
      </Footer>
    </Wrapper>
  );
};

export default UserPageSidebar;

const Wrapper = styled.aside`
  position: sticky;
  top: 8rem;
  align-self: start;

  border-radius: 0.5rem;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);

  ${maxMedia.medium} {
    position: inherit;
    border-radius: 0;
    box-shadow: none;
  }
`;

const User = styled.div`
  padding: 20px 20px 0;
  text-align: center;

  ${maxMedia.medium} {
    padding: 20px;
    background-color: var(--userPage_backgroundColorMain);
    hr {
      display: none;
    }
  }

  .user_name {
    margin-top: 1.9rem;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.88px;
    color: var(--text-title);
  }
  .ant-btn {
    margin-top: 10px;
    color: var(--color-primary-700);
    border-color: var(--color-primary-700);
  }
  hr {
    margin: 2rem 0 0;
    border-color: var(--color-line);
  }
`;

const RegisterSince = styled.div`
  padding: 3rem 0.9rem;
  font-size: 1.1rem;
  line-height: 1.45;
  letter-spacing: -0.22px;
  color: var(--text-caption);
  text-align: center;
  text-transform: uppercase;

  ${maxMedia.medium} {
    display: none;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 1.6rem;

  background-color: var(--color-main-1);
  text-align: center;

  .my-icon.logo-main svg {
    height: 2rem;
    width: auto;
    color: var(--text-title);
  }
  .ant-btn {
    font-size: 12px;
    color: var(--color-primary-700);
    border-color: var(--color-primary-700);
  }

  ${maxMedia.medium} {
    display: none;
  }
`;
