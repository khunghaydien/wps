import { labelMapping as statusLabelMapping } from '@commons/constants/requestStatus';

import Api from '../../../../../commons/api';
import msg from '@apps/commons/languages';

import { ApprovalHistory } from '../../../approval/request/History';

export type ExpApprovalHistory = ApprovalHistory;

const getStatusLabel = (history: ExpApprovalHistory): string =>
  history.statusLabel ||
  msg()[statusLabelMapping[history.status]] ||
  history.status ||
  '';

export const formatStatus = (list: ApprovalHistory[]) =>
  list.map((x) => ({
    ...x,
    statusLabel: getStatusLabel(x),
  }));

// Exp Approval Hitory
export type ExpApprovalHistoryList = { historyList: Array<ExpApprovalHistory> };

// eslint-disable-next-line import/prefer-default-export
export const getExpApprovalHistoryLit = (
  requestId: string
): Promise<ExpApprovalHistoryList> => {
  return Api.invoke({
    path: '/exp/request/history/get',
    param: {
      requestId,
    },
  }).then((response: ExpApprovalHistoryList) => response);
};
