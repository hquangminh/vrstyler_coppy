import { memo, useState } from 'react';
import useRouterChange from 'hooks/useRouterChange';
import UploadModelSection from './Fragments/Section';
import styled from 'styled-components';

const ModelPlay = memo(function ModelPlay({ url }: { url: string }) {
  const [loaded, setLoaded] = useState<boolean>(true);

  useRouterChange(
    () => setLoaded(false),
    () => setLoaded(true)
  );

  return (
    <UploadModelSection
      title='Model Demo Viewer'
      tooltip='Drag and drop your file into the viewer below to play the model'>
      <Wrapper
        onMouseMove={() => document.body.classList.add('scroll-disabled')}
        onMouseLeave={() => document.body.classList.remove('scroll-disabled')}>
        {Boolean(loaded && url) && (
          <iframe
            key={Date.now()}
            className='model-viewer'
            allow='autoplay; fullscreen; xr-spatial-tracking'
            allowFullScreen
            src={url}
          />
        )}
      </Wrapper>
    </UploadModelSection>
  );
});
export default ModelPlay;

const Wrapper = styled.div`
  height: 82vh;
  .model-viewer {
    width: 100%;
    height: 100%;
  }
`;
