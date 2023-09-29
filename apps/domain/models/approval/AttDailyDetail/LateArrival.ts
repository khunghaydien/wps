import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Late Arrival
 *
 * 遅刻申請にのみ存在する項目の type
 */
export type LateArrival = {
  type: 'LateArrival';
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number; // 始業時刻
  endTime: number; // 出勤時刻
  reason: string;
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type LateArrivalApi = AttDailyDetailBaseFromApi<LateArrival>;

export type LateArrivalStore = AttDailyDetailBaseForStore<LateArrival>;

/**
 * The body of request
 */
export type LateArrivalRequest = Request<LateArrivalStore>;
