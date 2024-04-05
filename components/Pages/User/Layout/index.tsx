import React from 'react';

import UserPageSidebar from './Sidebar';

import { UserPageTabName } from 'models/user.models';
import { AuthModel } from 'models/page.models';

import styled from 'styled-components';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

interface Props {
  auth?: AuthModel;
  children: React.ReactNode;
  tabName: UserPageTabName;
}

export default function UserLayout(props: Readonly<Props>) {
  return (
    <Wrapper>
      <Container>
        <Layout>
          <UserPageSidebar tabName={props.tabName} auth={props.auth} />
          <Content>{props.children}</Content>
        </Layout>
      </Container>
    </Wrapper>
  );
}

export const Wrapper = styled.main`
  padding: 20px 0 2rem;

  background: var(--userPage_backgroundColorMain);

  ${maxMedia.medium} {
    padding-bottom: 0;

    & > div {
      padding: 0;
    }
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 24rem calc(100% - 26rem);
  gap: 0 2rem;

  ${maxMedia.medium} {
    display: block;
  }
`;

export const Content = styled.div`
  border-radius: 0.5rem;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
`;
