import { BaseAttendanceSummary } from '@attendance/domain/models/BaseAttendanceSummary';

import { DailyObjectivelyEventLog } from '../DailyObjectivelyEventLog';
import { DailyRecordDisplayFieldLayoutTable } from '../DailyRecordDisplayFieldLayout';
import { DailyRestRecord } from '../DailyRestRecord';
import { DailyAllowanceRecord } from './Allowance';

export type {
  AnnualPaidLeaveDaysSummaryItem,
  BaseSummaryItem,
  DailyRecord,
  DailyRecordTotal,
  GeneralSummaryItem,
  LeaveDaysSummaryItem,
  Summary,
  SummaryItem,
  SummaryItemName,
} from '@attendance/domain/models/BaseAttendanceSummary';
export { SUMMARY_ITEM_NAME } from '@attendance/domain/models/BaseAttendanceSummary';

export type AttendanceSummary = BaseAttendanceSummary & {
  dailyAllowanceRecords: DailyAllowanceRecord[] | null;
  dailyObjectiveEventLogRecords: DailyObjectivelyEventLog[] | null;
  dailyRestRecords: DailyRestRecord[] | null;
  displayFieldLayout: DailyRecordDisplayFieldLayoutTable | null;
};
