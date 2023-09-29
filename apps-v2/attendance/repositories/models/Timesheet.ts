import {
  convert as convertDailyRecord,
  DailyRecord,
} from '@attendance/repositories/models/DailyRecord';

import { createFromRemote as createAttDailyRequestFromRemote } from '@attendance/domain/models/AttDailyRequest';
import { AttDailyRequestFromRemote } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { DailyRequestNameMap } from '@attendance/domain/models/AttDailyRequestType';
import { Status } from '@attendance/domain/models/AttFixSummaryRequest';
import { Period } from '@attendance/domain/models/Timesheet';
import * as DomainTimesheet from '@attendance/domain/models/Timesheet';
import * as WorkingType from '@attendance/domain/models/WorkingType';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

/**
 * API Timesheet
 * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/11509595/att+timesheet+get}
 */
export type Timesheet = Readonly<{
  id: string;
  records: DailyRecord[];
  periods: Period[];
  requestTypes: DailyRequestNameMap;
  requests: { [key: string]: AttDailyRequestFromRemote };
  employeeInfoList: {
    startDate: string;
    endDate: string;
    departmentName: string;
    workingTypeName: string;
  }[];
  employeeName: string;
  startDate: string;
  endDate: string;
  requestId: string;
  status: Status;
  approver01Name: string;
  workingTypeList: WorkingType.WorkingTypeFromRemote[];
  isLocked: boolean;
  isAllAbsent: boolean;
  isMigratedSummary: boolean;
  dailyRestCountLimit: number;
}>;

const convertDailyRecordsByDate = (
  timesheet: Timesheet,
  requestsById: DomainTimesheet.Timesheet['requestsById']
): DomainTimesheet.Timesheet['recordsByRecordDate'] =>
  timesheet.records.reduce((obj, record) => {
    const { recordDate } = record;
    const workingType = RecordsUtil.getWithinRange(
      recordDate,
      timesheet.workingTypeList
    );
    const $record = convertDailyRecord(record, timesheet, requestsById);
    obj[recordDate] = {
      ...$record,
      commuteCount: workingType?.useManageCommuteCount
        ? $record.commuteCount
        : null,
    };
    return obj;
  }, {});

const convertDailyRequestsById = (
  timesheet: Timesheet
): DomainTimesheet.Timesheet['requestsById'] =>
  Object.keys(timesheet.requests).reduce((obj, key) => {
    obj[key] = createAttDailyRequestFromRemote(
      timesheet.requestTypes,
      timesheet.requests[key],
      timesheet
    );
    return obj;
  }, {});

const convertOwnerInfos = (
  timesheet: Timesheet
): DomainTimesheet.Timesheet['ownerInfos'] =>
  timesheet.employeeInfoList.map((data) => ({
    startDate: data.startDate,
    endDate: data.endDate,
    employee: {
      code: '',
      name: timesheet.employeeName,
    },
    department: {
      name: data.departmentName,
    },
    workingType: {
      name: data.workingTypeName,
    },
  }));

const convertWorkingTypes = (
  timesheet: Timesheet
): DomainTimesheet.Timesheet['workingTypes'] =>
  timesheet.workingTypeList.map(WorkingType.createFromRemote);

export const convert = (fromRemote: Timesheet): DomainTimesheet.Timesheet => {
  const requestAllIds = Object.keys(fromRemote.requests);
  const requestsById = convertDailyRequestsById(fromRemote);
  const recordAllRecordDates = fromRemote.records.map(
    ({ recordDate }) => recordDate
  );
  const recordsByRecordDate = convertDailyRecordsByDate(
    fromRemote,
    requestsById
  );

  const ownerInfos = convertOwnerInfos(fromRemote);

  const workingTypes = convertWorkingTypes(fromRemote);

  return {
    id: fromRemote.id,
    recordAllRecordDates,
    recordsByRecordDate,
    periods: fromRemote.periods,
    requestTypes: fromRemote.requestTypes,
    requestAllIds,
    requestsById,
    ownerInfos,
    startDate: fromRemote.startDate,
    endDate: fromRemote.endDate,
    requestId: fromRemote.requestId,
    status: fromRemote.status,
    workingTypes,
    approver01Name: fromRemote.approver01Name,
    isLocked: fromRemote.isLocked,
    isAllAbsent: fromRemote.isAllAbsent,
    isMigratedSummary: fromRemote.isMigratedSummary,
    dailyRestCountLimit: fromRemote.dailyRestCountLimit || 0,
  };
};
