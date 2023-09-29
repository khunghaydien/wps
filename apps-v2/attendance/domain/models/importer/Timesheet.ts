import * as DailyRecord from './DailyRecord';

export type Timesheet = {
  employeeId: string;
  startDate: string;
  endDate: string;
  records: DailyRecord.DailyRecord[];
};

export type ITimesheetFactory<T> = {
  create: (arg0: T) => Timesheet;
};

export type ITimesheetRepository = {
  save: (timesheet: Timesheet) => Promise<void>;
  check: (param: {
    employeeId: string;
    startDate: string;
    endDate: string;
  }) => Promise<Map<DailyRecord.DailyRecord['recordDate'], string[]>>;
};
