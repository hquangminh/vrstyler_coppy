export default function isOnlyEmoji(str: string) {
  const emojiRegex = `[\u0000-\u1eeff]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u3130-\u318F]|[\uAC00-\uD7A3]|[\u4E00-\u9FFF]|[\u3400-\u4DBF]`;
  const onlyEmojis = str.replace(new RegExp(emojiRegex, 'g'), '');
  const visibleChars = str.replace(new RegExp('[\n\r\\s]+|( )+', 'g'), '');
  return str.trim() && onlyEmojis.length === visibleChars.length;
}
