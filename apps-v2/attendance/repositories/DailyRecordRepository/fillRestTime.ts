import Api from '@apps/commons/api';

import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

export type Result = {
  insufficientRestTime: number | null | undefined;
};

const fillRestTime: IDailyRecordRepository['fillRestTime'] = (
  params = { employeeId: null, targetDate: null }
) => {
  return Api.invoke({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: params.employeeId || null,
      targetDate: params.targetDate || null,
    },
  });
};

export default fillRestTime;
