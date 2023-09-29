import adapter from '@apps/repositories/adapters';
import { convert, Timesheet } from '@attendance/repositories/models/Timesheet';

import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

import fetchRaw from './fetchRaw';

/**
 * Execute to get a timesheet (and convert it into domain model)
 * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/11509595/att+timesheet+get}
 */
const fetch: ITimesheetRepository['fetch'] = (
  targetDate: string | null | undefined = null,
  empId: string | null | undefined = null
) => {
  return fetchRaw(targetDate, empId).then((result: Timesheet) => {
    return adapter.fromRemote({ ...result }, [convert]);
  });
};

export default fetch;
