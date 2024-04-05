import { ReactNode } from 'react';

import { ConfigProvider, Flex, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';

import styled from 'styled-components';

const TooltipWrapper = styled(Flex)`
  .ant-tooltip {
    max-width: calc(50vw - 100px);
    .ant-tooltip-arrow::after {
      background-color: #424153;
    }
    .ant-tooltip-content {
      .ant-tooltip-inner {
        padding-block: 8px;
        line-height: 1.5;
        ul > li + li {
          margin-top: 4px;
        }
        li > span[role='img'].anticon {
          margin-right: 6px;
          font-size: 12px;
        }
        li > span[aria-label='check'] {
          color: ${green[4]};
        }
        li > span[aria-label='close'] {
          color: ${red[4]};
        }
        a {
          text-decoration: underline;
          color: #1890ff;
        }
      }
    }
  }
`;

const LabelWithTooltip = (props: { title: string; tooltip: string | ReactNode }) => (
  <TooltipWrapper align='center' justify='center' gap={4}>
    {props.title}
    <ConfigProvider theme={{ token: { colorBgSpotlight: '#424153', paddingXS: 12 } }}>
      <Tooltip title={props.tooltip} placement='right' getPopupContainer={(elm) => elm}>
        <InfoCircleOutlined />
      </Tooltip>
    </ConfigProvider>
  </TooltipWrapper>
);

export default LabelWithTooltip;
