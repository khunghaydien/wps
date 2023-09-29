import { CODE } from '../../AttDailyRequestType';
import { Base } from './Base';

/**
 * 欠勤申請
 */
export type AbsenceRequest = Base & {
  type: typeof CODE.Absence;

  /**
   * 対象日
   */
  targetDate: string;

  /**
   * 終了日
   */
  endDate: string;

  /**
   * 理由
   * (最大: 255文字)
   */
  reason: string;
};
