import { CODE } from '../../AttDailyRequestType';
import { SubstituteLeaveType } from '../../SubstituteLeaveType';
import { Base } from './Base';

export { MAX_LENGTH_REMARK } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';

export type HolidayWorkRequest = Base & {
  type: typeof CODE.HolidayWork;

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
   * 振替休暇種別
   */
  substituteLeaveType: SubstituteLeaveType | null;

  /**
   * 振替休暇日
   */
  substituteDate: string | null;

  /**
   * 理由 最大255文字。
   */
  reason: string | null;

  /**
   * 備考 最大255文字。
   */
  remark: string | null;
};
