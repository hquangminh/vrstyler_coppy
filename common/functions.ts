import urlPage from 'constants/url.constant';
import { message } from 'lib/utils/message';
import { UserType } from 'models/user.models';

export const convertToHighlightText = (text: string, highlight: string) => {
  const escapeRegExp = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const parts = text.split(new RegExp(`(${escapeRegExp})`, 'gi'));
  return (
    '<span>' +
    parts.map(
      (part) =>
        `<span class=${part.toLowerCase() === highlight.toLowerCase() ? 'hl' : ''}>${part}</span>`
    ) +
    '</span>'
  ).replaceAll(',', '');
};

export const isStrEmpty = (str: string) => {
  return (
    typeof str !== 'string' ||
    str === undefined ||
    str === null ||
    str.length === 0 ||
    str.trim().length === 0
  );
};

export const changeToSlug = (title: string, id?: string) => {
  title = title.toString().toLowerCase();

  // Convert Vietnamese to Alphabet
  title = title.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  title = title.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  title = title.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  title = title.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  title = title.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  title = title.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  title = title.replace(/(đ)/g, 'd');

  title = title.replace(/\s+/g, '-'); // Replace spaces with -
  title = title.replace(/[^\w\-]+/g, ''); // Remove all non-word chars
  title = title.replace(/\-\-+/g, '-'); // Replace multiple - with single -
  title = title.replace(/^-+/, ''); // Trim - from start of text
  title = title.replace(/-+$/, ''); // Trim - from end of text

  if (id) return title + '--' + id;
  return title;
};

export const handlerMessage = (err: string, type: 'error' | 'success' | 'warning') => {
  message[type](err || 'Oops! An error occurred!');
};

export const formatNumber = (value: number, unit?: string, messErr?: string) => {
  if (Number.isFinite(value)) return (unit || '') + new Intl.NumberFormat('ja-JP').format(value);
  else return messErr || '';
};

export const decimalPrecision = (number: number, place: number) => {
  return parseFloat(number.toFixed(place));
};

export const fullScreen = (elem: any) => {
  const document: any = window.document;
  if (
    (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
    (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
    (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
    (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

export const isUUID = (input: string, version?: '1' | '2' | '3' | '4' | '5') => {
  const uuid_patterns = {
    1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  };

  if (version) {
    return uuid_patterns[version].test(input);
  } else {
    return Object.values(uuid_patterns).some((pattern) => pattern.test(input));
  }
};

export const createFakeArray = (dataItem: Object, length: number) => {
  let arr: any[] = [];
  Array.from({ length }).map(() => arr.push(dataItem));
  return arr;
};

export const getNewObjByFields = (obj: any, fields: string[]) => {
  if (!obj || !Object.keys(obj).length) return;

  let newObj: any = {};
  for (const key of fields) {
    const nestedKeys = key.split('.');
    let value = obj;
    for (const nestedKey of nestedKeys) {
      value = value?.[nestedKey];
      if (value === undefined) {
        value = null;
        break;
      }
    }
    newObj[key] = value;
  }

  return newObj;
};

export const abbreviateNumber = (value: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const searchDebounce = (func: (e: any) => void, timeout = 300) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

// Delete key null, undefined Object
export const deleteItemInObject = (object: object[] | any) => {
  Object.keys(object).forEach((key) =>
    object[key] === null || object[key] === undefined ? delete object[key] : {}
  );

  return object;
};

// Go to profile
export const urlGoToProfile = (type: UserType, nickName: string) => {
  switch (type) {
    case UserType.SELLER:
      return urlPage.seller_profile.replace('{nickname}', nickName);
    case UserType.SHOWROOM:
      return urlPage.showroom_chanel.replace('{nickname}', nickName);
    default:
      return '';
  }
};
