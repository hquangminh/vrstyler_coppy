import styled from 'styled-components';

import DecorationSectionAction from './SectionAction';

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  &.active .decoration-banner-default {
    border-color: var(--color-gray-6);
  }
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .decoration-banner-default {
    padding: 40px;
    border: 1px solid transparent;
  }
`;

interface DecorationBannerProps {
  image?: string;
  focused?: boolean;
  onSelect?: () => void;
  onDelete: () => void;
}

export default function DecorationBanner(props: DecorationBannerProps) {
  return (
    <Wrapper className={'decoration-section' + (props.focused ? ' active' : '')}>
      <div onClick={props.onSelect}>
        {props.image ? (
          <img src={props.image} alt='' />
        ) : (
          <div className='decoration-banner-default'>
            <img src='/static/images/showroom/decoration/toolbar-category-banner.jpg' alt='' />
          </div>
        )}
      </div>

      <DecorationSectionAction onDelete={props.onDelete} />
    </Wrapper>
  );
}
