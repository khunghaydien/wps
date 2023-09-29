import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

export type DailyRest = {
  restStartTime: number | null | undefined;
  restEndTime: number | null | undefined;
};

/**
 * Direct
 */
export type Direct = {
  type: typeof REQUEST_TYPE.Direct;
  startDate: string; // 対象日
  endDate: string; // 対象日
  startTime: number | null | undefined; // 出勤時間
  endTime: number | null | undefined; // 退勤時間
  restTimes: DailyRest[]; // 休憩のリスト
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type DirectRequestDetail = BaseAttDailyRequestDetail<Direct>;

/**
 * The body of request
 */
export type DirectRequest = Request<DirectRequestDetail>;
