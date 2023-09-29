import TimeUtil from '@apps/commons/utils/TimeUtil';

export const toHHmm = (time: number | null): string => TimeUtil.toHHmm(time);

/**
 * HH:mm形式の文字列（もしくはnull/''）を、分で表現された時刻に変換して返却する
 * @param {String|Null} timeSrt HH:mm形式
 * @returns {Number|Null}
 */
export const toNumberOrNull = (
  timeSrt: string | number | null
): number | null =>
  timeSrt && timeSrt !== '' ? TimeUtil.parseMinutes(timeSrt) : null;
