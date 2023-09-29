import Decimal from 'decimal.js';

import Api from '../../../../commons/api';

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
} as const;

export type ApprRequest = {
  /** 申請ID */
  requestId: string;

  /** 社員名 */
  employeeName: string;

  /** 顔写真URL */
  photoUrl: string;

  /** 部署名 */
  departmentName: string;

  // Attendance

  /** 承認者名 */
  approverName: string;

  /** 承認者の顔写真URL */
  approverPhotoUrl: string;

  /** 承認者の部署名 */
  approverDepartmentName: string;

  /** 申請日 */
  requestDate: string;

  /** 開始日 */
  startDate: string;

  /** 終了日 */
  endDate: string;

  /** 申請種別 */
  requestType: string;

  /** 申請ステータス */
  requestStatus: string;

  /** 承認内容変更申請元申請ステータス */
  originalRequestStatus: string;

  // Expense

  /** 申請番号 */
  reportNo: string;

  status?: string;

  /** 件名 */
  subject: string;

  /** 金額 */
  totalAmount: Decimal;
};

// 承認履歴
export type ApprRequestList = Array<ApprRequest>;

// eslint-disable-next-line import/prefer-default-export
export const fetchApprRequestList = () => {
  return Api.invoke({
    path: '/approval/request/all',
    param: {},
  }).then((res: { requestList: ApprRequestList }) => res.requestList);
};
