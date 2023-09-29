import Api from '@apps/commons/api';

import adapter from '@apps/repositories/adapters';

import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

/**
 * Execute to get a timesheet (without converting into domain model)
 * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/11509595/att+timesheet+get}
 */
const fetchRaw: ITimesheetRepository['fetchRaw'] = (
  targetDate: string | null | undefined = null,
  empId: string | null | undefined = null
) => {
  return Api.invoke({
    path: '/att/timesheet/get',
    param: adapter.toRemote({
      targetDate,
      empId,
    }),
  });
};

export default fetchRaw;
