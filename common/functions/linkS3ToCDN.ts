export default function linkS3ToCDN(url: string) {
  return url?.includes('amazonaws.com/vrstyler')
    ? 'https://resources.archisketch.com/vrstyler' +
        url.split('amazonaws.com/vrstyler').slice(1).join('')
    : url;
}
