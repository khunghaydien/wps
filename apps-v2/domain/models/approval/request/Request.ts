import Decimal from 'decimal.js';

import { CustomRequest as CustomRequestReport } from '@apps/domain/models/customRequest/types';

// TODO common use for approval, replace defined one in approval-pc RequestCount later
export const REQUEST_MODULE = {
  ATT_DAILY: 'attDaily',
  ATT_MONTHLY: 'attMonthly',
  TIME_REQUEST: 'timeRequest',
  EXPENSES: 'expenses',
  EXP_PRE_APPROVAL: 'expPreApproval',
};

export const REQUEST_TYPE = {
  EXPENSE: 'expense',
  ATTENDANCE_DAILY: 'attendance_daily',
  ATTENDANCE_FIX: 'attendance_fix',
  CUSTOM_REQUEST: 'custom_request',
} as const;

export type RequestType = typeof REQUEST_TYPE[keyof typeof REQUEST_TYPE];

export type BaseApprRequest = {
  /** 申請ID */
  requestId: string;

  /** 申請日 */
  requestDate: string;

  /** 申請名 */
  subject: string;

  /** 社員名 */
  employeeName: string;

  /** 顔写真URL */
  photoUrl: string;

  /** 部署名 */
  departmentName: string;
};

export type AttendanceDailyRequest = {
  /** 申請種別 */
  requestType: typeof REQUEST_TYPE.ATTENDANCE_DAILY;

  /** 承認者名 */
  approverName: string;

  /** 承認者の顔写真URL */
  approverPhotoUrl: string;

  /** 承認者の部署名 */
  approverDepartmentName: string;

  /** 開始日 */
  startDate: string;

  /** 終了日 */
  endDate: string;

  /** 申請ステータス */
  requestStatus: string;

  /** 承認内容変更申請元申請ステータス */
  originalRequestStatus: string;
} & BaseApprRequest;

export type AttendanceFixRequest = {
  /** 申請種別 */
  requestType: typeof REQUEST_TYPE.ATTENDANCE_FIX;

  /** 承認者名 */
  approverName: string;

  /** 承認者の顔写真URL */
  approverPhotoUrl: string;

  /** 承認者の部署名 */
  approverDepartmentName: string;

  /** 対象期間 */
  targetMonth: string;
} & BaseApprRequest;

export type ExpenseRequest = {
  /** 申請種別 */
  requestType: typeof REQUEST_TYPE.EXPENSE;

  /** 申請番号 */
  reportNo: string;

  status?: string;

  /** 金額 */
  totalAmount: Decimal;
} & BaseApprRequest;

export type CustomRequest = CustomRequestReport & {
  requestType: typeof REQUEST_TYPE.CUSTOM_REQUEST;
};

export type ApprRequest =
  | AttendanceDailyRequest
  | AttendanceFixRequest
  | ExpenseRequest
  | CustomRequest;

// 承認履歴
export type ApprRequestList = Array<ApprRequest>;

/**
 * いまのところ勤怠のみが返却されるリストになっているので interface を分けている
 */
export type IRequestListRepository = {
  fetch: () => Promise<ApprRequestList>;
};

export type BulkError = {
  requestId: string;
  isSuccess: boolean;
  errors: Array<{ message: string; code: string }>;
};

export type BulkApprovalRes = {
  errorCount: number;
  approvalProcessResults?: Array<BulkError>;
  count: number;
  financeBulkApprovalResults?: Array<BulkError>;
};

export const COUNT_TYPE = {
  UNAVAILABLE: 'UNAVAILABLE',
  ATT_DAILY: 'ATT_DAILY',
  ATT_FIX_MONTHLY: 'ATT_MONTHLY',
  ATT_FIX_DAILY: 'ATT_FIX_DAILY',
  TRACKING: 'TRACKING',
  EXPENSES: 'expReportRequestCount',
  EXP_PRE_APPROVAL: 'expPreApprovalRequestCount',
} as const;

export type CountType = Value<typeof COUNT_TYPE>;

export type IRequestRepository = {
  approve: (parameters: {
    ids: string[];
    comment?: string;
  }) => Promise<void | BulkApprovalRes>;
  reject: (parameters: {
    ids: string[];
    comment?: string;
  }) => Promise<void | BulkApprovalRes>;
  fetchCount: (parameter: {
    employeeId?: string;
    isDelegated: boolean;
    filterExpReqByCompanyId?: string;
    type: CountType | CountType[];
  }) => Promise<{
    attDailyRequestCount: number;
    attFixDailyRequestCount: number;
    attFixMonthlyRequestCount: number;
    timeRequestCount: number;
    expReportRequestCount: number;
    expPreApprovalRequestCount: number;
    customRequestCount: number;
    attLegalAgreementRequestCount: number;
  }>;
};
