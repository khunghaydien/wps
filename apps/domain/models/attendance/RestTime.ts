import * as TimeRange from './TimeRange';

export type RestTimes = TimeRange.TimeRange[];

/**
 * 休憩時刻（開始時刻と終了時刻のペア）の上限
 * - TODO: 2017年11月末（Winter ’18）リリース時点での制限。いずれ無制限に対応するはず
 * @type {Number}
 */
export const MAX_STANDARD_REST_TIME_COUNT = 5;

export const create = (
  restTimes: {
    startTime: any;
    endTime: any;
  }[]
): RestTimes => restTimes.map(TimeRange.create);

export const filter = (restTimes: RestTimes): RestTimes =>
  restTimes.filter(TimeRange.hasTimes);

export const pushLast = (restTimes: RestTimes): RestTimes => {
  const arr = [...restTimes];
  if (
    arr.length < MAX_STANDARD_REST_TIME_COUNT &&
    (arr.length === 0 || TimeRange.hasTimes(arr[arr.length - 1]))
  ) {
    arr.push(TimeRange.create());
  }
  return arr;
};

export const update = (
  restTimes: RestTimes,
  idx: number,
  value: {
    startTime: any;
    endTime: any;
  }
): RestTimes => {
  const arr = [...restTimes];
  arr.splice(idx, 1, TimeRange.create(value));
  return arr;
};

export const remove = (restTimes: RestTimes, idx: number): RestTimes => {
  const arr = [...restTimes];
  arr.splice(idx, 1);
  return arr;
};

export const push = (
  restTimes: RestTimes,
  value: { startTime: any; endTime: any } = { startTime: null, endTime: null }
): RestTimes => {
  const arr = [...restTimes];
  if (arr.length < MAX_STANDARD_REST_TIME_COUNT) {
    arr.push(TimeRange.create(value));
  }
  return arr;
};
