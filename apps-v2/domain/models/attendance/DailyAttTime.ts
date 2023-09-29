import TimeUtil from '../../../commons/utils/TimeUtil';

/**
 * HH:mm形式の文字列（もしくはnull/''）を、分で表現された時刻に変換して返却する
 * @param {String|Null} timeSrt HH:mm形式
 * @returns {Number|Null}
 */
function convertTimeToMinutesOrNull(timeSrt) {
  return timeSrt && timeSrt !== '' ? TimeUtil.toMinutes(timeSrt) : null;
}

/**
 * 文字列の '' を null に変更します
 */
function convertIntToNumberOrNull(value) {
  return value === '' ? null : value;
}

/**
 * [Value Object] 日次勤怠時刻
 * - AttRecordの抜粋
 * - 時刻登録の入力値を表現する
 * - 入力UIとの連携のため、時刻はすべてHH:mm形式のStringで取り扱う
 * - 休憩時間は、{ start: String, end: String } の配列として取り扱う
 */
export type DailyAttTime = {
  /**
   * 日付(YYYY-MM-DD形式の文字列)
   */
  recordDate: string;

  /**
   * 出勤時刻 HH:mm形式
   */
  startTime: string;

  /**
   * 退勤時刻 HH:mm形式
   */
  endTime: string;

  /**
   * 出勤打刻時刻 HH:mm形式
   */
  startStampTime: string;

  /**
   * 退勤打刻時刻 HH:mm形式
   */
  endStampTime: string;

  /**
   * 休憩時刻
   */
  restTimes: Array<{ start: string; end: string }>;

  /**
   * その他の休憩時間
   */
  restHours: string;

  /**
   * 不足休憩時間
   */
  insufficientRestTime: number;

  /**
   * その他休憩時間を表示するかしないか
   */
  hasRestTime: boolean;
};

export const convertToPostRequestParam = (
  dailyAttTime: DailyAttTime,
  empId: string
): {
  empId: string;
  targetDate: string;
  startTime: number | '';
  endTime: number | '';
  restHours: number | '';
} => {
  const param = {
    empId: empId || '',
    targetDate: dailyAttTime.recordDate,
    startTime: convertTimeToMinutesOrNull(dailyAttTime.startTime),
    endTime: convertTimeToMinutesOrNull(dailyAttTime.endTime),
    restHours: convertIntToNumberOrNull(dailyAttTime.restHours),
  };
  dailyAttTime.restTimes.forEach((restTime, index) => {
    param[`rest${index + 1}StartTime`] = convertTimeToMinutesOrNull(
      restTime.start
    );
    param[`rest${index + 1}EndTime`] = convertTimeToMinutesOrNull(restTime.end);
  });

  return param;
};

/**
 * @param {String} recordDate
 * @param {Number} [startTime]
 * @param {Number} [endTime]
 * @param {Number} [startStampTime]
 * @param {Number} [endStampTime]
 * @param {Number} [rest1StartTime]
 * @param {Number} [rest1EndTime]
 * @param {Number} [rest2StartTime]
 * @param {Number} [rest2EndTime]
 * @param {Number} [rest3StartTime]
 * @param {Number} [rest3EndTime]
 * @param {Number} [rest4StartTime]
 * @param {Number} [rest4EndTime]
 * @param {Number} [rest5StartTime]
 * @param {Number} [rest5EndTime]
 * @param {Number} [restHours]
 * @param {Number} [insufficientRestTime]
 * @param {boolean} [hasRestTime]
 * @returns {DailyAttTime}
 */
export const createFromParam = ({
  recordDate,
  startTime,
  endTime,
  startStampTime,
  endStampTime,
  rest1StartTime,
  rest1EndTime,
  rest2StartTime,
  rest2EndTime,
  rest3StartTime,
  rest3EndTime,
  rest4StartTime,
  rest4EndTime,
  rest5StartTime,
  rest5EndTime,
  restHours,
  insufficientRestTime,
  hasRestTime,
}): DailyAttTime => {
  const restTimes = [];

  if (rest1StartTime !== null || rest1EndTime !== null) {
    restTimes.push({
      start: TimeUtil.toHHmm(rest1StartTime),
      end: TimeUtil.toHHmm(rest1EndTime),
    });
  }

  if (rest2StartTime !== null || rest2EndTime !== null) {
    restTimes.push({
      start: TimeUtil.toHHmm(rest2StartTime),
      end: TimeUtil.toHHmm(rest2EndTime),
    });
  }

  if (rest3StartTime !== null || rest3EndTime !== null) {
    restTimes.push({
      start: TimeUtil.toHHmm(rest3StartTime),
      end: TimeUtil.toHHmm(rest3EndTime),
    });
  }

  if (rest4StartTime !== null || rest4EndTime !== null) {
    restTimes.push({
      start: TimeUtil.toHHmm(rest4StartTime),
      end: TimeUtil.toHHmm(rest4EndTime),
    });
  }

  if (rest5StartTime !== null || rest5EndTime !== null) {
    restTimes.push({
      start: TimeUtil.toHHmm(rest5StartTime),
      end: TimeUtil.toHHmm(rest5EndTime),
    });
  }

  if (restTimes.length === 0) {
    restTimes.push({ start: '', end: '' });
  }

  return {
    recordDate,
    startTime: TimeUtil.toHHmm(startTime),
    endTime: TimeUtil.toHHmm(endTime),
    startStampTime: TimeUtil.toHHmm(startStampTime),
    endStampTime: TimeUtil.toHHmm(endStampTime),
    restTimes,
    restHours,
    insufficientRestTime,
    hasRestTime,
  };
};
