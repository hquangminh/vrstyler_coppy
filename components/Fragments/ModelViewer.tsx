import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

import styled from 'styled-components';
import { Select } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useIsFirstRender from 'hooks/useIsFirstRender';

import { maxMedia } from 'styles/__media';

type Props = {
  className?: string;
  fileGlb: string;
  fileUsdz?: string;
  bgColor?: string;
  isZoom?: boolean;
  isAr?: boolean;
  features_enable?: boolean;
};

const ModelViewer = (props: Props) => {
  const { features_enable } = props;

  const router = useRouter();
  const isFirst = useIsFirstRender();
  const { width } = useWindowSize();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [variants, setVariants] = useState<string[]>();

  const id = router.asPath.split('--')[1];

  useEffect(() => {
    let modelIntro: any = document.querySelector('#modelViewer');

    modelIntro?.addEventListener('load', () => {
      setIsLoaded(true);

      // Tracking model variant
      const variants: any = modelIntro.availableVariants;
      setVariants(variants);
    });
  }, [id]);

  const onChangeLighting = (type: string) => {
    let modelIntro: any = document.querySelector('#modelViewer');

    switch (type) {
      case 'sunset':
        modelIntro?.setAttribute('environment-image', '/static/kiara_8_sunset_1k.hdr');
        modelIntro?.setAttribute('skybox-image', '/static/kiara_8_sunset_1k.hdr');
        break;
      case 'sunrise':
        modelIntro?.setAttribute('environment-image', '/static/kiara_4_mid-morning_1k.hdr');
        modelIntro?.setAttribute('skybox-image', '/static/kiara_4_mid-morning_1k.hdr');
        break;
      case 'night':
        modelIntro?.setAttribute('environment-image', '/static/sandsloot_1k.hdr');
        modelIntro?.setAttribute('skybox-image', '/static/sandsloot_1k.hdr');
        break;
      default:
        modelIntro?.setAttribute('environment-image', 'legacy');
        modelIntro?.setAttribute('skybox-image', '');
    }
  };

  const onChangeVariant = (name: string) => {
    let modelIntro: any = document.querySelector('#modelViewer');
    modelIntro.variantName = name;
  };

  const ModelViewer = `
    <model-viewer
      id="modelViewer"
      src='${props.fileGlb}'
      ${props.fileUsdz ? `ios-src="${props.fileUsdz}"` : ''}
			environment-image="legacy"
      autoplay
			shadow-softness="0.5"
			exposure="1.2"
			shadow-intensity="1"
			ar-modes="webxr scene-viewer quick-look"
			interaction-prompt="none"
			bounds="tight"
			loading="lazy"
			modelCacheSize="0"
			${props.isAr ? 'ar' : ''}
			${props.isZoom ? '' : 'disable-zoom'}
			enable-pan
			xr-environment
			camera-controls
			auto-rotate
			rotation-per-second="10deg"
      style="background-color: ${props.bgColor ?? '#F3f3f3'};"
		>
      <button slot="ar-button" style="background-color: white; padding: 8px; border-radius: 50%; border: none; position: absolute; bottom: 65px; right: 10px;">
        <img src="/static/images/button-ar.png" alt="button ar" style="width: 22px;" />
      </button>
    </model-viewer>
  `;

  return (
    <>
      <Script type='module' src='https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js' />
      <Script noModule src='https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js' />
      {/*<Script src='https://unpkg.com/focus-visible@5.0.2/dist/focus-visible.js' defer /> */}

      <Wrapper id='model-viewer-wrapper' className={props.className}>
        <div
          className='w-100 h-100'
          onTouchStart={() => (document.body.style.cssText = 'overflow:hidden; touch-action:none;')}
          onTouchEnd={() => (document.body.style.cssText = '')}
          dangerouslySetInnerHTML={{ __html: ModelViewer }}
        />

        {isLoaded && !isFirst && (
          <div className='ModelViewer__Action'>
            {features_enable && (
              <Select
                defaultValue='neutral'
                size={width <= 640 ? 'small' : 'middle'}
                style={{ width: width <= 640 ? 100 : 110 }}
                getPopupContainer={(trigger) => {
                  return trigger;
                }}
                onChange={onChangeLighting}>
                <Select.Option value='neutral'>Neutral</Select.Option>
                <Select.Option value='sunset'>Sunset</Select.Option>
                <Select.Option value='sunrise'>Sunrise</Select.Option>
                <Select.Option value='night'>Mid-night</Select.Option>
              </Select>
            )}
            {variants && variants?.length > 0 && (
              <Select
                defaultValue={variants[0]}
                size={width <= 640 ? 'small' : 'middle'}
                style={{ width: width <= 640 ? 110 : 130 }}
                getPopupContainer={(trigger) => {
                  return trigger;
                }}
                onChange={onChangeVariant}>
                {variants.map((item) => {
                  return (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default ModelViewer;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  model-viewer {
    width: 100%;
    height: 100%;

    /* --progress-bar-color: transparent; */
    --progress-bar-color: rgba(var(--primary-rgb-700), 50%);
    --poster-color: transparent;
  }

  #default-ar-button {
    bottom: 20px;
    right: 10px;
  }

  .ModelViewer__Action {
    position: absolute;
    top: 18px;
    left: 18px;

    display: flex;
    gap: 10px;

    .ant-select-arrow {
      font-size: 12px;
    }
    .ant-select-selection-item {
      display: inline-block;
      padding-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ${maxMedia.small} {
      top: 10px;
      left: 10px;

      .ant-select {
        font-size: 12px;
      }
      .ant-select-item {
        min-height: 28px;
        padding: 0 12px;
        font-size: 12px;
        line-height: 28px;
      }
    }
  }
`;
