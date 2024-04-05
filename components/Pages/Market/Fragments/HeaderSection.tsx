import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  title: string;
  caption?: string;
};

const HeaderSection = (props: Props) => {
  return (
    <Wrapper className='market_homepage-section_header'>
      <h3 dangerouslySetInnerHTML={{ __html: props.title }} />
      {props.caption && <p dangerouslySetInnerHTML={{ __html: props.caption }} />}
    </Wrapper>
  );
};
export default HeaderSection;

const Wrapper = styled.div`
  max-width: 550px;
  margin: 0 auto;
  text-align: center;
  overflow-wrap: break-word;

  h3 {
    position: relative;
    padding-bottom: 30px;
    font-size: 32px;
    font-weight: 500;
    color: var(--color-primary-700);

    &:after {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #b2ebf2;
    }

    ${maxMedia.small} {
      font-size: 25px;
    }
  }

  p {
    margin-top: 10px;
    font-size: 16px;
    color: var(--text-caption);
    white-space: normal;
  }

  ${maxMedia.small} {
    br {
      display: none;
    }
  }
`;
