import Api from '@apps/commons/api';

import {
  convert,
  DailyObjectivelyEventLogRecord,
} from '../models/DailyObjectivelyEventLog';
import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

export type Response = {
  dailyRecordList: DailyObjectivelyEventLogRecord[];
};

const search: IDailyObjectivelyEventLogRepository['search'] = async ({
  employeeId,
  startDate,
  endDate,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/daily-objectively-event-log/get',
    param: {
      empId: employeeId,
      startDate,
      endDate,
    },
  });
  return convert(response.dailyRecordList);
};

export default search;
