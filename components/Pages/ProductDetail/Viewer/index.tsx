import { useEffect, useState } from 'react';

import config from 'config';

import { ProductModel } from 'models/product.model';

import * as L from './style';

const ProductViewer = ({ data }: { data: ProductModel }) => {
  const [urlViewer, setUrlViewer] = useState<string>();

  useEffect(() => {
    if (data) {
      let URLModelViewer = config.urlModelViewer + '/' + data.id + '?';

      if (data.viewer_bg && !data.config_3d_viewer?.background) {
        URLModelViewer += `background=${data.viewer_bg.split('#')[1]}`;
      }

      if (data.config_3d_viewer)
        for (const key in data.config_3d_viewer) {
          let value = data?.config_3d_viewer[key].toString();
          value = value.startsWith('#') ? value.split('#')[1] : value;
          URLModelViewer += '&' + key + '=' + value;
        }

      setUrlViewer(URLModelViewer);
    }
  }, [data]);

  const disableScrollPage = () =>
    (document.body.style.cssText = 'overflow:hidden; touch-action:none;');
  const enableScrollPage = () => document.body.removeAttribute('style');

  return (
    <L.Slider_wrapper>
      <div className='product__viewer__box'>
        <div className='product__viewer__content'>
          <iframe
            title={data.title + ' 3D model - VRStyler'}
            src={urlViewer}
            width='100%'
            height='100%'
            allow='autoplay; fullscreen; xr-spatial-tracking'
            allowFullScreen
            onMouseMove={disableScrollPage}
            onMouseLeave={enableScrollPage}
            onTouchMove={disableScrollPage}
            onTouchCancel={enableScrollPage}
          />
        </div>
      </div>
    </L.Slider_wrapper>
  );
};

export default ProductViewer;
