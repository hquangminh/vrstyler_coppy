import regex from 'common/regex';

export default function isExistEmoji(text: string) {
  const arrEmoji = text.match(regex.emoji);
  return arrEmoji && arrEmoji.length > 0;
}
