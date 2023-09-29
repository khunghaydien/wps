import $STATUS from '@apps/domain/models/approval/request/Status';

import { CODE as REQUEST_TYPE_CODE, Code } from './LegalAgreementRequestType';

export type LegalAgreementRequest = {
  id: string;
  requestType: Code;
  status: Status;
  approver01Name: string;
  changedOvertimeHoursLimit: number;
  reason: string;
  measure: string;
  originalRequestId: string | null;
  isForReapply: boolean;
};

export type LegalAgreementRequestList = {
  requests: Array<LegalAgreementRequest>;
  availableRequestTypes: Code[];
};

export type ILegalAgreementRequestRepository = {
  fetchList: (param: {
    employeeId: string | null;
    targetDate: string;
  }) => Promise<LegalAgreementRequestList>;
  submit: (param: {
    requestId: string | null;
    summaryId: string;
    requestType: Code;
    changedOvertimeHoursLimit: number;
    reason: string;
    measures: string;
  }) => Promise<void>;
  cancelRequest: (param: { requestId: string }) => Promise<void>;
  cancelApproval: (param: { requestId: string }) => Promise<void>;
  remove: (param: { requestId: string }) => Promise<boolean>;
  reapply: (param: {
    originalRequestId: string | null;
    requestId: string | null;
    changedOvertimeHoursLimit: number;
    reason: string;
    measures: string;
  }) => Promise<void>;
};

/**
 * 編集系操作
 * - Create: 新規作成
 * - Modify: 修正
 * - Reapply: 承認内容変更
 */
export const EDIT_ACTION = {
  CREATE: 'Create',
  MODIFY: 'Modify',
  REAPPLY: 'Reapply',
  NONE: 'None',
} as const;

export type EditAction = Value<typeof EDIT_ACTION>;

/**
 * 取消系操作
 * - CancelRequest: 申請取消
 * - CancelApproval: 承認取消
 * - Remove: 申請取下
 */
export const DISABLE_ACTION = {
  CANCEL_REQUEST: 'CancelRequest',
  CANCEL_APPROVAL: 'CancelApproval',
  REMOVE: 'Remove',
  NONE: 'None',
} as const;

export type DisableAction = Value<typeof DISABLE_ACTION>;

export const STATUS = {
  NOT_REQUESTED: $STATUS.NotRequested,
  APPROVAL_IN: $STATUS.ApprovalIn,
  APPROVED: $STATUS.Approved,
  REJECTED: $STATUS.Rejected,
  REMOVED: $STATUS.Recalled,
  CANCELED: $STATUS.Canceled,
  REAPPLYING: $STATUS.Reapplying,
} as const;

export type Status = Value<typeof STATUS>;

/**
 * Obtain performable Edit action
 * 操作可能な編集系操作を返します。
 */
export const getPerformableEditAction = <
  T extends Readonly<LegalAgreementRequest>
>(
  request: T
): EditAction => {
  switch (request.status) {
    case STATUS.NOT_REQUESTED:
      return EDIT_ACTION.CREATE;
    case STATUS.APPROVAL_IN:
      return EDIT_ACTION.NONE;
    case STATUS.APPROVED:
      return EDIT_ACTION.REAPPLY;
    case STATUS.REJECTED:
    case STATUS.CANCELED:
    case STATUS.REMOVED:
      return EDIT_ACTION.MODIFY;
    default:
      return EDIT_ACTION.NONE;
  }
};

/**
 * Obtain performable Disable action
 * 操作可能な取消系操作を返します。
 */
export const getPerformableDisableAction = <
  T extends Readonly<LegalAgreementRequest>
>(
  request: T
): DisableAction => {
  switch (request.status) {
    case STATUS.NOT_REQUESTED:
      return DISABLE_ACTION.NONE;
    case STATUS.APPROVAL_IN:
      return DISABLE_ACTION.CANCEL_REQUEST;
    case STATUS.APPROVED:
      return DISABLE_ACTION.CANCEL_APPROVAL;
    case STATUS.REJECTED:
    case STATUS.CANCELED:
    case STATUS.REMOVED:
      return DISABLE_ACTION.REMOVE;
    default:
      return DISABLE_ACTION.NONE;
  }
};

const create = (requestType: Code): LegalAgreementRequest => {
  return {
    id: null,
    requestType,
    status: STATUS.NOT_REQUESTED,
    approver01Name: '',
    changedOvertimeHoursLimit: undefined,
    reason: '',
    measure: '',
    originalRequestId: null,
    isForReapply: false,
  };
};

export const createFromDefaultValue = (
  requestType: Code
): LegalAgreementRequest => {
  switch (requestType) {
    case REQUEST_TYPE_CODE.MONTHLY:
    case REQUEST_TYPE_CODE.YEARLY:
      return create(requestType);
    default:
      throw new Error('Undefined AttLegalAgreementRequestType');
  }
};
