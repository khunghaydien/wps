import Api from '@apps/commons/api';

import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

const cancelApproval: IFixDailyRequestRepository['cancelApproval'] = async (
  requestId
) =>
  Api.invoke({
    path: '/att/request/fix-daily/cancel-approval',
    param: {
      requestId,
    },
  });

export default cancelApproval;
