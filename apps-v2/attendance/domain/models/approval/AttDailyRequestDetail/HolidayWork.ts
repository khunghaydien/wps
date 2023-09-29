import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

export type DailyRest = {
  restStartTime: number | null | undefined;
  restEndTime: number | null | undefined;
};

/**
 * Holiday Work
 *
 * 休日出勤申請にのみ存在する項目の type
 */
export type HolidayWork = {
  type: typeof REQUEST_TYPE.HolidayWork;
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number | null | undefined; // 開始時刻
  endTime: number | null | undefined; // 終了時刻
  substituteLeaveType: string | null | undefined; // 休日出勤取得休日タイプ
  substituteDate: string | null | undefined; // 振替休日取得日
  patternName: string; // 勤務パターン名
  dailyRestList: DailyRest[]; // 休憩のリスト
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type HolidayWorkRequestDetail = BaseAttDailyRequestDetail<HolidayWork>;

/**
 * The body of request
 */
export type HolidayWorkRequest = Request<HolidayWorkRequestDetail>;
