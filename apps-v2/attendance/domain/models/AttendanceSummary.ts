import { BaseAttendanceSummary } from '@attendance/domain/models/BaseAttendanceSummary';

import { STATUS, Status } from './AttFixSummaryRequest';

export {
  SUMMARY_ITEM_NAME,
  UNIT,
} from '@attendance/domain/models/BaseAttendanceSummary';
export type {
  Unit,
  DaysAndHours,
  SummaryItemName,
  DailyRecord,
  DailyRecordTotal,
  Summary,
  SummaryItem,
  BaseSummaryItem,
  GeneralSummaryItem,
  AnnualPaidLeaveDaysSummaryItem,
  LeaveDaysSummaryItem,
  OwnerInfo,
} from '@attendance/domain/models/BaseAttendanceSummary';

export { type Status };
export { STATUS };

export type AttendanceSummary = BaseAttendanceSummary & {
  name: string;
  status: Status;
  hasCalculatedAbsence: boolean;
};

export type IAttendanceSummaryRepository = {
  fetch: (param?: {
    employeeId?: string;
    targetDate?: string;
  }) => Promise<AttendanceSummary>;
};
