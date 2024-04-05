import isExistEmoji from 'common/functions/isExistEmoji';
import isStrongPassword from 'validator/lib/isStrongPassword';

export const RegexPassWord = (value: string) => {
  const isNotSpace = /^\S*$/.test(value);
  const isNotEmoji = !isExistEmoji(value);
  const isStrong = isStrongPassword(value, {
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
  return isStrong && value.length <= 16 && isNotEmoji && isNotSpace;
};
