import Api from '@apps/commons/api';

import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

const cancelSubmitted: IFixDailyRequestRepository['cancelSubmitted'] = async (
  requestId
) =>
  Api.invoke({
    path: '/att/request/fix-daily/cancel-request',
    param: {
      requestId,
    },
  });

export default cancelSubmitted;
