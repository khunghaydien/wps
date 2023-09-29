import { CODE } from '../../AttDailyRequestType';
import { Base } from './Base';

export { MAX_LENGTH_REASON } from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';

/**
 * Late Arrival Request
 * 遅刻申請
 */
export type LateArrivalRequest = Base & {
  type: typeof CODE.LateArrival;

  /**
   * 対象日
   */
  targetDate: string;

  /**
   * Start Time
   * 開始時間
   */
  startTime: number | null;

  /**
   * End Time
   * 終了時間
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
