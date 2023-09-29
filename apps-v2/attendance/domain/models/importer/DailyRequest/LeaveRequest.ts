import { CODE } from '../../AttDailyRequestType';
import { LeaveRange } from '../../LeaveRange';
import { LeaveType } from '../../LeaveType';
import { Base } from './Base';

/**
 * 休暇申請
 */
export type LeaveRequest = Base & {
  type: typeof CODE.Leave;

  /**
   * 開始日
   */
  startDate: string;

  /**
   * 終了日
   */
  endDate: string;

  /**
   * 開始時間
   */
  startTime: number | null;

  /**
   * 終了時間
   */
  endTime: number | null;

  /**
   * 休暇コード
   */
  leaveCode: string | null;

  /**
   * 休暇名
   */
  leaveName: string | null;

  /**
   * 休暇タイプ
   */
  leaveType: LeaveType | null;

  /**
   * 休暇範囲
   */
  leaveRange: LeaveRange | null;

  /**
   * 備考	最大255文字。
   */
  remarks: string | null;

  /**
   * 理由 最大255文字。
   */
  reason: string | null;

  /**
   * 理由を求めるか否かのフラグ
   */
  requireReason: boolean;
};
