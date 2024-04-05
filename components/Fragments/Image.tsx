import { memo, useState } from 'react';

import Image, { ImageProps } from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import useUpdateEffect from 'hooks/useUpdateEffect';
import convertS3Link from 'common/functions/convertLinkS3';
import { isStrEmpty } from 'common/functions';
import { imgAvailable } from 'common/constant';

const imageBlur =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkkAQAAB8AG7jymN8AAAAASUVORK5CYII=';

const MyImage = memo(function MyImage(props: ImageProps & { img_error?: string }) {
  const [src, setSrc] = useState<string | StaticImport>(
    typeof props.src === 'string' && !isStrEmpty(props.src) ? convertS3Link(props.src) : imageBlur
  );

  useUpdateEffect(() => {
    if (typeof props.src === 'string' && !isStrEmpty(props.src)) {
      const linkConverted = convertS3Link(props.src);
      if (linkConverted !== src) setSrc(linkConverted);
    } else if (props.src !== src || src === imageBlur) setSrc(props.src);
    else setSrc(props.img_error ?? imgAvailable);
  }, [props.src]);

  const onLoadImage = (src: string) => {
    if (src === imageBlur) setSrc(props.img_error ?? imgAvailable ?? imageBlur);
  };

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      onLoad={(e) => onLoadImage(e.currentTarget.src)}
      onError={() => setSrc(props.img_error ?? imgAvailable)}
    />
  );
});
export default MyImage;
