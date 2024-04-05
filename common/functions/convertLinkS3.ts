export default function convertS3Link(link: string) {
  return link?.includes('amazonaws.com/vrstyler')
    ? 'https://resources.archisketch.com/vrstyler' +
        link.split('amazonaws.com/vrstyler').slice(1).join('')
    : link;
}
