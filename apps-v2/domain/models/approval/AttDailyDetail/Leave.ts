import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Leave
 *
 * 休暇申請にのみ存在する項目の type
 */
export type Leave = {
  type: 'Leave';
  leaveName: string; // 休暇名
  leaveRange: string; // 休暇範囲
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number | null | undefined; // 開始時刻
  endTime: number | null | undefined; // 終了時刻
  reason: string | null | undefined;
  requireReason: boolean; // 理由を求めるか否か
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type LeaveApi = AttDailyDetailBaseFromApi<Leave>;

export type LeaveStore = AttDailyDetailBaseForStore<Leave>;

/**
 * The body of request
 */
export type LeaveRequest = Request<LeaveStore>;
