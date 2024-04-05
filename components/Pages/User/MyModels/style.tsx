import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const MyModels_wrapper = styled.div`
  padding: 20px 40px;

  ${maxMedia.medium} {
    padding-inline: 20px;
  }
`;

export const Header_wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const MyModels__List = styled.div`
  margin-top: 5px;

  ${maxMedia.medium} {
    margin-inline: -20px;
    padding: 0 20px;
    overflow-x: scroll;

    .card__item {
      flex-shrink: 0;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export const BodyDownloaded_wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.6rem;
`;
