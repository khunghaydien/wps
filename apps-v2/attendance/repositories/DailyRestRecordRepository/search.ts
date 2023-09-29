import Api from '@apps/commons/api';

import {
  convert,
  DailyRestRecord,
} from '@attendance/repositories/models/DailyRestRecord';

import { IDailyRestRecordRepository } from '@attendance/domain/models/DailyRestRecord';

export type Response = {
  dailyRestList: DailyRestRecord[];
};

const search: IDailyRestRecordRepository['search'] = async ({
  startDate,
  endDate,
  employeeId,
}) => {
  const result: Response = await Api.invoke({
    path: '/att/daily-rest/get',
    param: {
      startDate,
      endDate,
      empId: employeeId,
    },
  });
  return convert(result.dailyRestList);
};

export default search;
