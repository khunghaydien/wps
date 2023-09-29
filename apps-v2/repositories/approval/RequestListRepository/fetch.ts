import Api from '@apps/commons/api';

import {
  ApprRequestList,
  IRequestListRepository,
} from '@apps/domain/models/approval/request/Request';

export type Response = {
  requestList: ApprRequestList;
};

const fetch: IRequestListRepository['fetch'] = async () => {
  const { requestList } = (await Api.invoke({
    path: '/approval/request/all',
    param: {},
  })) as Response;
  return requestList;
};

export default fetch;
