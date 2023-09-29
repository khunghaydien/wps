import {
  convert as convertDailyObjectiveEventLogRecordList,
  DailyObjectivelyEventLogRecord,
} from '@attendance/repositories/models/DailyObjectivelyEventLog';
import {
  convert as convertRestReasonRecordList,
  DailyRestRecord,
} from '@attendance/repositories/models/DailyRestRecord';

import {
  BaseAttendanceSummary,
  convert as $convert,
} from '../../models/BaseAttendanceSummary';
import { DailyAllowanceRecord as DomainAllowanceDailyRecord } from '@attendance/domain/models/approval/Allowance';
import { AttendanceSummary as DomainAttendanceSummary } from '@attendance/domain/models/approval/AttendanceSummary';

import {
  convert as convertDisplayFieldLayout,
  Response as DisplayFieldLayout,
} from './DailyRecordDisplayFieldLayout';

export type { DailyRecord, Summary } from '../../models/BaseAttendanceSummary';
export {
  createDividedSummaries,
  createOwnerInfos,
  createRecord,
  createRecords,
  createSummaries,
  createWorkingType,
} from '../../models/BaseAttendanceSummary';

export type AttendanceSummary = {
  employeeCode: string;
  employeeName: string;
  dailyAllowanceRecordList: DomainAllowanceDailyRecord[];
  dailyObjectiveEventLogRecordList: DailyObjectivelyEventLogRecord[];
  dailyRestRecordList: DailyRestRecord[];
  displayFieldLayout: DisplayFieldLayout;
} & BaseAttendanceSummary;

export const convert = (
  summary: AttendanceSummary
): DomainAttendanceSummary => ({
  ...$convert(summary),
  dailyAllowanceRecords: summary.dailyAllowanceRecordList,
  dailyObjectiveEventLogRecords: convertDailyObjectiveEventLogRecordList(
    summary.dailyObjectiveEventLogRecordList
  ),
  dailyRestRecords: convertRestReasonRecordList(summary.dailyRestRecordList),
  displayFieldLayout: summary.displayFieldLayout
    ? convertDisplayFieldLayout(summary.displayFieldLayout)
    : null,
});
