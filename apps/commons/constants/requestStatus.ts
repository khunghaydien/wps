// TODO 検討個別exportはやめたほうがよい？
export const NOT_REQUESTED = 'NotRequested';
export const PENDING = 'Pending';
export const RECALLED = 'Removed';
export const REJECTED = 'Rejected';
export const APPROVED = 'Approved';
export const CANCELED = 'Canceled';
export const REAPPLYING = 'Reapplying';
export const APPROVAL_IN = 'Approval In';
export const ACCOUNTING_AUTHORIZED = 'AccountingAuthorized';
export const ACCOUNTING_REJECTED = 'AccountingRejected';
export const APPROVED_PRE_REQUEST = 'ApprovedPreRequest';

export const statuses = {
  NOT_REQUESTED,
  PENDING,
  RECALLED,
  REJECTED,
  APPROVED,
  CANCELED,
  REAPPLYING,
  APPROVAL_IN,
  ACCOUNTING_AUTHORIZED,
  ACCOUNTING_REJECTED,
};

// 編集不可ステータス
export const lockEditStatus = [PENDING, APPROVED];

export const labelMapping = {
  [NOT_REQUESTED]: 'Com_Lbl_NotRequested',
  [PENDING]: 'Com_Lbl_Pending',
  [RECALLED]: 'Com_Lbl_Recalled',
  [REJECTED]: 'Com_Lbl_Rejected',
  [APPROVED]: 'Com_Lbl_Approved',
  [CANCELED]: 'Com_Lbl_ApproveCancel',
  [ACCOUNTING_AUTHORIZED]: 'Exp_Status_AccountingAuthorized',
  [ACCOUNTING_REJECTED]: 'Exp_Status_AccountingRejected',
  [REAPPLYING]: '',
  [APPROVAL_IN]: '',
  [APPROVED_PRE_REQUEST]: '',
};

export const LABEL_UNAPPROVED = 'Com_Lbl_UnApproved';
