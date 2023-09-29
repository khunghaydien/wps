import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Pattern
 */
type Pattern = {
  type: 'Pattern';
  attPatternName: string; // 勤務パターン名
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

export type PatternApi = AttDailyDetailBaseFromApi<Pattern>;

export type PatternStore = AttDailyDetailBaseForStore<Pattern>;

/**
 * The body of request
 */
export type PatternRequest = Request<PatternStore>;
