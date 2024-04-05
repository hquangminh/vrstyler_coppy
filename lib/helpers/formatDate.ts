import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import 'dayjs/locale/vi';
dayjs.extend(relativeTime);

export type DateType = string | number | Date | dayjs.Dayjs | null | undefined;

function locale(langCode: string) {
  switch (langCode) {
    case 'kr':
      return 'ko';
    case 'jp':
      return 'ja';
    case 'vn':
      return 'vi';
    default:
      return langCode;
  }
}

function template(langCode: string) {
  switch (langCode) {
    case 'en':
      return 'MMM DD, YYYY';
    case 'kr':
      return 'YYYY/MM/DD';
    case 'jp':
      return 'YYYY/MM/DD';
    case 'vn':
      return 'DD/MM/YYYY';
    default:
      return '';
  }
}

export function dateFormat(
  date: DateType,
  langCode: string = 'en',
  showTime?: boolean,
  timeFormat?: string
) {
  let format = template(langCode);
  if (showTime) {
    if (timeFormat) format += ` ${timeFormat}`;
    else format += ' h:mm A';
  }
  return dayjs(date).locale(locale(langCode)).format(format);
}

export function fromNowFormat(date: DateType, langCode: string = 'en') {
  return dayjs(date).locale(locale(langCode)).fromNow();
}

type FormatDateUTCProps = {
  utcDate: DateType;
  langCode: string;
  format?: string;
  isFromNow?: boolean;
};
export function FormatDateUTC(props: FormatDateUTCProps) {
  const { utcDate, langCode = 'en', format = 'DD/MM/YYYY', isFromNow } = props;
  const date = new Date(utcDate as string);
  const _locale = locale(langCode);

  if (isFromNow && dayjs().diff(date, 'hours') < 24) return dayjs(date).locale(_locale).fromNow();
  else return dayjs(date).locale(_locale).format(format);
}
