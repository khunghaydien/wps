import { CODE } from '../../AttDailyRequestType';
import { Base } from './Base';

export { MAX_LENGTH_REASON } from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';

/**
 * Early Leave Request
 * 早退申請
 */
export type EarlyLeaveRequest = Base & {
  type: typeof CODE.EarlyLeave;

  /**
   * 対象日
   */
  targetDate: string;

  /**
   * Start Time
   * elapsed minutes of day.
   *
   * 開始時間
   * その日の0:00を0とした分で表す時刻。
   */
  startTime: number | null;

  /**
   * End Time
   * elapsed minutes of day.
   *
   * 終了時間
   * その日の0:00を0とした分で表す時刻。
   */
  endTime: number | null;

  /**
   * ReasonCode
   */
  reasonCode: string;

  /**
   * Reason (max: 255 characters)
   * 理由 (最大: 255文字)
   */
  reasonText: string;
};
