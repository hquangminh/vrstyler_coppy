import styled from 'styled-components';
import { ChangeRemMobileToPC, maxMedia } from 'styles/__media';

export const Wrapper = styled.section`
  .box {
    padding: 17rem 0 16rem;

    background-image: url('/static/images/market/statistical-bg-01.png'),
      url('/static/images/market/statistical-bg-02.png');
    background-repeat: no-repeat;
    background-position: 3rem top, right 20rem bottom;

    animation: bgIconAnimationMobile 4000ms linear infinite;

    ${maxMedia.custom(768)} {
      padding: 4rem 0 4rem;
      background-size: 15vw auto;
      background-position: 3rem 0, right 4rem bottom 2rem;

      animation: bgIconAnimationMobile 6000ms linear infinite;
    }

    ${maxMedia.xsmall} {
      padding: 0;
    }
  }

  @keyframes bgIconAnimation {
    0% {
      background-position: 3rem top, right 20rem bottom;
    }
    50% {
      background-position: 3rem 2rem, right 20rem bottom 2rem;
    }
    100% {
      background-position: 3rem top, right 20rem bottom;
    }
  }

  @keyframes bgIconAnimationMobile {
    0% {
      background-position: 3rem 0, right 4rem bottom 2rem;
    }
    50% {
      background-position: 3rem 2rem, right 4rem bottom 0rem;
    }
    100% {
      background-position: 3rem 0, right 4rem bottom 2rem;
    }
  }
`;
export const List = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${maxMedia.custom(768)} {
    flex-direction: column;
    align-items: center;
  }
`;
export const Item = styled.div`
  flex: 1;

  font-size: 3.2rem;
  text-align: center;

  ${maxMedia.xsmall} {
    font-size: ${ChangeRemMobileToPC('xsmall', 1.8)};
  }

  &:nth-child(2) {
    border: 2px solid #b2ebf2;
    border-width: 0 2px 0;

    ${maxMedia.custom(768)} {
      flex: content;
      width: fit-content;
      padding: 1rem 0;
      margin: 1rem 0;
      border-width: 2px 0;
    }
  }

  .total {
    font-weight: 600;
    color: var(--color-primary-700);
  }

  .label {
    display: inline-flex;
    align-items: center;
    gap: 1rem;

    margin-top: 0.8rem;
    font-weight: 400;
    color: var(--text-caption);

    ${maxMedia.xsmall} {
      margin-top: 0;
    }

    img {
      width: 26px;

      ${maxMedia.xsmall} {
        width: 14px;
        margin-right: 5px;
      }
    }
  }
`;
