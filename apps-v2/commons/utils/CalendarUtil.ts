import {
  addDays,
  eachDay,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import first from 'lodash/first';
import last from 'lodash/last';
import moment from 'moment';
import { $Values } from 'utility-types';

type Day = {
  Sunday: 0;
  Monday: 1;
  Tuesday: 2;
  Wednesday: 3;
  Thursday: 4;
  Friday: 5;
  Saturday: 6;
};

const defaultLocale = (): string => {
  const { navigator } = <{ navigator: any }>window; // eslint-disable-line  @typescript-eslint/consistent-type-assertions
  if (window.empInfo && window.empInfo.locale) {
    return window.empInfo.locale;
  } else if (document.documentElement && document.documentElement.lang) {
    return document.documentElement.lang;
  } else if (navigator.userLanguage || navigator.language) {
    return navigator.userLanguage || navigator.language;
  } else {
    throw new Error("Cannot read property 'lang' of undefined or null");
  }
};

export default class CalendarUtil {
  static Day: Day = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  /**
   * カレンダーの開始曜日をもとに対象月の月カレンダーの開始日を返す
   * @param month {Moment} 対象月のMomentオブジェクト
   * @param startDayOfTheWeek {int} 週の開始曜日（ Sunday(0) to Satureday(6) ）
   * @return startDate {Moment} 月カレンダーの開始日
   */
  static getStartDateOfMonthView(
    month: moment.Moment,
    startDayOfTheWeek: number
  ): moment.Moment {
    const startDateOfTheMonth = month.clone().startOf('month');
    let startDate = startDateOfTheMonth.clone().day(startDayOfTheWeek);
    if (startDate.isAfter(startDateOfTheMonth)) {
      startDate = startDateOfTheMonth
        .clone()
        .add(-1, 'w')
        .day(startDayOfTheWeek);
    }
    return startDate;
  }

  /**
   * Return calendar dates as of a given `targetDate`
   */
  static getCalendarAsOf(
    targetDate: Date,
    option: { weekStartsOn: $Values<Day> } = { weekStartsOn: 0 }
  ): ReadonlyArray<Date> {
    const start = startOfWeek(startOfMonth(targetDate), option);
    const end = endOfWeek(endOfMonth(targetDate), option);
    return eachDay(start, end);
  }

  /**
   * Return period of calendar as of a given `targetDate`.
   * Note that `endDate` of the returned period is closed, i.e [startDate, endDate).
   */
  static getCalendarPeriodAsOf(
    targetDate: Date,
    option: { weekStartsOn: $Values<Day> } = { weekStartsOn: 0 }
  ): { readonly startDate: Date; readonly endDate: Date } {
    const dates = CalendarUtil.getCalendarAsOf(targetDate, option);
    const startDate = first(dates);
    const endDate = addDays(last(dates), 1);
    return { startDate, endDate };
  }

  /**
   *
   */
  static isSameDate(left: Date, right: Date) {
    return (
      isSameYear(left, right) &&
      isSameMonth(left, right) &&
      left.getDate() === right.getDate()
    );
  }

  /**
   * format day for calendar
   */
  static format(
    date: Date | number,
    options: Intl.DateTimeFormatOptions,
    locale: string = defaultLocale()
  ) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  static getElapsedMinutesOfDay(date: Date = new Date()): number {
    return date.getHours() * 60 + date.getMinutes();
  }
}
