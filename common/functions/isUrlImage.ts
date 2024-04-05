export default function isUrlImage(url: string) {
  const isExtensionImage =
    /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp|bmp|ico|cur|tif|tiff)$/i.test(url);
  const isImageBase64 = /\/(apng|avif|gif|jpeg|png|svg+xml|webp|bmp|x-icon|tiff)$/i.test(
    url.split(';')[0]
  );

  return Boolean(url && (isExtensionImage || isImageBase64));
}
