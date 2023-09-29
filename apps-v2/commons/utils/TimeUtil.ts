import { isNil, isNumber } from 'lodash';
import moment from 'moment';

import StringUtil from './StringUtil';

/**
 * ゼロ埋めを行う ex. 00, 02 ...
 * ただし3桁以上の場合はそのまま返す
 * @param {number} value
 */
const zeroPadding = (value) => {
  if (value >= 100) {
    return value;
  }

  return `00${value}`.slice(-2);
};

export default class TimeUtil {
  /**
   * 分をH:mm形式へ変換する
   * @param {number} minutes
   * @return {string}
   */
  static toHmm(minutes?: number): string {
    if (isNil(minutes)) {
      return '';
    }
    if (!isNumber(minutes)) {
      return '';
    }

    const h = minutes > 0 ? Math.floor(minutes / 60) : Math.ceil(minutes / 60);
    const m = Math.abs(minutes % 60);

    return `${minutes < 0 ? '-' : ''}${Math.abs(h)}:${zeroPadding(m)}`;
  }

  static toHmmObj(minutes?: number): { h: string; m: string } {
    let hmmObj = null;
    if (isNil(minutes)) {
      hmmObj = { h: '', m: '' };
      return hmmObj;
    }
    if (!isNumber(minutes)) {
      hmmObj = { h: '', m: '' };
      return hmmObj;
    }

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    hmmObj = { h: h.toString(), m: zeroPadding(m) };
    return hmmObj;
  }

  /**
   * 分をHH:mm形式へ変換する
   * @param {number} minutes
   * @return {string}
   */
  static toHHmm(minutes: (number | string) | null | undefined): string {
    if (isNil(minutes)) {
      return '';
    }
    if (!isNumber(minutes)) {
      return '';
    }

    const h = minutes > 0 ? Math.floor(minutes / 60) : Math.ceil(minutes / 60);
    const m = Math.abs(minutes % 60);

    return `${minutes < 0 ? '-' : ''}${zeroPadding(Math.abs(h))}:${zeroPadding(
      m
    )}`;
  }

  /**
   * 分をH:mm形式へ変換する。
   * ただし、時間で割り切れる場合は分は返却しない
   * Minute changes to H:mm format.
   * In case minutes can be divided by hour, minutes is omitted.
   * @param {number} minutes
   * @return {string}
   */
  static formatMinutesToHmm(
    minutes: (number | string) | null | undefined
  ): string {
    if (isNil(minutes) || !isNumber(minutes)) {
      return '';
    }

    const h = minutes > 0 ? Math.floor(minutes / 60) : Math.ceil(minutes / 60);
    const m = Math.abs(minutes % 60);

    return `${minutes < 0 ? '-' : ''}${Math.abs(h)}${
      m === 0 ? '' : ` : ${zeroPadding(m)}`
    }`;
  }

  /**
   *
   * @param {number} minutes
   * @return {number} hours
   */
  static toHours(minutes: number): number {
    const h = minutes > 0 ? Math.floor(minutes / 60) : Math.ceil(minutes / 60);

    return h;
  }

  /**
   * HH:mm形式の時間を分に変換する
   *
   * Convert a value formatted HH:mm to minutes.
   *
   * NOTE
   * Be aware that the return value will be number or empty string.
   * This design never good because the most of client codes expect that
   * the return value is number.
   * However, some of client codes suppose that the return value is possibly empty string,
   * and so that is the reason why we could not do refactoring the signature of `toMinutes` directly.
   *
   * We added a new method `parseMinutes` being clean and intuitive signature instead of
   * `toMinutes`.
   * Please use 'parseMinutes` instead of 'toMinutes`. We will remove `toMinutes` in the near future.
   *
   * @deprecated
   * @param {number|string} str
   * @return {number | ''}
   */
  static toMinutes(str: (number | string) | null | undefined): number | '' {
    if (isNil(str)) {
      return '';
    }

    if (isNumber(str)) {
      return parseInt(String(str));
    }

    const nums = str.split(':');
    if (nums.length !== 2) {
      return '';
    }

    const hours = Math.abs(parseInt(nums[0]));
    const minutes = Math.abs(parseInt(nums[1]));

    if (isNaN(hours) || isNaN(minutes)) {
      return '';
    }

    return hours * 60 + minutes;
  }

  /**
   * HH:mm形式の時間を分に変換する
   *
   * Parse a value formatted as HH:mm, and return minutes elapsed from 00:00.
   * If a given value is an invalid format, then the return value will be null.
   *
   * @param {number|string} str
   * @return {number | null}
   */
  static parseMinutes(
    str: (number | string) | null | undefined
  ): number | null {
    if (isNil(str)) {
      return null;
    }

    if (isNumber(str)) {
      return parseInt(String(str));
    }

    const nums = str.split(':');
    if (nums.length !== 2) {
      return null;
    }

    const hours = Math.abs(parseInt(nums[0]));
    const minutes = Math.abs(parseInt(nums[1]));

    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    return nums[0].indexOf('-') === 0
      ? hours * -60 + 0 - minutes // マイナス0を考慮して0を足す
      : hours * 60 + minutes;
  }

  /**
   * 手入力された値をHH:mm書式に変換して返却する
   * - 48時以上の値は無効として '' を返す
   * - 自動切り捨て／切り上げを行う
   *
   * V5のロジックの移植。ただし、以下は除外した
   * - HH:mm書式以外のアウトプット
   * - 時刻のまるめ
   *
   * @see https://labo.teamspirit.co.jp/trac/atkinmu_ent/browser/trunk/project/js/src_base/util/Time.js
   *
   * @param {String} value 文字列
   * @param {number} maxMinutes 上限(minutes)
   * @return {String} 変換後の文字列
   */
  static supportFormat(
    value?: string,
    maxMinutes: number = 47 * 60 + 59
    /* 47:59 */
  ): string {
    const MAX_TIME = maxMinutes;
    const ALT_RETURN_VALUE = '';
    const asciiValue = StringUtil.convertToHankaku(value);
    let matched;

    function minuteToHHmmIfValid(resultMinute) {
      return (resultMinute || resultMinute === 0) && resultMinute <= MAX_TIME
        ? TimeUtil.toHHmm(resultMinute)
        : ALT_RETURN_VALUE;
    }

    // 数字のみ・1〜2桁：「時」とする e.g. 12 -> 12:00
    if (/^(\d{1,2})$/.test(asciiValue)) {
      return minuteToHHmmIfValid(asciiValue * 60);
    }

    // 数字のみ・3桁以上：3桁目以上を「時」端数を「分」とする e.g. 1230 -> 12:30
    if (/^(\d{3,})$/.test(asciiValue)) {
      const evaluatablePart = asciiValue.substring(0, 4);
      const time = parseInt(evaluatablePart, 10);
      const hour = Math.floor(time / 100);
      const restMinute = time % 100;
      return minuteToHHmmIfValid(hour * 60 + restMinute);
    }

    // 「nn:nn」形式
    matched = /^(\d+):(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 + parseInt(minute || 0, 10)
      );
    }

    // 「nn.nn」形式：小数部分を1時間に関するパーセンテージとする e.g. 12.5 -> 12:30
    matched = /^(\d+)\.(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 +
          Math.round(parseFloat(`0.${minute || 0}`) * 60)
      );
    }

    return ALT_RETURN_VALUE;
  }

  /**
   * 手入力された値をHHH:mm書式に変換して返却する
   *
   * @param {String} value 文字列
   * @param {number} maxMinutes 上限(minutes) マイナスのvalueを受け取った場合は下限として扱う
   * @return {String} 変換後の文字列
   */
  static supportFormatFor3Digit(value: string, maxMinutes?: number): string {
    const MAX_TIME = maxMinutes;
    const ALT_RETURN_VALUE = '';
    const asciiValue = StringUtil.convertToHankaku(value);
    let matched;

    function minuteToHHmmIfValid(resultMinute) {
      let isPass = false;
      if (MAX_TIME) {
        isPass =
          (resultMinute || resultMinute === 0) &&
          ((resultMinute < 0 && MAX_TIME * -1 <= resultMinute) ||
            (resultMinute >= 0 && resultMinute <= MAX_TIME));
      } else {
        isPass = resultMinute || resultMinute === 0;
      }
      return isPass ? TimeUtil.toHHmm(resultMinute) : ALT_RETURN_VALUE;
    }

    // マイナス含めた数字のみ・1〜2桁：「時」とする e.g. 12 -> 12:00
    if (/^([-]?\d{1,2})$/.test(asciiValue)) {
      return minuteToHHmmIfValid(asciiValue * 60);
    }

    // 数字のみ・3桁以上：3桁目以上を「時」端数を「分」とする e.g. 1230 -> 12:30
    if (/^(\d{3,})$/.test(asciiValue)) {
      const time = parseInt(asciiValue, 10);
      const hour = Math.floor(time / 100);
      const restMinute = time % 100;
      return minuteToHHmmIfValid(hour * 60 + restMinute);
    }

    // 「nn:nn」形式
    matched = /^(\d+):(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 + parseInt(minute || 0, 10)
      );
    }

    // 「nn.nn」形式：小数部分を1時間に関するパーセンテージとする e.g. 12.5 -> 12:30
    matched = /^(\d+)\.(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 +
          Math.round(parseFloat(`0.${minute || 0}`) * 60)
      );
    }

    // マイナス値の数字のみ・3桁以上：3桁目以上を「時」端数を「分」とする e.g. 1230 -> 12:30
    if (/^([-]\d{3,})$/.test(asciiValue)) {
      const time = parseInt(asciiValue, 10);
      const hour = Math.ceil(time / 100);
      const restMinute = Math.abs(time) % 100;
      return minuteToHHmmIfValid(hour * 60 - restMinute);
    }

    // 「-nn:nn」形式
    matched = /^([-]\d+):(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 - parseInt(minute || 0, 10)
      );
    }

    // 「-nn.nn」形式：小数部分を1時間に関するパーセンテージとする e.g. 12.5 -> 12:30
    matched = /^([-]\d+)\.(\d*)$/.exec(asciiValue);
    if (matched) {
      const [, hour, minute] = matched;
      return minuteToHHmmIfValid(
        parseInt(hour || 0) * 60 -
          Math.round(parseFloat(`0.${minute || 0}`) * 60)
      );
    }

    return ALT_RETURN_VALUE;
  }

  /**
   * ある時刻とある時刻の間の時間（分）を計算する
   * @param {string} start - ISO 8601形式
   * @param {string} end - ISO 8601形式
   */
  static calcDurationMinutes(start?: string, end?: string): number {
    const startUnix = moment(start).unix();
    const endUnix = moment(end).unix();
    const durationSeconds = endUnix - startUnix;

    return moment.duration(durationSeconds, 'seconds').asMinutes();
  }

  /**
   * Format range of times
   * @param {number} startTime - e.g. 180
   * @param {number} endTime - e.g. 320
   * @return {string} formatted time range: HH:mm-HH:mm
   */
  static formatTimeRange = (startTime?: number, endTime?: number): string =>
    `${TimeUtil.toHHmm(startTime)}-${TimeUtil.toHHmm(endTime)}`;
}
