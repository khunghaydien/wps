import { RestTimeReason } from './RestTimeReason';
import * as TimeRange from './TimeRange';

export type RestTime = TimeRange.TimeRange & {
  restReason: RestTimeReason;
};

export type RestTimes = RestTime[];

/**
 * 休憩時刻（開始時刻と終了時刻のペア）の上限
 */
export const MAX_STANDARD_REST_TIME_COUNT = 5;

export const create = <T extends RestTime>(
  restTime?: Partial<T>
): RestTime => ({
  startTime: restTime?.startTime ?? null,
  endTime: restTime?.endTime ?? null,
  restReason: restTime?.restReason ?? null,
});

export const convert = <
  T extends {
    startTime: any;
    endTime: any;
    restReason: RestTimeReason;
  }
>(
  restTime: T
): RestTime => ({
  ...TimeRange.convert(restTime),
  restReason: restTime.restReason,
});

export const hasValue = TimeRange.hasTimes;

export const convertRestTimes = (
  restTimes: {
    startTime: any;
    endTime: any;
    restReason: RestTimeReason;
  }[]
): RestTimes => restTimes.map(convert);

export const isLast =
  (idx: number) =>
  (records: RestTimes): boolean =>
    idx === records.length - 1;

export const isAddable =
  (maxLength = MAX_STANDARD_REST_TIME_COUNT) =>
  (idx: number) =>
  (_: RestTimes): boolean =>
    idx + 1 < maxLength;

export const isDeletable =
  (_: number) =>
  (records: RestTimes): boolean =>
    records.length > 1;

export type IRestTimeFactory<TRestTime extends RestTime = RestTime> = {
  create: (...args: unknown[]) => TRestTime;
};

export type IRestTimesFactory<TRestTime extends RestTime = RestTime> = {
  maxLength: number;
  create: () => TRestTime[];
  filter: (arr: TRestTime[]) => TRestTime[];
  update: (arr: TRestTime[], idx: number, value: TRestTime) => TRestTime[];
  insert: (arr: TRestTime[], idx: number, value?: TRestTime) => TRestTime[];
  remove: (arr: TRestTime[], idx: number) => TRestTime[];
  push: (arr: TRestTime[], value?: TRestTime) => TRestTime[];
  pushLast: (arr: TRestTime[]) => TRestTime[];
};
