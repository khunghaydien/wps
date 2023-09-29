import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

/**
 * Early Leave
 *
 * 早退申請にのみ存在する項目の type
 */
export type EarlyLeave = {
  type: typeof REQUEST_TYPE.EarlyLeave;
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number; // 終業時刻
  endTime: number; // 退勤時刻
  reason: string;
  personalReason: boolean; // 自己都合
  useManageEarlyLeavePersonalReason: boolean; // 早退の自責管理
  reasonId: string | null; // 理由id
};

// TODO
// Merge the following types into one type,
// because those two types have same structure.

export type EarlyLeaveRequestDetail = BaseAttDailyRequestDetail<EarlyLeave>;

/**
 * The body of request
 */
export type EarlyLeaveRequest = Request<EarlyLeaveRequestDetail>;
