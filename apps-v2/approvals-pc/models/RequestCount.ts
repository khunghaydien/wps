import Api from '../../commons/api';

import { convertCount } from '../modules/ui/requestCounts';

export const REQUEST_MODULE = {
  ATT_DAILY: 'attDaily',
  ATT_MONTHLY: 'attMonthly',
  TIME_REQUEST: 'timeRequest',
  EXPENSES: 'expenses',
  EXP_PRE_APPROVAL: 'expPreApproval',
};

export type RequestCountInfo = {
  attDaily: number;
  attMonthly: number;
  timeRequest: number;
  expenses: number;
  expPreApproval: number;
};

/* eslint-disable import/prefer-default-export */
export const getRequestCount = (
  empId: string,
  isDelegatedApprover: boolean,
  filterExpReqByCompanyId: string,
  approvalType: string
): Promise<RequestCountInfo> => {
  return Api.invoke({
    path: '/approval/request-count/get',
    param: {
      empId,
      isDelegatedApprover,
      filterExpReqByCompanyId,
      approvalTypes: [approvalType],
    },
  }).then((result) => {
    return convertCount(result, approvalType);
  });
};
