import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';

import styled from 'styled-components';

const Wrapper = styled.div`
  .ant-tabs-tab:not(.ant-tabs-tab-active) .ant-tabs-tab-btn:focus {
    color: inherit;
  }
`;

type Props = {
  tabItems: TabsProps['items'];
};

export default function DashboardTab({ tabItems }: Readonly<Props>) {
  const router = useRouter();

  useEffect(() => {
    if (tabItems?.findIndex((i) => i.key === router.query.key?.toString()) === -1) {
      router.replace({ query: { key: tabItems[0].key } }, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTabs = (key: string) => {
    router.push({ query: { key } }, undefined, { shallow: true });
  };

  return (
    <Wrapper>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              horizontalItemPadding: '24px 0',
              inkBarColor: 'transparent',
              titleFontSize: 16,
            },
          },
        }}>
        <Tabs
          tabBarGutter={50}
          items={tabItems}
          onChange={onChangeTabs}
          activeKey={router.query.key?.toString() ?? tabItems?.[0].key}
          tabBarStyle={{ marginBottom: 32 }}
        />
      </ConfigProvider>
    </Wrapper>
  );
}
