import { AttDailyRequestFromRemote } from '@apps/domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { TimesheetFromRemote } from '@apps/domain/models/attendance/Timesheet';
import { WorkingType } from '@apps/domain/models/attendance/WorkingType';

import {
  generateAttDailyRequestObjectMap,
  generateAttRecordObjectList,
  generateAttWorkingType,
  generatePeriodObjectList,
  requestTypes,
} from '../helpers/timesheet';

const response: TimesheetFromRemote = {
  approver01Name: '',
  departmentName: '',
  employeeName: '',
  id: '',
  isAllAbsent: false,
  isLocked: false,
  isMigratedSummary: false,
  requestId: '',
  status: undefined,
  requestTypes,
  requests: generateAttDailyRequestObjectMap() as {
    [key: string]: AttDailyRequestFromRemote;
  },
  records: generateAttRecordObjectList(),
  periods: generatePeriodObjectList(),
  workingTypeName: '固定時間制',
  workingType: generateAttWorkingType() as WorkingType,
  startDate: '2017-07-01',
  endDate: '2017-07-31',
};

export default response;
