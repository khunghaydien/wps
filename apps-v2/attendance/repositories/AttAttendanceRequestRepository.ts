import Api from '@apps/commons/api';

import {
  ApprovalHistory,
  ApprovalHistoryList,
} from '@apps/domain/models/approval/request/History';

export default {
  isRequestAvailable: ({
    summaryId,
  }: {
    summaryId: string;
  }): Promise<{
    confirmation: string[];
  }> => {
    return Api.invoke({
      path: '/att/request/fix-monthly/check',
      param: { summaryId },
    });
  },
  fetchHistories: ({
    requestId,
  }: {
    requestId: string;
  }): Promise<ApprovalHistory[]> => {
    return Api.invoke({
      path: '/approval/request/history/get',
      param: {
        requestId,
      },
    }).then((result: ApprovalHistoryList) => result.historyList);
  },
  submit: (param: { summaryId: string; comment: string }): Promise<void> => {
    return Api.invoke({
      path: '/att/request/fix-monthly/submit',
      param,
    });
  },
  cancelRequest: (param: {
    requestId: string;
    comment: string;
  }): Promise<void> => {
    return Api.invoke({
      path: '/att/request/fix-monthly/cancel-request',
      param,
    });
  },
  cancelApproval: (param: {
    requestId: string;
    comment: string;
  }): Promise<void> => {
    return Api.invoke({
      path: '/att/request/fix-monthly/cancel-approval',
      param,
    });
  },
};
