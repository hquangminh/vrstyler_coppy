import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export const FormSuccess_wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  background: url('static/images/register/banner-line.png') no-repeat;
  background-position: center;
  background-size: 100% auto;

  ${maxMedia.small} {
    background-image: url('static/images/register/banner-line-mobile.png');
    background-position: bottom 35% center;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h3 {
    font-size: 3.2rem;
    line-height: 4rem;
    color: var(--color-main-6);
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-caption);
    span {
      color: var(--text-title);
      font-weight: 500;
    }
  }

  .img__banner {
    margin: 3rem auto 3rem auto;
    max-width: 40.1rem;
    max-height: 41.7rem;
  }

  button {
    max-width: 34.3rem;
    height: 3.8rem;
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 2.2rem;
  }

  ${maxMedia.small} {
    padding: 0 2rem;

    h3 {
      font-size: 2.3rem;
      letter-spacing: 0.72px;
    }

    .img__banner {
      margin: 2rem auto 2rem auto;
    }

    button {
      height: 5.46rem;
      font-size: 2rem;
    }
  }
`;
