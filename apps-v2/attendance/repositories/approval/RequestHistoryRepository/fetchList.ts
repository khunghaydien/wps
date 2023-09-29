import Api from '@commons/api';

import adapter from '@apps/repositories/adapters';

import { IRequestHistoryRepository } from '@attendance/domain/models/approval/RequestHistory';

export default ((requestId) => {
  return Api.invoke({
    path: '/approval/request/history/get',
    param: adapter.toRemote({
      requestId,
    }),
  }).then(({ historyList }) =>
    adapter.fromRemote(historyList.map((history) => ({ ...history })))
  );
}) as IRequestHistoryRepository['fetchList'];
