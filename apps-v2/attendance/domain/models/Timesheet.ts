// 相互参照になっているので型以外はインポートしないこと
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import { AttDailyRecord } from './AttDailyRecord';
import { AttDailyRequest } from './AttDailyRequest';
import { Code, DailyRequestNameMap } from './AttDailyRequestType';
import { STATUS, Status } from './AttFixSummaryRequest';
import { OwnerInfo } from './OwnerInfo';
import * as WorkingType from './WorkingType';

export type { OwnerInfo, Status };

export { STATUS };

export type Period = {
  name: string;
  startDate: string;
  endDate: string;
};

export type Timesheet = {
  id: string;
  recordAllRecordDates: string[];
  recordsByRecordDate: { [key: string]: AttDailyRecord };
  periods: Period[];
  requestTypes: DailyRequestNameMap;
  requestAllIds: string[];
  requestsById: { [key: string]: AttDailyRequest };
  ownerInfos: OwnerInfo[];
  startDate: string;
  endDate: string;
  requestId: string;
  status: Status;
  workingTypes: WorkingType.WorkingType[];
  approver01Name: string;
  isLocked: boolean;
  isAllAbsent: boolean;
  isMigratedSummary: boolean;
  dailyRestCountLimit: number;
};

/**
 * Timesheet から指定の AttDailyRecord を検索します。
 * @param {*} targetDate
 * @param {*} timesheet
 */
export const getAttDailyRecordByDate = (
  targetDate: string,
  timesheet: Timesheet
): AttDailyRecord | null => {
  const { recordsByRecordDate } = timesheet;
  return recordsByRecordDate && targetDate in recordsByRecordDate
    ? recordsByRecordDate[targetDate]
    : null;
};

/**
 * 指定した AttDailyRecord から申請の配列を返す。
 */
export const getAttDailyRequestByAttDailyRecord = <
  A extends Readonly<AttDailyRecord>,
  T extends Readonly<Timesheet>
>(
  record: A | null,
  timesheet: T
): AttDailyRequest[] => {
  if (record === null) {
    return [];
  }
  const { requestsById } = timesheet;
  return record.requestIds.map((k) => requestsById[k]);
};

/**
 * 指定した日の申請の配列を返す。
 * @param string targetDate
 * @param Timesheet timesheet
 */
export const getAttDailyRequestByRecordDate = <T extends Timesheet>(
  recordDate: string,
  timesheet: T
): AttDailyRequest[] => {
  const record = getAttDailyRecordByDate(recordDate, timesheet);
  return getAttDailyRequestByAttDailyRecord(record, timesheet);
};

const isStringInDateFormat = (value: string) => {
  return /\d{4}-\d{2}-\d{2}/.test(value);
};

/**
 * 指定日のタイムシートかどうかを判断する。
 * @param {*} targetDate
 * @param {*} timesheet
 */
export const isTargetDateInTimesheet = (
  timesheet: Timesheet,
  targetDate?: string
): boolean => {
  const { startDate, endDate } = timesheet;
  return (
    startDate &&
    endDate &&
    !!targetDate &&
    startDate <= targetDate &&
    targetDate <= endDate
  );
};

/**
 * 指定した日付から Period を取得します。
 * @param {*} targetDate
 * @param {*} periods
 */
export const getPeriodFromArray = (
  targetDate: string,
  periods: Timesheet['periods']
): Period | null => {
  return isStringInDateFormat(targetDate)
    ? periods.find(
        ({ startDate, endDate }) =>
          startDate <= targetDate && targetDate <= endDate
      ) || null
    : null;
};

/**
 * 指定した日付から Period を取得します。
 * @param {*} targetDate
 * @param {*} periods
 */
export const getPeriod = (
  targetDate: string,
  timesheet: Timesheet
): Period | null => {
  return getPeriodFromArray(targetDate, timesheet.periods);
};

export type ITimesheetRepository = {
  /**
   * Execute to get a timesheet (and convert it into domain model)
   *
   * @param targetDate - 勤務表の取得対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   */
  fetchRaw: (
    targetDate?: string | null | undefined,
    empId?: string | null | undefined
  ) => Promise<TimesheetFromRemote>;
  /**
   * Execute to get a timesheet (and convert it into domain model)
   *
   * @param targetDate - 勤務表の取得対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   */
  fetch: (
    targetDate?: string | null | undefined,
    empId?: string | null | undefined
  ) => Promise<Timesheet>;
  /**
   * 申請可能な各種勤怠申請を取得する
   *
   * @param targetDate - 勤務表の取得対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   */
  fetchAvailableDailyRequest: (
    targetDate?: string | null | undefined,
    empId?: string | null | undefined
  ) => Promise<{
    availableRequestTypeCodesMap: { [id: string]: Array<Code> };
  }>;
};
