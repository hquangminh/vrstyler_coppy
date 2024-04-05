import { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

const Wrapper = styled.section<{ customStyle?: string }>`
  padding: 100px 50px;
  text-align: center;

  img {
    width: 200px;
    margin-bottom: 10px;
  }
  .result-empty-title {
    font-size: 16px;
    color: var(--text-title);
  }
  .result-empty-description {
    margin-top: 5px;
    font-size: 14px;
    color: #8b8b8b;
  }
`;

const ResultEmpty = ({
  title,
  description,
  customStyle,
}: {
  title?: ReactNode;
  description?: ReactNode;
  customStyle?: CSSProperties;
}) => {
  return (
    <Wrapper style={customStyle}>
      <img src='/static/images/result-empty.png' alt='Result Empty' />
      {title && <p className='result-empty-title'>{title}</p>}
      <div className='result-empty-description'>{description || 'Data not found'}</div>
    </Wrapper>
  );
};

export default ResultEmpty;
