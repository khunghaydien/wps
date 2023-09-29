import Api from '@apps/commons/api';

import adapter from '@apps/repositories/adapters';

import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import * as DomainLegalAgreementRequest from '@attendance/domain/models/approval/LegalAgreementRequest';
import { WorkSystem as LegalAgreementWorkSystem } from '@attendance/domain/models/LegalAgreementOvertime';
import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

type Common<TCode extends Code> = {
  id: string;
  status: DomainLegalAgreementRequest.Status;
  employeeName: string;
  employeePhotoUrl: string;
  delegatedEmployeeName: string;
  typeLabel: string;
  type: TCode;
};

type MonthlyRequest = Common<typeof CODE.MONTHLY> & {
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

type YearlyRequest = Common<typeof CODE.YEARLY> & {
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

type Request = MonthlyRequest | YearlyRequest;

export type Response = {
  request: Request;
  originalRequest: Request | null;
  legalAgreementWorkSystem: LegalAgreementWorkSystem;
} & ApprovalHistoryList;

const convertSubmitter = (request: Request) => ({
  employee: {
    name: request.employeeName,
    code: '',
    photoUrl: request.employeePhotoUrl,
    department: {
      name: '',
    },
  },
  delegator: {
    employee: {
      name: request.delegatedEmployeeName,
    },
  },
});

const convertCommon = (
  request: Request
): DomainLegalAgreementRequest.BaseRequest<Code> => ({
  id: request.id,
  status: request.status,
  submitter: convertSubmitter(request),
  type: request.type,
  typeLabel: request.typeLabel,
});

const convertMonthlyRequest = (
  request: MonthlyRequest
): DomainLegalAgreementRequest.MonthlyRequest => ({
  ...(convertCommon(request) as DomainLegalAgreementRequest.BaseRequest<
    typeof CODE.MONTHLY
  >),
  monthlyOvertimeHours: request.monthlyOvertimeHours,
  monthlyOvertimeHours1MoAgo: request.monthlyOvertimeHours1MoAgo,
  monthlyOvertimeHours2MoAgo: request.monthlyOvertimeHours2MoAgo,
  specialMonthlyOvertimeHours: request.specialMonthlyOvertimeHours,
  specialMonthlyOvertimeHours1MoAgo: request.specialMonthlyOvertimeHours1MoAgo,
  specialMonthlyOvertimeHours2MoAgo: request.specialMonthlyOvertimeHours2MoAgo,
  overtimeHoursLimit: request.overtimeHoursLimit,
  extensionCount: request.extensionCount,
  extensionCountLimit: request.extensionCountLimit,
  changedOvertimeHoursLimit: request.changedOvertimeHoursLimit,
  requestableOvertimeHoursLimit: request.requestableOvertimeHoursLimit,
  reason: request.reason,
  measure: request.measure,
});

const convertYearlyRequest = (
  request: YearlyRequest
): DomainLegalAgreementRequest.YearlyRequest => ({
  ...(convertCommon(request) as DomainLegalAgreementRequest.BaseRequest<
    typeof CODE.YEARLY
  >),
  yearlyOvertimeHours: request.yearlyOvertimeHours,
  yearlyOvertimeHours1YearAgo: request.yearlyOvertimeHours1YearAgo,
  specialYearlyOvertimeHours: request.specialYearlyOvertimeHours,
  specialYearlyOvertimeHours1YearAgo:
    request.specialYearlyOvertimeHours1YearAgo,
  overtimeHoursLimit: request.overtimeHoursLimit,
  changedOvertimeHoursLimit: request.changedOvertimeHoursLimit,
  requestableOvertimeHoursLimit: request.requestableOvertimeHoursLimit,
  reason: request.reason,
  measure: request.measure,
});

const convert = (
  response: Response
): DomainLegalAgreementRequest.LegalAgreementRequest => {
  const { request, originalRequest } = response;
  switch (request.type) {
    case CODE.MONTHLY:
      return {
        request: convertMonthlyRequest(request),
        originalRequest: originalRequest
          ? convertMonthlyRequest(originalRequest as MonthlyRequest)
          : null,
        historyList: response.historyList,
        legalAgreementWorkSystem: response.legalAgreementWorkSystem,
      } as DomainLegalAgreementRequest.MonthlyLegalAgreementRequest;
    case CODE.YEARLY:
      return {
        request: convertYearlyRequest(request),
        originalRequest: originalRequest
          ? convertYearlyRequest(originalRequest as YearlyRequest)
          : null,
        historyList: response.historyList,
        legalAgreementWorkSystem: response.legalAgreementWorkSystem,
      } as DomainLegalAgreementRequest.YearlyLegalAgreementRequest;
    default:
      return null;
  }
};

const fetch: DomainLegalAgreementRequest.ILegalAgreementRequestRepository['fetch'] =
  async (id) => {
    const response = await Api.invoke({
      path: '/att/request/legal-agreement/get',
      param: {
        requestId: id,
      },
    });
    return adapter.fromRemote(response, [convert]);
  };

export default fetch;
