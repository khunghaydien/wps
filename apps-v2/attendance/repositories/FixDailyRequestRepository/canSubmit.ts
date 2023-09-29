import Api from '@apps/commons/api';

import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

const canSubmit: IFixDailyRequestRepository['canSubmit'] = async (recordId) =>
  Api.invoke({
    path: '/att/request/fix-daily/check',
    param: {
      recordId,
    },
  });

export default canSubmit;
