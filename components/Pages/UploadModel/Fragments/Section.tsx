import { ReactNode } from 'react';

import LabelWithTooltip from './LabelWithTooltip';

import styled from 'styled-components';

interface HeaderProps {
  title: string;
  tooltip?: ReactNode;
  className?: string;
}

export default function UploadModelSection(props: { children: ReactNode } & HeaderProps) {
  const { title, tooltip, className, children } = props;
  return (
    <Wrapper>
      <UploadModelSectionHeader title={title} tooltip={tooltip} className={className} />
      <div>{children}</div>
    </Wrapper>
  );
}

export const UploadModelSectionHeader = ({ title, tooltip, className }: HeaderProps) => {
  return (
    <Header className={className}>
      {title}
      {tooltip && <LabelWithTooltip title='' tooltip={tooltip} />}
    </Header>
  );
};

const Wrapper = styled.main`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.1);

  & > div {
    margin-top: 20px;
  }
`;
const Header = styled.h4`
  display: flex;
  align-items: center;
  gap: 6px;

  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-title);
  border-bottom: var(--border-1px);
`;
