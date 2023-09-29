import msg from '../languages';

const toZeroPaddedString = (aNumber: number, length: number): string => {
  const isPositiveNumber = aNumber >= 0;
  const absoluteNumber = Math.abs(aNumber);

  if (absoluteNumber >= 10 ** length) {
    return String(aNumber);
  }

  return `${!isPositiveNumber ? '-' : ''}${(
    '0'.repeat(length) + String(absoluteNumber)
  ).slice(-length)}`;
};

export default class DurationUtil {
  /**
   * @param {number} durationInMinutes Duration in minutes. Must be an integer.
   * @param {boolean} showPositiveSign If set to true, positive sign won't be omitted.
   */
  static toHHmm(durationInMinutes: number, showPositiveSign = false): string {
    if (durationInMinutes % 1 !== 0) {
      throw new TypeError(
        'DurationUtil.toHHmm(): 1st argument must be an integer.'
      );
    }

    const isPositiveNumber = durationInMinutes >= 0;
    const absoluteDurationInMinutes = Math.abs(durationInMinutes);
    const hours = Math.floor(absoluteDurationInMinutes / 60);
    const minutes = absoluteDurationInMinutes % 60;

    return `${showPositiveSign && isPositiveNumber ? '+' : ''}${
      !isPositiveNumber ? '-' : ''
    }${toZeroPaddedString(hours, 2)}:${toZeroPaddedString(minutes, 2)}`;
  }

  /**
   * 日数を表示用に整形して返却する
   * @param {number} hours
   * @return {string}
   */
  static formatDaysWithUnit(days: number): string {
    const unit = days === 1 ? msg().Com_Lbl_Day : msg().Com_Lbl_Days;
    return `${days} ${unit}`;
  }

  /**
   * 時間を表示用に整形して返却する
   * @param {number} hours
   * @return {string}
   */
  static formatHoursWithUnit(hours: number): string {
    const unit = hours === 1 ? msg().Com_Lbl_Hour : msg().Com_Lbl_Hours;
    return `${hours} ${unit}`;
  }

  /**
   * 日数＋時間を表示用に整形して返却する
   * @param {number} days
   * @param {?number} [hours]
   * @return {string}
   */
  static formatDaysAndHoursWithUnit(days: number, hours?: number): string {
    const unit = days < 0 || Number(hours) < 0 ? '- ' : '';
    const strDays = DurationUtil.formatDaysWithUnit(Math.abs(days));

    if (hours !== null && hours !== undefined && hours !== 0) {
      const strHours = DurationUtil.formatHoursWithUnit(Math.abs(hours));
      if (days <= 0) {
        return `${unit}${strHours}`;
      } else {
        return `${unit}${strDays} ${strHours}`;
      }
    }

    return `${unit}${strDays}`;
  }
}
