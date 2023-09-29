import Api from '@apps/commons/api';

import { IRequestRepository } from '@apps/domain/models/approval/request/Request';

const reject: IRequestRepository['reject'] = ({ ids, comment }) => {
  return Api.invoke({
    path: '/approval/request/reject',
    param: {
      requestIdList: ids,
      comment,
    },
  });
};

export default reject;
