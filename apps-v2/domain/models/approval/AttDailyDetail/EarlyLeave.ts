import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Early Leave
 *
 * 早退申請にのみ存在する項目の type
 */
export type EarlyLeave = {
  type: 'EarlyLeave';
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number; // 終業時刻
  endTime: number; // 退勤時刻
  reason: string;
};

// TODO
// Merge the following types into one type,
// because those two types have same structure.

export type EarlyLeaveApi = AttDailyDetailBaseFromApi<EarlyLeave>;

export type EarlyLeaveStore = AttDailyDetailBaseForStore<EarlyLeave>;

/**
 * The body of request
 */
export type EarlyLeaveRequest = Request<EarlyLeaveApi>;
