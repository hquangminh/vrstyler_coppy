import { useMemo } from 'react';
import { DateType, dateFormat, fromNowFormat } from 'lib/helpers/formatDate';
import capitalizeFirstLetter from 'common/functions/capitalizeFirstLetter';

type Props = {
  date: DateType;
  langCode?: string;
  showTime?: boolean;
  timeFormat?: string;
  fromNow?: boolean;
};

export default function Moment(props: Readonly<Props>) {
  const { date, langCode = 'en', showTime, timeFormat, fromNow } = props;
  const time = useMemo(() => {
    if (fromNow) return fromNowFormat(date, langCode);
    else return dateFormat(date, langCode, showTime, timeFormat);
  }, [date, fromNow, langCode, showTime, timeFormat]);

  return <>{capitalizeFirstLetter(time)}</>;
}
