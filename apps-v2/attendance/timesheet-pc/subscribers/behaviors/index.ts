import { Store } from 'redux';

import fetchDailyFieldLayoutTable from './fetchDailyFieldLayoutTable';
import reloadDailyAllowanceRecords from './reloadDailyAllowanceRecords';
import reloadDailyObjectivelyEventLogs from './reloadDailyObjectivelyEventLogs';
import reloadListLegalAgreementRequest from './reloadListLegalAgreementRequest';
import reloadStampTime from './reloadStampTime';
import reloadTimesheet from './reloadTimesheet';
import reloadTimesheetOnly from './reloadTimesheetOnly';
import reloadTimeTrack from './reloadTimeTrack';
import resetTimesheet from './resetTimesheet';
import { bind } from '@attendance/libraries/Collection';

export const methods = {
  reloadDailyAllowanceRecords,
  reloadDailyObjectivelyEventLogs,
  reloadListLegalAgreementRequest,
  reloadStampTime,
  reloadTimesheet,
  reloadTimesheetOnly,
  reloadTimeTrack,
  resetTimesheet,
  fetchDailyFieldLayoutTable,
};

export default (store: Store) => bind(methods, store);
