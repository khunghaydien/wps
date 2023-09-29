import _ from 'lodash';
import moment from 'moment';

/** Define custom errors */

class InvalidDateStringError extends Error {
  constructor(message = 'The date string was invalid') {
    super(message);
    this.name = 'InvalidDateStringError';

    if (_.isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export const errors = { InvalidDateStringError };

/** Define utility methods */

const getLocaleFromEmpInfo = (): string => {
  // FIXME Remove moment
  const fallbackLocale =
    // @ts-ignore
    // eslint-disable-next-line new-cap
    document.documentElement?.lang || new moment().locale();
  return window.empInfo?.locale || fallbackLocale;
};

const isJapanese = (locale: string) => {
  return locale === 'ja' || locale === 'ja-JP';
};

const validateToFormatYM = (dateStr): false | Date => {
  if (!/^\d{4}[/-]\d{2}/.test(String(dateStr))) {
    return false;
  }
  const dateArr = dateStr.split(/[/-]/).map((x) => parseInt(x));
  const date = new Date(dateArr[0], dateArr[1] - 1, 1);
  if (date.toString() === 'Invalid Date') {
    return false;
  }
  return date;
};

export default class DateUtil {
  static currentLang(): string {
    return getLocaleFromEmpInfo();
  }

  /**
   * Return an expression of current time according to ISO8601.
   * @example
   * // Returns "2017-09-26T11:05:33.267Z"
   * DateUtil.nowAsISO8601()
   */
  static nowAsISO8601 = () => new Date().toISOString();

  /**
   * Get Today formated YYYY-MM-DD
   */
  static getToday(): string {
    return DateUtil.formatISO8601Date(new Date());
  }

  /**
   * Get Time-Zone from employee info returned from user-setting
   */
  static getEmpTimeZone(): string {
    return String(window.empInfo?.timeZone || 'Asia/Tokyo');
  }

  // FIXME: 削除予定

  /** @deprecated */
  static getTimezoneByEmpInfo(empInfo: Record<string, any>): string {
    return empInfo.timezone || 'Asia/Tokyo';
  }

  /**
   * Return the number of days in the specified month.
   * @param {string} yearAndMonth Expression that includes year and month.
   *     Must be formatted according to ISO8601.
   * @returns {number} Days in specified month.
   * @throws {InvalidDateStringError} Thrown when given argument was invalid.
   * @example
   * // Returns 30
   * DateUtil.getDaysInMonth('2017-09')
   * // Returns 28
   * DateUtil.getDaysInMonth('2017-02')
   * // Returns 0
   * DateUtil.getDaysInMonth('2017-13')
   */
  static getDaysInMonth(yearAndMonth: string): number {
    const daysInMonth = moment(yearAndMonth).daysInMonth();

    if (isNaN(daysInMonth)) {
      throw new InvalidDateStringError(
        `The date string was invalid. Make sure it's formatted as ISO8601, for example, 1993-05, 2017/09: yearAndMonth=${yearAndMonth}`
      );
    }

    return daysInMonth;
  }

  /**
   * @deprecated moment依存で多言語対応が難しいため削除
   * ミリ秒を指定したフォーマットの文字列(YYYY-MM-DDなど)に変換する
   * formatStr を指定しなかった場合、ユーザーの言語設定に応じたフォーマットに変換
   */
  static format(
    msec: number | string | moment.Moment,
    formatStr: null | string = null
  ): string {
    if (!msec) {
      return '';
    }

    return formatStr
      ? moment(msec).format(formatStr)
      : moment(msec).format('L');
  }

  static formatWithIntl(
    date: Date,
    options: Intl.DateTimeFormatOptions,
    locale: string = getLocaleFromEmpInfo()
  ) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  /**
   * 時/分をフォーマットして返す
   * @param {string} dateStr - ISO8601形式
   * @param {string} Custom timezone. Use default timezone if omitted.
   */
  static formathhmm(dateStr: string, timeZone?: string): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      timeZone,
    };

    return new Intl.DateTimeFormat(lang, options).format(date.toDate());
  }

  /**
   * 言語に応じて年/月/日/時/分をフォーマットして返す
   * @param {string} dateStr - ISO8601形式
   * @param {string} Custom timezone. Use default timezone if omitted.
   */
  static formatYMDhhmm(dateStr: string, timeZone?: string): string {
    const date = moment(dateStr);
    if (date.toString() === 'Invalid Date') {
      return '';
    }
    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone,
    };
    if (isJapanese(lang)) {
      options.month = 'numeric';
    }

    return new Intl.DateTimeFormat(lang, options).format(date.toDate());
  }

  /**
   * 言語に応じて年/月/日をフォーマットして返す
   * @param {string} dateStr - ISO8601形式
   */
  static formatYMD(dateStr?: string): string {
    if (!dateStr) {
      return '';
    }

    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    if (isJapanese(lang)) {
      options.month = 'numeric';
    }

    return new Intl.DateTimeFormat(lang, options).format(
      moment(dateStr, ['YYYY-MM-DD']).toDate()
    );
  }

  /**
   * Prettify month, day and weekday according to the locale and return it.
   * @param {string} dateStr Date string. Must be formatted according to ISO8601.
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatMDW(
    dateStr: string,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    };
    if (isJapanese(locale)) {
      options.month = 'numeric';
    }
    return new Intl.DateTimeFormat(locale, options).format(date.toDate());
  }

  /**
   * Prettify month and day according to the locale and return it.
   * @param {string} dateStr Date string. Must be formatted according to ISO8601.
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatMD(
    dateStr: string,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, {
      month: 'numeric',
      day: 'numeric',
    }).format(date.toDate());
  }

  /**
   * Prettify day and weekday according to the locale and return it.
   * @param {string} dateStr Date string. Must be formatted according to ISO8601.
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatDW(
    dateStr: string,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      weekday: 'short',
    }).format(date.toDate());
  }

  /**
   * Prettify weekday according to the locale and return it.
   * @param {string} dateStr Date string. Must be formatted according to ISO8601.
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatW(
    dateStr: string,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
    }).format(date.toDate());
  }

  /**
   * Prettify a day according to the locale and return it.
   * @param {string} dateStr Date string. Must be formatted according to ISO8601.
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatD(dateStr: string): string {
    const date = moment(dateStr);
    if (date.isValid() === false) {
      return '';
    }
    return `${date.date()}`;
  }

  /**
   * 言語に応じて年/月をフォーマットして返す
   * 引数 dateStr のYYYY/MM形式はYYYY-MM形式に統一されるべきです。
   * ですので然るべき対応がなされた後、YYYY/MM形式は使用不可になる想定です。
   * @param {string} dateStr -  ISO8601形式（YYYY-MM）、またはYYYY/MM形式。
   */
  static formatYM(dateStr: string): string {
    const date = validateToFormatYM(dateStr);
    if (!date) {
      return '';
    }
    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    };
    if (isJapanese(lang)) {
      options.month = 'numeric';
    }

    return new Intl.DateTimeFormat(lang, options).format(date);
  }

  static formatYLongM(dateStr: string): string {
    const date = validateToFormatYM(dateStr);
    if (!date) {
      return '';
    }
    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };

    return new Intl.DateTimeFormat(lang, options).format(date);
  }

  /**
   * format Month
   * @param {number} Month representing number (0~12)
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   */
  static formatMonth(
    month: number,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short' };
    if (isJapanese(locale)) {
      options.month = 'numeric';
    }

    return new Intl.DateTimeFormat(locale, options).format(
      new Date(1970, month, 1)
    );
  }

  /**
   * 言語に応じて曜日をフォーマットして返す
   * @param {string} dateStr - ISO8601形式
   */
  static formatWeekday(dateStr: string): string {
    const lang = getLocaleFromEmpInfo();

    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };

    return new Intl.DateTimeFormat(lang, options).format(
      moment(dateStr).toDate()
    );
  }

  /**
   * 日付形式の文字列を受け取り、年月日の「日」を数値（ゼロ埋めナシ）で返却する
   * @param {String} dateStr
   * @returns {number} 年月日の「日」
   */
  static getDate(dateStr: string): number {
    return moment(dateStr).date();
  }

  /**
   * 日付形式の文字列を受け取り、年月日の「月」を数値（ゼロ埋めナシ）で返却する
   * @param {String} dateStr
   * @returns {number} 年月日の「月」
   */
  static getMonth(dateStr: string): number {
    return moment(dateStr).month();
  }

  /**
   * YYYY-MM-DD 形式の文字列をミリ秒に変換する
   */
  static toUnixMsec(dateStr: string): number {
    return moment(dateStr).unix() * 1000;
  }

  /**
   * YYYY-MM-DD 形式で入力された日付が過去日であるかを判定する
   */
  static isBeforeToday(dateStr: string): boolean {
    const today = moment().startOf('day');
    return moment(dateStr).isBefore(today);
  }

  /**
   * Test that `date` is between `startDate` and `endDate` or not.
   */
  static inRange(date: string, startDate: string, endDate: string): boolean {
    const target = moment(date);
    const start = moment(startDate);
    const end = moment(endDate);
    return target.isSameOrAfter(start) && target.isSameOrBefore(end);
  }

  /**
   * ミリ秒を指定したISO8601形式の日付（YYYY-MM-DD）へ変換する
   * @param {number|string} msec
   * @return {string}
   */
  static formatISO8601Date(msec: number | string | Date): string {
    if (!msec) {
      return '';
    }

    return moment(msec).format('YYYY-MM-DD');
  }

  /**
   * ISO形式の時刻を受け取り、増減を行う
   * @param {string} dateStr
   * @param {number} number
   * @param {string} unit
   * @see {@link https://momentjs.com/docs/#/manipulating/add/}
   */
  static add(dateStr: string, number: number, unit: string): string {
    if (!dateStr || !number || !unit) {
      return '';
    }

    return moment(dateStr)
      .add(number as any, unit)
      .toISOString();
  }

  /**
   * YYYY-MMーDD形式の日付を受け取り、増減させた結果をYYYY-MMーDD形式で返却する
   * @param {string} src
   * @param {number} days
   */
  static addDays(src: string, days: number): string {
    return DateUtil.formatISO8601Date(DateUtil.add(src, days, 'days'));
  }

  /**
   * Format days with unit according to current locale.
   * @param {number} days Days to format
   * @param {string} [locale=getLang()] Custom locale. Use default locale if omitted.
   * @return {string} Days formatted with the unit
   * @see {@link https://momentjs.com/docs/#/durations/humanize/}
   * @example
   * // Returns 'a day'
   * DateUtil.formatDaysWithUnit(1)
   * // Returns '3 days'
   * DateUtil.formatDaysWithUnit(3)
   */
  static formatDaysWithUnit(
    days: number,
    locale: string = getLocaleFromEmpInfo()
  ): string {
    return moment
      .localeData(locale)
      .relativeTime(days, false, days === 1 ? 'd' : 'dd', false);
  }

  /**
   * @deprecated
   * use DateUtil.dateFormat
   */
  static formatDateStrToSlashes(dateStr?: string): string {
    return dateStr.replace(/-/g, '/');
  }

  /**
   * Return formatted date or range.
   *
   * @param {string} startDate
   * @param {string} endDate
   * @return {string} ISO8601 format
   */
  static formatDateOrRange(startDate: string, endDate: string): string {
    if (startDate !== endDate) {
      return `${DateUtil.formatYMD(startDate)}–${DateUtil.formatYMD(endDate)}`;
    } else {
      return `${DateUtil.formatYMD(startDate)}`;
    }
  }

  /**
   * Return formatted date from string value.
   * format('L') => 06/09/2014
   * format('LL') => June 9 2014
   *
   * @param {string} date
   * @param {string} format
   * @return {string} Formatted Date
   */
  static customFormat(date: string, format = 'YYYY-MM-DD'): string {
    return moment(date).format(format);
  }

  static isValid(date: string, format = 'YYYY-MM-DD'): boolean {
    return moment(date, format, true).isValid();
  }

  static fromDate(date: Date, format = 'YYYY-MM-DD'): string {
    return moment(date).format(format);
  }

  static isToday(date: string): boolean {
    const today: string = DateUtil.getToday();
    return moment(today).isSame(date);
  }

  /**
   * Return formatted date from string value based on locale.
   * en-US => 06/23/2014
   * en-GB => 23/06/2014
   * ja => 2014/06/23
   *
   * @param {string} date
   * @return {string} Formatted Date
   */
  static dateFormat(
    dateStr: string,
    curFormat = '',
    withTime?: boolean
  ): string {
    const date = moment(dateStr, curFormat);
    if (!dateStr || date.isValid() === false) {
      return '';
    }
    const formatter: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(withTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        : {}),
    };

    return new Intl.DateTimeFormat(getLocaleFromEmpInfo(), formatter).format(
      date.toDate()
    );
  }

  /**
   * Return formatted date from string value representing date (ISO8601 format).
   *
   * @example
   *
   * // locale: en_US
   * const formattedDate = formatLongDate('2019-07-20');
   * // => formattedDate === 'July 20, 2019'
   */
  static formatLongDate(date: string, timeZone?: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone,
    };
    const lang = getLocaleFromEmpInfo();

    return new Intl.DateTimeFormat(lang, options).format(
      moment(date, ['YYYY-MM-DD']).toDate()
    );
  }

  /**
   * Compare two date and return true if the first one is earlier than the second
   * @param {string|Date} dateStr1
   * @param {string|Date} dateStr2
   * @return {boolean} is first one earlier than the second
   */
  static isBefore(dateStr1: string, dateStr2: string): boolean {
    return moment(dateStr1).isBefore(moment(dateStr2));
  }

  /**
   * Compare two date and return the difference by day unit
   * @param {string|Date} date1
   * @param {string|Date} date2
   * @return {number} the difference between two dates by day
   */
  static dayDiff(date1: string | Date, date2: string | Date): number {
    return Math.abs(moment(date2).diff(moment(date1), 'days'));
  }

  /**
   * Date形式の時刻を受け取り、増減を行う
   * @param {string|Date} dateStr
   * @param {number} number
   * @param {string} unit
   * @see {@link https://momentjs.com/docs/#/manipulating/add/}
   */
  static addInDate(dateStr: string | Date, number: number, unit: string): Date {
    return moment(dateStr)
      .add(number as any, unit)
      .toDate();
  }

  static differenceInMinutes(dateLeft: Date, dateRight: Date): number {
    return Math.floor(
      // eslint-disable-next-line  @typescript-eslint/consistent-type-assertions
      Math.abs(<any>dateLeft - <any>dateRight) /
        (60 *
          /* minutes */
          1000)
      /* milliseconds */
    );
  }

  static differenceInHours(dateLeft: Date, dateRight: Date): number {
    return Math.floor(
      // eslint-disable-next-line  @typescript-eslint/consistent-type-assertions
      Math.abs(<any>dateLeft - <any>dateRight) /
        (60 *
          /* hours */
          60 *
          /* minutes */
          1000)
      /* milliseconds */
    );
  }

  /**
   * 範囲内のすべての日付を返す '2022-12-01', '2022-12-03' => ['2022-12-01', '2022-12-02', '2022-12-03']
   * @param startDate string
   * @param endDate string
   * @return string[]
   */
  static getRangeDays(startDate: string, endDate: string): string[] {
    if (startDate === endDate) {
      return [startDate];
    }

    let dateRange = [];
    if (startDate && endDate) {
      dateRange = [startDate];
      const daysDiff = DateUtil.dayDiff(startDate, endDate);
      for (let i = 1; i <= daysDiff; i++) {
        dateRange.push(DateUtil.addDays(startDate, i));
      }
    }
    return dateRange;
  }
}
