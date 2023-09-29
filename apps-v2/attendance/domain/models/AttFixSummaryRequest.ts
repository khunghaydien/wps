import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import $STATUS from '@apps/domain/models/approval/request/Status';

export const STATUS = {
  NOT_REQUESTED: $STATUS.NotRequested,
  APPROVED: $STATUS.Approved,
  PENDING: $STATUS.Pending,
  CANCELED: $STATUS.Canceled,
  REJECTED: $STATUS.Rejected,
  RECALLED: $STATUS.Recalled,
} as const;

export type Status = Value<typeof STATUS>;

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
   * 確定申請のステータス
   */
  status: Status;

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
    case STATUS.NOT_REQUESTED:
    case STATUS.RECALLED:
    case STATUS.REJECTED:
    case STATUS.CANCELED:
      return ACTIONS_FOR_FIX.Submit;

    // 「申請取消」が実行可能
    case STATUS.PENDING:
      return ACTIONS_FOR_FIX.CancelRequest;

    // 「承認取消」が実行可能
    case STATUS.APPROVED:
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

export const getPermissionTestConditionsForActionForFix = (
  actionsForFix: ActionsForFix
): DynamicTestConditions | void => {
  switch (actionsForFix) {
    case ACTIONS_FOR_FIX.Submit:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelRequest:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelApproval:
      return {
        requireIfByEmployee: ['cancelAttApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttApprovalByDelegate'],
      };
    case ACTIONS_FOR_FIX.None:
      return {
        allowIfByEmployee: true,
      };
  }
};
