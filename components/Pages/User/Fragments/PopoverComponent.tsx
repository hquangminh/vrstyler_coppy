import { ReactNode } from 'react';
import { Popover } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const PopoverComponent = ({ content }: { content: ReactNode }) => {
  return (
    <PopoverComponent_wrapper id='popoverContainer'>
      <Popover
        className='custom__popover'
        placement='bottom'
        title={''}
        content={content}
        getPopupContainer={() => document.getElementById('popoverContainer') || document.body}>
        <QuestionCircleOutlined />
      </Popover>
    </PopoverComponent_wrapper>
  );
};

const PopoverComponent_wrapper = styled.div`
  position: relative;
  margin-top: -3rem;

  .custom__popover {
    color: var(--color-main-6);

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  .ant-popover-inner {
    min-width: 45.3rem;
    border-radius: 2rem;

    &-content {
      padding: 2.5rem 2rem;
      font-size: 1.4rem;
      line-height: 2rem;
      letter-spacing: 0.7px;
      color: var(--color-gray-9);

      span {
        font-weight: 500;
      }
    }
  }

  ${maxMedia.small} {
    & > div {
      right: 0;
      left: initial !important;
    }

    .ant-popover {
      left: initial !important;
      right: 0;

      &-arrow {
        left: initial;
        right: 0;
      }
    }

    .ant-popover-inner {
      min-width: 28.8rem;
    }
  }
`;

export default PopoverComponent;
