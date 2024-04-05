import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { GetToken } from 'store/reducer/auth';

import FooterSample from 'components/Layout/FooterSample';
import DashboardHeader from 'components/Layout/Dashboard/Header';
import DashboardSidebar from 'components/Layout/Dashboard/Sidebar';

import { DashboardPage } from 'models/dashboard.models';

const Layout = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);

  // Style message info
  .withdraw__notification--info {
    background-color: #fff1f0;
    border: 1px solid #ffccc7;
    box-shadow: 0px 4px 8px rgba(255, 77, 79, 0.1);
    padding: 10px 16px;

    .ant-notification-notice-message {
      margin-left: 26px;
      margin-bottom: 0;
      color: var(--text-title);
      font-weight: 500;
      font-size: 18px;
    }

    .ant-notification-notice-close {
      top: 10px;
    }

    .ant-notification-notice-description {
      margin-top: 10px;
      margin-left: 0;
    }

    .ant-notification-notice-icon {
      margin-left: 0;
      margin-top: -5px;
    }

    .warning-alert {
      color: #ff4d4f;
      svg {
        width: 16px;
        height: auto;
      }
    }
  }
`;
const Page = styled.div`
  max-height: 100vh;
  overflow-y: auto;
`;
const Content = styled.div`
  padding: 0 24px;
  min-width: 1200px;
  min-height: calc(100vh - 170px);
`;

type Props = {
  pageName?: DashboardPage;
  children?: React.ReactNode;
};

const DashboardLayout = (props: Props) => {
  const token = useSelector(GetToken);

  if (!token) return null;

  return (
    <Layout id='layoutWrapper'>
      <DashboardSidebar menuActive={props.pageName} />
      <Page>
        <DashboardHeader />
        <Content>{props.children}</Content>
        <FooterSample />
      </Page>
    </Layout>
  );
};

export default DashboardLayout;
