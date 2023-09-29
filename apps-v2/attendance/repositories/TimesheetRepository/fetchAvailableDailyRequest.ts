import Api from '../../../commons/api';

import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

const fetchAvailableDailyRequest: ITimesheetRepository['fetchAvailableDailyRequest'] =
  (
    targetDate: string | null | undefined = null,
    empId: string | null | undefined = null
  ) => {
    return Api.invoke({
      path: '/att/daily-request/available/list',
      param: {
        targetDate,
        empId,
      },
    });
  };

export default fetchAvailableDailyRequest;
