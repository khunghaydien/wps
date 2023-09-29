import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import $STATUS from '@apps/domain/models/approval/request/Status';
import { WorkSystem as LegalAgreementWorkSystem } from '@attendance/domain/models/LegalAgreementOvertime';
import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

import { Submitter } from './Submitter';

export const STATUS = {
  PENDING: $STATUS.Pending,
  REMOVED: $STATUS.Recalled,
  REJECTED: $STATUS.Rejected,
  APPROVED: $STATUS.Approved,
  CANCELED: $STATUS.Canceled,
  REAPPLYING: $STATUS.Reapplying,
  REAPPLIED: $STATUS.Reapplied,
} as const;

export type Status = Value<typeof STATUS>;

type BaseLegalAgreementRequest<TRequest> = {
  request: TRequest;
  originalRequest: TRequest | null;
  legalAgreementWorkSystem: LegalAgreementWorkSystem;
} & ApprovalHistoryList;

export type MonthlyLegalAgreementRequest =
  BaseLegalAgreementRequest<MonthlyRequest>;

export type YearlyLegalAgreementRequest =
  BaseLegalAgreementRequest<YearlyRequest>;

export type LegalAgreementRequest =
  | MonthlyLegalAgreementRequest
  | YearlyLegalAgreementRequest;

export type BaseRequest<TCode extends Code> = {
  id: string;
  status: Status;
  submitter: Submitter;
  type: TCode;
  typeLabel: string;
};

export type MonthlyRequest = BaseRequest<typeof CODE.MONTHLY> & {
  monthlyOvertimeHours: number | null;
  monthlyOvertimeHours1MoAgo: number | null;
  monthlyOvertimeHours2MoAgo: number | null;
  specialMonthlyOvertimeHours: number | null;
  specialMonthlyOvertimeHours1MoAgo: number | null;
  specialMonthlyOvertimeHours2MoAgo: number | null;
  overtimeHoursLimit: number | null;
  extensionCount: number | null;
  extensionCountLimit: number | null;
  changedOvertimeHoursLimit: number | null;
  requestableOvertimeHoursLimit: number | null;
  reason: string | null;
  measure: string | null;
};

export type YearlyRequest = BaseRequest<typeof CODE.YEARLY> & {
  yearlyOvertimeHours: number | null;
  yearlyOvertimeHours1YearAgo: number | null;
  specialYearlyOvertimeHours: number | null;
  specialYearlyOvertimeHours1YearAgo: number | null;
  overtimeHoursLimit: number | null;
  changedOvertimeHoursLimit: number | null;
  requestableOvertimeHoursLimit: number | null;
  reason: string | null;
  measure: string | null;
};

export type Request = MonthlyRequest | YearlyRequest;

// FIXME: employee などをオブジェクトにしたいが View のフィルターが古いものを使っているため構造を変えられない
export type LegalAgreementRequestSummary = {
  id: string;
  employeeName: string;
  delegatedEmployeeName: string | null;
  photoUrl: string;
  departmentName: string | null;
  approverName: string;
  approverPhotoUrl: string;
  approverDepartmentName: string | null;
  requestDate: string;
  targetMonth: string;
  requestType: Code;
  requestStatus: Status;
  originalRequestStatus: Status;
};

export type ILegalAgreementRequestRepository = {
  fetch: (id: string) => Promise<LegalAgreementRequest>;
  fetchList: (
    approvalType: string,
    selectedId?: string | null
  ) => Promise<LegalAgreementRequestSummary[]>;
};
