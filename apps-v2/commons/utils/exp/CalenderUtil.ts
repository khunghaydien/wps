import moment from 'moment';

import msg from '@commons/languages';
import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';

import DateUtil from '../DateUtil';

const isJapanese = (locale: string): boolean =>
  locale === 'ja' || locale === 'ja-JP';

const formatDate = (eventDate: moment.Moment) => {
  const locale = DateUtil.currentLang();

  if (isJapanese(locale)) {
    return eventDate.isValid()
      ? Intl.DateTimeFormat(locale, {
          month: '2-digit',
          day: '2-digit',
        }).format(eventDate.toDate())
      : '';
  }
  const month = moment(eventDate).month();
  const date = moment(eventDate).date();
  return `${date} ${DateUtil.formatMonth(month)}`;
};

export const formatScheduleSummary = (event: BaseEvent): string => {
  const { end, isAllDay, start, title } = event;

  const time = isAllDay
    ? msg().Cal_Lbl_AllDay
    : `${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')}`;
  return `${formatDate(start)} (${time}) ${title}`;
};
