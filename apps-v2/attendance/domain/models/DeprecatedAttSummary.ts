import { ActionsForFix } from '@attendance/domain/models/AttFixSummaryRequest';

/**
 * 勤怠サマリー
 * @deprecated AttFixSummaryRequest と重複しているため以降はそちらを使って実装するようにしてください。
 */
export type AttSummary = {
  /**
   * 勤怠サマリーID
   */
  id: string;

  /**
   * 勤務確定申請ID
   */
  requestId: string;

  /**
   * 確定申請のステータス
   */
  status: string;

  /**
   * 承認者01の名前
   */
  approver01Name: string;

  /**
   * ロックフラグ
   */
  isLocked: boolean;

  /**
   * 全期間休職休業フラグ
   */
  isAllLeaveOfAbsence: boolean;

  /**
   * 確定申請に関して実行可能な操作
   */
  performableActionForFix: ActionsForFix;
};
