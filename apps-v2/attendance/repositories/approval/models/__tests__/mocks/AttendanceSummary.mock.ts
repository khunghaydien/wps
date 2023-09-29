import { defaultValue as attendanceSummary } from '@attendance/repositories/models/__tests__/mocks/BaseAttendanceSummary.mock';
import { defaultValue as dailyObjectiveEventLogRecordList } from '@attendance/repositories/models/__tests__/mocks/DailyObjectivelyEventLog.mock';

import { AttendanceSummary } from '../../AttendanceSummary';

export const defaultValue: AttendanceSummary = {
  dailyObjectiveEventLogRecordList,
  dailyAllowanceRecordList: [],
  dailyRestRecordList: [],
  displayFieldLayout: null,
  ...attendanceSummary,
};
