export default function capitalizeFirstLetter(str: string) {
  const letterArr = str.trim().split('');
  if (Array.isArray(letterArr) && letterArr.length)
    return letterArr[0].toUpperCase() + letterArr.slice(1).join('');
  else return str;
}
