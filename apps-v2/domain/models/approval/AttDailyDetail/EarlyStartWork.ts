import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Early Start Work
 *
 * 早朝勤務申請にのみ存在する項目の type
 */
export type EarlyStartWork = {
  type: 'EarlyStartWork';
  startDate: string; // 対象日
  endDate: string; // 対象日
  startTime: number; // 開始時刻
  endTime: number; // 終了時刻
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type EarlyStartWorkApi = AttDailyDetailBaseFromApi<EarlyStartWork>;

export type EarlyStartWorkStore = AttDailyDetailBaseForStore<EarlyStartWork>;

/**
 * The body of request
 */
export type EarlyStartWorkRequest = Request<EarlyStartWorkStore>;
