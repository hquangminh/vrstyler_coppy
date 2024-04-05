import styled, { css } from 'styled-components';

import { ContainerSize } from 'models';

import { maxMedia } from './__media';

export const Container = styled.div<{ size?: ContainerSize }>`
  ${({ size }) => {
    if (!size || size === 'default')
      return css`
        max-width: 1440px;
      `;
    else if (size === 'large')
      return css`
        max-width: 2100px;
      `;
  }}
  margin: ${(props) => (props.size !== 'free' ? '0 auto' : '')};
  padding: 0 50px;

  ${maxMedia.custom(1024)} {
    padding-inline: 32px;
  }
  ${maxMedia.medium} {
    padding: 0 20px;
  }
`;
export const ContainerLarge = styled.div`
  max-width: 2100px;
  padding: 0 50px;
  margin: 0 auto;

  ${maxMedia.medium} {
    padding: 0 20px;
  }
`;
export const ContainerFreeSize = styled.div`
  padding: 0 50px;

  ${maxMedia.medium} {
    padding: 0 20px;
  }
`;

export const TextLineCamp = styled.p<{ line?: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${({ line }) => line || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

export const PageContent = styled.div<{ noCustom?: boolean }>``;
