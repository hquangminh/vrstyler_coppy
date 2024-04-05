import React, { useState } from 'react';

import styled from 'styled-components';
import { Progress } from 'antd';

import MyImage from './Image';

const _viewer360Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .ant-progress {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    width: 50%;
    line-height: 0;

    .ant-progress-outer {
      line-height: 0;
    }
    .ant-progress-inner {
      border-radius: 0;
    }
    .ant-progress-bg {
      height: 4px !important;
    }
  }
`;
const _boxShowImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  & > img.react-360-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .react360 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    user-select: none;
    cursor: pointer;

    .react-360-img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  }
`;

const pixelsPerDegree = 1;

type Props = {
  imageDefault: string;
  images?: string[];
  imageAlt?: string;
  id?: string;
};

const Viewer360 = (props: Props) => {
  const { imageDefault, images } = props;

  const [start, setStart] = useState<boolean>(false);
  const [visited, setVisited] = useState<boolean>(false);
  const [position, setPosition] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const handelMouseDrag = (e: any) => {
    if (images) {
      const mousePosition = e.pageX || e.touches[0].clientX;

      (position === 0 ||
        position < mousePosition - pixelsPerDegree ||
        position > mousePosition + pixelsPerDegree) &&
        setPosition(mousePosition);

      if (position < mousePosition - pixelsPerDegree)
        setImageIndex(imageIndex < images.length - 1 ? imageIndex + 1 : 0);
      if (position > mousePosition + pixelsPerDegree)
        setImageIndex(imageIndex !== 0 ? imageIndex - 1 : images.length - 1);
    }
  };

  const renderImage = () => {
    return (
      <div className='react360' style={{ opacity: visited ? 1 : 0 }}>
        {images?.map((img: string, index: number) => {
          return (
            <MyImage
              key={img}
              fill
              className='react-360-img'
              style={{ display: imageIndex !== index ? 'none' : 'inline' }}
              src={img}
              onLoad={() =>
                imagesLoaded < images.length && setImagesLoaded((s) => (s == 0 ? 1 : s + 1))
              }
              title={props.imageAlt}
              alt={props.imageAlt ?? ''}
            />
          );
        })}
      </div>
    );
  };

  return (
    <_viewer360Wrapper
      onMouseMove={() => {
        images && setStart(true);
        setVisited(true);
      }}
      onMouseLeave={() => {
        setImageIndex(0);
        setVisited(false);
      }}
      onTouchMove={() => {
        images && setStart(true);
        setVisited(true);
      }}
      onTouchEnd={() => {
        setImageIndex(0);
        setVisited(false);
      }}>
      <_boxShowImage
        onMouseMove={(e: any) => images && imagesLoaded === images.length && handelMouseDrag(e)}
        onTouchStart={(e: any) => setPosition(e.touches[0].clientX)}
        onTouchMove={(e: any) => images && imagesLoaded === images.length && handelMouseDrag(e)}>
        <MyImage
          fill
          className='react-360-img'
          src={imageDefault}
          alt=''
          loading='lazy'
          placeholder='blur'
          blurDataURL='/static/images/loading.gif'
        />
        {start && renderImage()}
      </_boxShowImage>

      {start && images && imagesLoaded < images.length && (
        <Progress percent={(imagesLoaded / images.length) * 100} status='active' showInfo={false} />
      )}
    </_viewer360Wrapper>
  );
};

export default Viewer360;
