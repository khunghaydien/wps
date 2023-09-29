import {
  generateAttDailyRequestObjectMap,
  generateAttRecordObjectList,
  generateAttWorkingType,
  generatePeriodObjectList,
  requestTypes,
} from '@attendance/repositories/__tests__/mocks/helpers/timesheet';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { AttDailyRequestFromRemote } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { WorkingTypeFromRemote } from '@attendance/domain/models/WorkingType';

const response: TimesheetFromRemote = {
  approver01Name: '',
  employeeInfoList: [
    {
      startDate: '2017-07-01',
      endDate: '2017-07-31',
      departmentName: '',
      workingTypeName: '',
    },
  ],
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
  workingTypeList: [generateAttWorkingType() as WorkingTypeFromRemote],
  startDate: '2017-07-01',
  endDate: '2017-07-31',
  dailyRestCountLimit: 5,
};

export default response;
