import Api from '@apps/commons/api';

import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

const submit: IFixDailyRequestRepository['submit'] = async (recordId) =>
  Api.invoke({
    path: '/att/request/fix-daily/submit',
    param: {
      recordId,
    },
  });

export default submit;
