import Api from '../commons/api';

import { ApprovalHistory } from '../domain/models/approval/request/History';

import adapter from './adapters';

export type SearchParam = {
  targetDate?: string;
  empId?: string;
  ignoredId?: string;
};

export default {
  /**
   * Exectue to get an entity
   */
  fetch: (requestId: string): Promise<ApprovalHistory[]> => {
    return Api.invoke({
      path: '/approval/request/history/get',
      param: adapter.toRemote({
        requestId,
      }),
    }).then(({ historyList }) =>
      adapter.fromRemote(historyList.map((history) => ({ ...history })))
    );
  },
};
