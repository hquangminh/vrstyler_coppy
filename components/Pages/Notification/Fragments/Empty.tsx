import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const Empty = ({ title }: { title: string }) => {
  return (
    <NoNotification__Wrapper>
      <img className='no-data' src='/static/images/notification/icon-bell.png' alt='icon-no-data' />
      <p>{title}</p>
    </NoNotification__Wrapper>
  );
};

export default Empty;

const NoNotification__Wrapper = styled.div`
  text-align: center;
  padding: 100px 0;
  .no-data {
    color: var(--color-gray-7);
    width: auto;
    height: 80px;
  }
  p {
    padding-top: 5px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-gray-7);
  }
  ${maxMedia.medium} {
    margin: 0;
    padding: 100px 0;
  }
  ${maxMedia.small} {
    margin: 0;
    padding: 100px 0;
  }
  ${maxMedia.xsmall} {
    margin: 0;
    padding: 100px 0;
  }
`;
