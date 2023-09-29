import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Overtime Work
 */
type OvertimeWork = {
  type: 'OvertimeWork';
  startDate: string; // 対象日
  endDate: string; // 対象日
  startTime: number; // 開始時刻
  endTime: number; // 終了時刻
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type OvertimeWorkApi = AttDailyDetailBaseFromApi<OvertimeWork>;

export type OvertimeWorkStore = AttDailyDetailBaseForStore<OvertimeWork>;

/**
 * The body of request
 */
export type OvertimeWorkRequest = Request<OvertimeWorkStore>;
