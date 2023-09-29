import * as Timesheet from '@attendance/domain/models/importer/Timesheet';

import * as DailyRecordViewModel from '..';

export default {
  create: jest.fn(),
} as Timesheet.ITimesheetFactory<DailyRecordViewModel.DailyRecordViewModel[]>;
