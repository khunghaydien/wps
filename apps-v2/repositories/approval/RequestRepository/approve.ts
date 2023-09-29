import Api from '@apps/commons/api';

import { IRequestRepository } from '@apps/domain/models/approval/request/Request';

const approve: IRequestRepository['approve'] = ({ ids, comment }) => {
  return Api.invoke({
    path: '/approval/request/approve',
    param: {
      requestIdList: ids,
      comment,
    },
  });
};

export default approve;
