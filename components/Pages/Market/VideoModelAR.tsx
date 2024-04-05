import { useRef } from 'react';
import useLanguage from 'hooks/useLanguage';

import styled from 'styled-components';

import HeaderSection from './Fragments/HeaderSection';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const VideoModelAR = ({ video }: { video: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { langLabel } = useLanguage();
  return (
    <Wrapper>
      <Container>
        <HeaderSection
          title={langLabel.homepage_ar_title}
          caption={langLabel.homepage_ar_caption}
        />

        <video ref={videoRef} autoPlay loop muted playsInline>
          <source src={video} type='video/mp4' />
        </video>
      </Container>
    </Wrapper>
  );
};
export default VideoModelAR;

const Wrapper = styled.section`
  padding: 100px 0;
  text-align: center;

  ${maxMedia.small} {
    padding: 50px 0;
  }

  video {
    width: 100%;
    max-width: 820px;
    margin: 40px auto 0;
  }
`;
