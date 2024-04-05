import React from 'react';
import { Rate } from 'antd';
import styled from 'styled-components';

const CalculateReviews = ({ value, size }: { value: number; size?: number }) => {
  const decimalValue = (value - Math.floor(value)) * 100;
  const posinset = Math.floor(value) + 1;

  return (
    <RatePoint width={decimalValue} posinset={posinset}>
      <Rate disabled allowHalf value={value} style={{ fontSize: size ?? 20 }} />
    </RatePoint>
  );
};

export default CalculateReviews;

const RatePoint = styled.div<{ width?: number; posinset: number }>`
  display: inline-flex;
  .ant-rate-star:nth-child(${(props) => props.posinset}) {
    .ant-rate-star-first {
      width: ${(props) => props.width}%;
      color: #fadb14 !important;
      opacity: 1;
    }
    .ant-rate-star-second {
      width: ${(props) => 100 - (props.width || 0)}%;
      color: #f0f0f0 !important;
      opacity: 1;
    }
  }
`;
