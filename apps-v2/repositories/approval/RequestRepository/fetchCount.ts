import Api from '@apps/commons/api';

import { IRequestRepository } from '@apps/domain/models/approval/request/Request';

export type Response = {
  attDailyRequestCount: number;
  attFixDailyRequestCount: number;
  attLegalAgreementRequestCount: number;
  attFixMonthlyRequestCount: number;
  timeRequestCount: number;
  expReportRequestCount: number;
  expPreApprovalRequestCount: number;
  customRequestCount: number;
};

const fetchCount: IRequestRepository['fetchCount'] = async ({
  employeeId,
  filterExpReqByCompanyId,
  isDelegated: isDelegatedApprover,
  type,
}) => {
  const response = (await Api.invoke({
    path: '/approval/request-count/get',
    param: {
      empId: employeeId,
      filterExpReqByCompanyId,
      isDelegatedApprover,
      approvalTypes: [].concat(type),
    },
  })) as Response;
  return {
    attDailyRequestCount: response.attDailyRequestCount,
    attFixDailyRequestCount: response.attFixDailyRequestCount,
    attLegalAgreementRequestCount: response.attLegalAgreementRequestCount,
    attFixMonthlyRequestCount: response.attFixMonthlyRequestCount,
    timeRequestCount: response.timeRequestCount,
    expReportRequestCount: response.expReportRequestCount,
    expPreApprovalRequestCount: response.expPreApprovalRequestCount,
    customRequestCount: response.customRequestCount,
  };
};

export default fetchCount;
