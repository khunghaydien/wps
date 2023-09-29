import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

/**
 * Overtime Work
 */
export type OvertimeWork = {
  type: typeof REQUEST_TYPE.OvertimeWork;
  startDate: string; // 対象日
  endDate: string; // 対象日
  startTime: number; // 開始時刻
  endTime: number; // 終了時刻
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type OvertimeWorkRequestDetail = BaseAttDailyRequestDetail<OvertimeWork>;

/**
 * The body of request
 */
export type OvertimeWorkRequest = Request<OvertimeWorkRequestDetail>;
