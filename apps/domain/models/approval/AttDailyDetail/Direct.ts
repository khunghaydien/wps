import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Direct
 */
export type Direct = {
  type: 'Direct';
  startDate: string; // 対象日
  endDate: string; // 対象日
  startTime: number | null | undefined; // 出勤時間
  endTime: number | null | undefined; // 退勤時間
  rest1StartTime: number | null | undefined; // 休憩1開始時間
  rest1EndTime: number | null | undefined; // 休憩1終了時間
  rest2StartTime: number | null | undefined; // 休憩2開始時間
  rest2EndTime: number | null | undefined; // 休憩2終了時間
  rest3StartTime: number | null | undefined; // 休憩3開始時間
  rest3EndTime: number | null | undefined; // 休憩3終了時間
  rest4StartTime: number | null | undefined; // 休憩4開始時間
  rest4EndTime: number | null | undefined; // 休憩4終了時間
  rest5StartTime: number | null | undefined; // 休憩5開始時間
  rest5EndTime: number | null | undefined; // 休憩5終了時間
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type DirectApi = AttDailyDetailBaseFromApi<Direct>;

export type DirectStore = AttDailyDetailBaseForStore<Direct>;

/**
 * The body of request
 */
export type DirectRequest = Request<DirectStore>;
