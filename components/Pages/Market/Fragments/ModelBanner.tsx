import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';

import styled from 'styled-components';

import useWindowSize from 'hooks/useWindowSize';

import { maxMedia } from 'styles/__media';

const ModelInBanner = ({ model }: { model: string }) => {
  const { width } = useWindowSize();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  useEffect(() => {
    window.onbeforeunload = function () {
      setIsLoaded(false);
    };
  }, []);

  const onProgress = (event: any) => {
    const progressBar = event.target.querySelector('.progress-bar');
    const updatingBar = event.target.querySelector('.update-bar');
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if (event.detail.totalProgress == 1) {
      progressBar.classList.add('hide');
    }
  };

  const onUpdateModel = useCallback(
    (model: Element | null) => {
      if (width) model?.setAttribute('scale', width < 992 ? '0.9 0.9 0.9' : '0.8 0.8 0.8');
      setIsLoaded(true);
    },
    [width]
  );

  useEffect(() => {
    let modelIntro = document.querySelector('#model-intro');
    modelIntro?.addEventListener('progress', onProgress);
    modelIntro?.addEventListener('load', () => onUpdateModel(modelIntro), { once: true });
  }, [onUpdateModel, width]);

  const ModelViewer = `
    <model-viewer
      id="model-intro"
      environment-image='/static/models/Santa-environment.hdr'
      src='${model}'
      camera-controls
      disable-zoom
			environment-image="legacy"
      autoplay
			shadow-softness="0.7"
			exposure="3"
			shadow-intensity="1"
			ar-modes="webxr scene-viewer quick-look"
			interaction-prompt="none"
			bounds="tight"
			modelCacheSize="0"
      camera-orbit="320deg auto auto"
			xr-environment
			rotation-per-second="20deg"
      style="background-color: unset;"
    >
      <div class="progress-bar" slot="progress-bar">
        <div class="update-bar"></div>
      </div>
    </model-viewer>
  `;

  return (
    <>
      <Script type='module' src='https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js' />
      <Script noModule src='https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js' />
      <Script src='https://unpkg.com/focus-visible@5.0.2/dist/focus-visible.js' defer />

      <Wrapper
        dangerouslySetInnerHTML={{ __html: ModelViewer }}
        onTouchStart={() => (document.body.style.cssText = 'overflow: hidden; touch-action: none;')}
        onTouchEnd={() => (document.body.style.cssText = '')}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </>
  );
};

export default ModelInBanner;

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;

  width: 60%;
  height: 100%;

  model-viewer {
    width: 100%;
    height: 100%;

    /* --progress-bar-color: transparent:  !important; */
    --poster-color: transparent !important;
  }

  .progress-bar {
    display: block;
    width: 33%;
    height: 4px;
    max-height: 2%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 25px;
    box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.5), 0px 0px 5px 1px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.9);
    background-color: rgba(0, 0, 0, 0.5);
  }

  .progress-bar.hide {
    visibility: hidden;
    transition: visibility 0.3s;
  }

  .update-bar {
    background-color: rgba(255, 255, 255, 0.9);
    width: 0%;
    height: 100%;
    border-radius: 25px;
    float: left;
    transition: width 0.3s;
  }

  ${maxMedia.medium} {
    top: 20px;
    right: 0;
    width: 100%;
    height: 50vw;
    transform: unset;
  }

  ${maxMedia.small} {
    height: 80vw;
  }
`;
