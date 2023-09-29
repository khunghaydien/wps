import { Status } from '../approval/request/Status';
import {
  AttDailyRecord,
  AttDailyRecordFromRemote,
  createFromRemote as createAttDailyRecordFromRemote,
} from './AttDailyRecord';
import {
  AttDailyRequest,
  createFromRemote as createAttDailyRequestFromRemote,
} from './AttDailyRequest';
import { AttDailyRequestFromRemote } from './AttDailyRequest/BaseAttDailyRequest';
import { AttDailyRequestType, Code } from './AttDailyRequestType';
import {
  createFromRemote as createWorkingTypeFromRemote,
  WorkingType,
  WorkingTypeFromRemote,
} from './WorkingType';

export type Period = {
  name: string;
  startDate: string;
  endDate: string;
};

/**
 * 勤務表の所有者情報
 * 本人には不要だが上長、労務管理者が代理ログインをした場合に必要な情報
 */
export type OwnerInfo = {
  employeeName: string;
  departmentName: string;
  workingTypeName: string;
};

export type Timesheet = {
  id: string;
  recordAllRecordDates: string[];
  recordsByRecordDate: { [key: string]: AttDailyRecord };
  periods: Period[];
  requestTypes: { [key in Code]?: AttDailyRequestType };
  requestAllIds: string[];
  requestsById: { [key: string]: AttDailyRequest };
  employeeName: string;
  departmentName: string;
  workingTypeName: string;
  startDate: string;
  endDate: string;
  requestId: string;
  status: Status;
  approver01Name: string;
  isLocked: boolean;
  workingType: WorkingTypeFromRemote;
  isAllAbsent: boolean;
  isMigratedSummary: boolean;
};

export type TimesheetFromRemote = Readonly<{
  id: string;
  records: AttDailyRecordFromRemote[];
  periods: Period[];
  requestTypes: { [key in Code]?: AttDailyRequestType };
  requests: { [key: string]: AttDailyRequestFromRemote };
  employeeName: string;
  departmentName: string;
  workingTypeName: string;
  startDate: string;
  endDate: string;
  requestId: string;
  status: Status;
  approver01Name: string;
  isLocked: boolean;
  workingType: WorkingType;
  isAllAbsent: boolean;
  isMigratedSummary: boolean;
}>;

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

const createAttDailyRecordsByDateFromRemote = (
  timesheet: TimesheetFromRemote
): Timesheet['recordsByRecordDate'] =>
  timesheet.records.reduce((obj, record) => {
    obj[record.recordDate] = createAttDailyRecordFromRemote(record);
    return obj;
  }, {});

const createAttDailyRequestsByIdFromRemote = ({
  requests,
  requestTypes,
}: TimesheetFromRemote): Timesheet['requestsById'] =>
  Object.keys(requests).reduce((obj, key) => {
    obj[key] = createAttDailyRequestFromRemote(requestTypes, requests[key]);
    return obj;
  }, {});

export const createFromRemote = (
  fromRemote: TimesheetFromRemote
): Timesheet => {
  const requestAllIds = Object.keys(fromRemote.requests);
  const requestsById = createAttDailyRequestsByIdFromRemote(fromRemote);
  const recordAllRecordDates = fromRemote.records.map(
    ({ recordDate }) => recordDate
  );
  const recordsByRecordDate = createAttDailyRecordsByDateFromRemote(fromRemote);

  return {
    id: fromRemote.id,
    recordAllRecordDates,
    recordsByRecordDate,
    periods: fromRemote.periods,
    requestTypes: fromRemote.requestTypes,
    requestAllIds,
    requestsById,
    employeeName: fromRemote.employeeName,
    departmentName: fromRemote.departmentName,
    workingTypeName: fromRemote.workingTypeName,
    startDate: fromRemote.startDate,
    endDate: fromRemote.endDate,
    requestId: fromRemote.requestId,
    status: fromRemote.status,
    approver01Name: fromRemote.approver01Name,
    isLocked: fromRemote.isLocked,
    workingType: createWorkingTypeFromRemote(fromRemote.workingType),
    isAllAbsent: fromRemote.isAllAbsent,
    isMigratedSummary: fromRemote.isMigratedSummary,
  };
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
) => {
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
