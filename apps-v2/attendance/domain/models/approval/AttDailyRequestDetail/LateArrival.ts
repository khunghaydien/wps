import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

/**
 * Late Arrival
 *
 * 遅刻申請にのみ存在する項目の type
 */
export type LateArrival = {
  type: typeof REQUEST_TYPE.LateArrival;
  startDate: string; // 開始日
  endDate: string; // 終了日
  startTime: number; // 始業時刻
  endTime: number; // 出勤時刻
  reason: string;
  personalReason: boolean; // 自己都合
  useManageLateArrivalPersonalReason: boolean; // 自責管理
  reasonId: string | null; // 理由id
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type LateArrivalRequestDetail = BaseAttDailyRequestDetail<LateArrival>;

/**
 * The body of request
 */
export type LateArrivalRequest = Request<LateArrivalRequestDetail>;
