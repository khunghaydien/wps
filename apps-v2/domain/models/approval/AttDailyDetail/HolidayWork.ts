import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Holiday Work
 *
 * 休日出勤申請にのみ存在する項目の type
 */
export type HolidayWork = {
  type: 'HolidayWork';
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number | null | undefined; // 開始時刻
  endTime: number | null | undefined; // 終了時刻
  substituteLeaveType: string | null | undefined; // 休日出勤取得休日タイプ
  substituteDate: string | null | undefined; // 振替休日取得日
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type HolidayWorkApi = AttDailyDetailBaseFromApi<HolidayWork>;

export type HolidayWorkStore = AttDailyDetailBaseForStore<HolidayWork>;

/**
 * The body of request
 */
export type HolidayWorkRequest = Request<HolidayWorkStore>;
