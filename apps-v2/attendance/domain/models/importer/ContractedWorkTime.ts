import { TimeRange } from '@attendance/domain/models/TimeRange';

import { DAY_TYPE, DayType } from '../AttDailyRecord';

export type ContractedWorkTimeRecord = {
  recordDate: string;
  dayType: DayType;
  startTime: number | null;
  endTime: number | null;
  restTimes: TimeRange[];
};

export type ContractedWorkTime = {
  startDate: string | null;
  endDate: string | null;
  workingTypes: {
    startDate: string;
    endDate: string;
  }[];
  records: Map<
    ContractedWorkTimeRecord['recordDate'],
    ContractedWorkTimeRecord
  >;
};

export const isWorkDay = (time: ContractedWorkTimeRecord) => {
  return time?.dayType === DAY_TYPE.Workday;
};

export type IContractedWorkTimeRepository = {
  fetch: (param: {
    employeeId: string;
    startDate: string;
    endDate: string;
  }) => Promise<ContractedWorkTime[]>;
};
