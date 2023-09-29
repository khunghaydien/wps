import STATUS, { Status } from '@apps/domain/models/approval/request/Status';

/**
 * 確定申請に関して実行可能な操作
 * - Submit: 承認申請
 * - CancelRequest: 申請取り消し
 * - CancelApproval: 承認取り消し
 * - None: 何もない
 */
export const ACTIONS_FOR_FIX = {
  Submit: 'Submit',
  CancelRequest: 'CancelRequest',
  CancelApproval: 'CancelApproval',
  None: 'None',
} as const;

export type ActionsForFix =
  typeof ACTIONS_FOR_FIX[keyof typeof ACTIONS_FOR_FIX];

/**
 * 勤怠確定申請
 */
export type AttFixSummaryRequest = {
  /**
   * 勤怠サマリーID
   */
  summaryId: string;

  /**
   * 勤務確定申請ID
   */
  requestId: string;

  /**
   * 申請コメント
   */
  comment: string;

  /**
   * 確定申請に関して実行可能な操作
   */
  performableActionForFix: ActionsForFix;
};

/**
 * 確定申請に関して実行可能な操作を、申請の状態に基づいて判定する
 */
export const detectPerformableActionForFix = (
  status: Status
): ActionsForFix => {
  switch (status) {
    // 「承認申請」が実行可能
    case STATUS.NotRequested:
    case STATUS.Recalled:
    case STATUS.Rejected:
    case STATUS.Canceled:
      return ACTIONS_FOR_FIX.Submit;

    // 「申請取消」が実行可能
    case STATUS.Pending:
      return ACTIONS_FOR_FIX.CancelRequest;

    // 「承認取消」が実行可能
    case STATUS.Approved:
      return ACTIONS_FOR_FIX.CancelApproval;

    // 何もできない
    default:
      return ACTIONS_FOR_FIX.None;
  }
};

export const convertToSubmitParam = (
  request: AttFixSummaryRequest
): {
  summaryId: string;
  comment: string;
} => ({
  summaryId: request.summaryId,
  comment: request.comment,
});

export const convertToCancelParam = (
  request: AttFixSummaryRequest
): {
  requestId: string;
  comment: string;
} => ({
  requestId: request.requestId,
  comment: request.comment,
});
