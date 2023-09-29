import { CODE } from '../../AttDailyRequestType';
import { Base } from './Base';

export { MAX_LENGTH_REMARKS } from '@attendance/domain/models/AttDailyRequest/EarlyStartWorkRequest';

export type EarlyStartWorkRequest = Base & {
  type: typeof CODE.EarlyStartWork;

  /**
   * 対象日
   */
  targetDate: string;

  /**
   * 開始時間
   */
  startTime: number | null;

  /**
   * 終了時間
   */
  endTime: number | null;

  /**
   * 備考	最大255文字。
   */
  remarks: string | null;
};
