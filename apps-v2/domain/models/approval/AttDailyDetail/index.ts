import DateUtil from '../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import { AbsenceApi, AbsenceRequest, AbsenceStore } from './Absence';
import { DirectApi, DirectRequest, DirectStore } from './Direct';
import {
  EarlyLeaveApi,
  EarlyLeaveRequest,
  EarlyLeaveStore,
} from './EarlyLeave';
import {
  EarlyStartWorkApi,
  EarlyStartWorkRequest,
  EarlyStartWorkStore,
} from './EarlyStartWork';
import {
  HolidayWorkApi,
  HolidayWorkRequest,
  HolidayWorkStore,
} from './HolidayWork';
import {
  LateArrivalApi,
  LateArrivalRequest,
  LateArrivalStore,
} from './LateArrival';
import { LeaveApi, LeaveRequest, LeaveStore } from './Leave';
import { NoneApi, NoneStore } from './None';
import {
  OvertimeWorkApi,
  OvertimeWorkRequest,
  OvertimeWorkStore,
} from './OvertimeWork';
import { PatternApi, PatternRequest, PatternStore } from './Pattern';

export type { AbsenceRequest } from './Absence';
export type { DirectRequest } from './Direct';
export type { EarlyStartWorkRequest } from './EarlyStartWork';
export type { HolidayWorkRequest } from './HolidayWork';
export type { LeaveRequest } from './Leave';
export type { NoneRequest } from './None';
export type { OvertimeWorkRequest } from './OvertimeWork';
export type { PatternRequest } from './Pattern';
export type { LateArrivalRequest } from './LateArrival';
export type { EarlyLeaveRequest } from './EarlyLeave';

/**
 * The type of a value returned by API
 *
 * API で返却されるデータ type
 */
export type AttDailyDetailFromApi =
  | AbsenceApi
  | DirectApi
  | EarlyStartWorkApi
  | HolidayWorkApi
  | LeaveApi
  | NoneApi
  | OvertimeWorkApi
  | PatternApi
  | LateArrivalApi
  | EarlyLeaveApi;

/**
 * The type of store
 *
 * TODO
 * Remove this type.
 * the type representing redux store should be deifned in
 * modules.
 * Domain model should not have concerned about redux store,
 * becuase redux store is in application layer.
 */
export type AttDailyDetailForStore =
  | AbsenceStore
  | DirectStore
  | EarlyStartWorkStore
  | HolidayWorkStore
  | LeaveStore
  | NoneStore
  | OvertimeWorkStore
  | PatternStore
  | LateArrivalStore
  | EarlyLeaveStore;

/**
 * API からの値を Store 用に変換します。
 * @param {AttDailyDetailBaseFromApi}
 * @returns {AttDailyDetailBaseForStore}
 */
// eslint-disable-next-line import/prefer-default-export
export const convertForStoreFromApi = (
  obj: AttDailyDetailFromApi
): AttDailyDetailForStore => {
  const request = obj.request;
  const common = {
    id: request.id,
    status: request.status,
    employeeName: request.employeeName,
    employeePhotoUrl: request.employeePhotoUrl,
    delegatedEmployeeName: request.delegatedEmployeeName,
    comment: request.comment,
    typeLabel: request.typeLabel,
    remarks: request.remarks,
  };

  // NOTE 型合わせるが超難しいので、暫定で型チェックしていない
  const originalRequest = obj.originalRequest as any;
  const originalCommon = originalRequest
    ? {
        id: originalRequest.id,
        status: originalRequest.status,
        employeeName: originalRequest.employeeName,
        employeePhotoUrl: originalRequest.employeePhotoUrl,
        delegatedEmployeeName: originalRequest.delegatedEmployeeName,
        comment: originalRequest.comment,
        typeLabel: originalRequest.typeLabel,
        remarks: originalRequest.remarks,
      }
    : {};

  switch (request.type) {
    case 'Leave':
      return {
        request: {
          ...common,
          type: request.type,
          leaveName: request.leaveName,
          leaveRange: request.leaveRange,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
          requireReason: request.requireReason,
        },
        originalRequest: originalRequest
          ? {
              ...originalCommon,
              type: originalRequest.type,
              leaveName: originalRequest.leaveName,
              leaveRange: originalRequest.leaveRange,
              startDate: originalRequest.startDate,
              endDate: originalRequest.endDate,
              startTime: originalRequest.startTime,
              endTime: originalRequest.endTime,
              reason: originalRequest.reason,
              requireReason: originalRequest.requireReason,
            }
          : undefined,
        historyList: obj.historyList,
      } as LeaveStore;

    case 'HolidayWork':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          substituteDate: request.substituteDate,
          substituteLeaveType: request.substituteLeaveType,
        },
        originalRequest: originalRequest
          ? {
              ...originalCommon,
              type: originalRequest.type,
              startDate: originalRequest.startDate,
              endDate: originalRequest.endDate,
              startTime: originalRequest.startTime,
              endTime: originalRequest.endTime,
              substituteDate: originalRequest.substituteDate,
              substituteLeaveType: originalRequest.substituteLeaveType,
            }
          : undefined,
        historyList: obj.historyList,
      } as HolidayWorkStore;

    case 'EarlyStartWork':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
        },
        historyList: obj.historyList,
      } as EarlyStartWorkStore;

    case 'OvertimeWork':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
        },
        historyList: obj.historyList,
      } as OvertimeWorkStore;

    case 'LateArrival':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
        },
        historyList: obj.historyList,
      } as LateArrivalStore;

    case 'EarlyLeave':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
        },
        historyList: obj.historyList,
      } as EarlyLeaveStore;

    case 'Absence':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason,
        },
        historyList: obj.historyList,
      } as AbsenceStore;

    case 'Direct':
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          rest1StartTime: request.rest1StartTime,
          rest1EndTime: request.rest1EndTime,
          rest2StartTime: request.rest2StartTime,
          rest2EndTime: request.rest2EndTime,
          rest3StartTime: request.rest3StartTime,
          rest3EndTime: request.rest3EndTime,
          rest4StartTime: request.rest4StartTime,
          rest4EndTime: request.rest4EndTime,
          rest5StartTime: request.rest5StartTime,
          rest5EndTime: request.rest5EndTime,
        },
        historyList: obj.historyList,
      } as DirectStore;

    case 'Pattern':
      return {
        request: {
          ...common,
          type: request.type,
          attPatternName: request.attPatternName,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          rest1StartTime: request.rest1StartTime,
          rest1EndTime: request.rest1EndTime,
          rest2StartTime: request.rest2StartTime,
          rest2EndTime: request.rest2EndTime,
          rest3StartTime: request.rest3StartTime,
          rest3EndTime: request.rest3EndTime,
          rest4StartTime: request.rest4StartTime,
          rest4EndTime: request.rest4EndTime,
          rest5StartTime: request.rest5StartTime,
          rest5EndTime: request.rest5EndTime,
        },
        historyList: obj.historyList,
      } as PatternStore;

    default:
      return {
        request: {
          ...common,
          type: '',
        },
        historyList: obj.historyList,
      } as NoneStore;
  }
};

export const REQUEST_TYPE = {
  LEAVE: 'Leave',
  HOLIDAY_WORK: 'HolidayWork',
  EARLY_START_WORK: 'EarlyStartWork',
  OVERTIME_WORK: 'OvertimeWork',
  ABSENCE: 'Absence',
  DIRECT: 'Direct',
  PATTERN: 'Pattern',
  LATE_ARRIVAL: 'LateArrival',
  EARLY_LEAVE: 'EarlyLeave',
};

export const LEAVE_RANGE_TYPE = {
  DAY: 'Day',
  AM: 'AM',
  PM: 'PM',
  HALF: 'Half',
  TIME: 'Time',
};

export const ABSENCE_RANGE_TYPE = {
  DAY: 'Day',
};

export const SUBSTITUTE_LEAVE_TYPE = {
  Substitute: 'Substitute',
  CompensatoryStocked: 'CompensatoryStocked',
};

export const LEAVE_RANGE_LABEL = {
  [LEAVE_RANGE_TYPE.DAY]: 'Att_Lbl_DayLeave',
  [LEAVE_RANGE_TYPE.AM]: 'Att_Lbl_AMLeave',
  [LEAVE_RANGE_TYPE.PM]: 'Att_Lbl_PMLeave',
  [LEAVE_RANGE_TYPE.HALF]: 'Att_Lbl_HalfDayLeave',
  [LEAVE_RANGE_TYPE.TIME]: 'Att_Lbl_TimeLeave',
};

export const SUBSTITUTE_LEAVE_TYPE_LABEL = {
  [SUBSTITUTE_LEAVE_TYPE.Substitute]: 'Att_Lbl_Substitute',
  [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]: 'Att_Lbl_CompensatoryLeave',
  '': null,
};

export const getDateOrRange = (detail: LeaveRequest): string => {
  const startDate = detail.startDate;
  const endDate = detail.endDate;

  if (detail.leaveRange === LEAVE_RANGE_TYPE.TIME) {
    return `${DateUtil.formatYMD(detail.startDate)} ${TimeUtil.toHHmm(
      detail.startTime
    )}-${TimeUtil.toHHmm(detail.endTime)}`;
  }

  if (detail.leaveRange === LEAVE_RANGE_TYPE.DAY && startDate !== endDate) {
    return `${DateUtil.formatYMD(startDate)}–${DateUtil.formatYMD(endDate)}`;
  }

  return DateUtil.formatYMD(startDate);
};

export const getDateWithTimeRange = (
  detail: HolidayWorkRequest | EarlyStartWorkRequest | OvertimeWorkRequest
) => {
  return `${DateUtil.formatYMD(detail.startDate)} ${TimeUtil.toHHmm(
    detail.startTime
  )}–${TimeUtil.toHHmm(detail.endTime)}`;
};

/**
 * Get a period of requests.
 */
export const getPeriod = (
  detail:
    | LeaveRequest
    | HolidayWorkRequest
    | EarlyStartWorkRequest
    | OvertimeWorkRequest
    | AbsenceRequest
    | DirectRequest
    | PatternRequest
    | LateArrivalRequest
    | EarlyLeaveRequest
): string => {
  switch (detail.type) {
    case REQUEST_TYPE.LEAVE:
      return getDateOrRange(detail as LeaveRequest);

    case REQUEST_TYPE.HOLIDAY_WORK:
      return getDateWithTimeRange(detail as HolidayWorkRequest);

    case REQUEST_TYPE.EARLY_START_WORK:
      return getDateWithTimeRange(detail as EarlyStartWorkRequest);

    case REQUEST_TYPE.OVERTIME_WORK:
      return getDateWithTimeRange(detail as OvertimeWorkRequest);

    case REQUEST_TYPE.LATE_ARRIVAL:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.EARLY_LEAVE:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.ABSENCE:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.DIRECT:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    case REQUEST_TYPE.PATTERN:
      return DateUtil.formatDateOrRange(detail.startDate, detail.endDate);

    default:
      return '';
  }
};
