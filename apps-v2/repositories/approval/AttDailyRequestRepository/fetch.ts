import Api from '@apps/commons/api';

import adapter from '@apps/repositories/adapters';

import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import {
  AttDailyRequestDetail as DomainAttDailyRequestDetail,
  IAttDailyRequestDetailRepository,
  REQUEST_TYPE,
  Status as ApprovalStatus,
} from '@attendance/domain/models/approval/AttDailyRequestDetail';
import {
  Absence as DomainAbsence,
  AbsenceRequestDetail as DomainAbsenceRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Absence';
import {
  DailyRest as DomainDirectDailyRest,
  Direct as DomainDirect,
  DirectRequestDetail as DomainDirectRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Direct';
import {
  EarlyLeave as DomainEarlyLeave,
  EarlyLeaveRequestDetail as DomainEarlyLeaveRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/EarlyLeave';
import {
  EarlyStartWork as DomainEarlyStartWork,
  EarlyStartWorkRequestDetail as DomainEarlyStartWorkRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/EarlyStartWork';
import {
  DailyRest as DomainHolidayWorkDailyRest,
  HolidayWork as DomainHolidayWork,
  HolidayWorkRequestDetail as DomainHolidayWorkRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/HolidayWork';
import {
  LateArrival as DomainLateArrival,
  LateArrivalRequestDetail as DomainLateArrivalRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/LateArrival';
import {
  Leave as DomainLeave,
  LeaveRequestDetail as DomainLeaveRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Leave';
import {
  None as DomainNone,
  NoneRequestDetail as DomainNoneRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/None';
import {
  OvertimeWork as DomainOvertimeWork,
  OvertimeWorkRequestDetail as DomainOvertimeWorkRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/OvertimeWork';
import {
  Pattern as DomainPattern,
  PatternRequestDetail as DomainPatternRequestDetail,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Pattern';

/**
 * The base type of daily requests
 *
 * API で返却される申請の共通部分
 */
type BaseAttDailyRequest = {
  id: string;
  status: ApprovalStatus | '';
  employeeName: string;
  employeePhotoUrl: string;
  delegatedEmployeeName: string | null | undefined;
  comment: string | null | undefined; // NOTE unimplementend and unused.
  // type: string, // request type
  typeLabel: string; // label of r request type
  remarks: string | null | undefined;
};

/**
 * API で返却される申請の休日出勤申請
 */
type HolidayWork = Omit<DomainHolidayWork, 'dailyRestList'> & {
  dailyRestList: DomainHolidayWorkDailyRest[];
};
/**
 * API で返却される申請の直行・直帰申請
 */
type Direct = Omit<DomainDirect, 'restTimes'> & {
  dailyRestList: DomainDirectDailyRest[];
};

/**
 * The base type returned by API
 *
 * API で返却されるデータのベース type
 */
type BaseAttDailyRequestDetail<TRequest> = {
  request: BaseAttDailyRequest & TRequest;
  originalRequest?: BaseAttDailyRequest & TRequest;
} & ApprovalHistoryList;

export type AbsenceRequestDetail = BaseAttDailyRequestDetail<DomainAbsence>;
export type DirectRequestDetail = BaseAttDailyRequestDetail<Direct>;
export type EarlyLeaveRequestDetail =
  BaseAttDailyRequestDetail<DomainEarlyLeave>;
export type EarlyStartWorkRequestDetail =
  BaseAttDailyRequestDetail<DomainEarlyStartWork>;
export type HolidayWorkRequestDetail = BaseAttDailyRequestDetail<HolidayWork>;
export type LateArrivalRequestDetail =
  BaseAttDailyRequestDetail<DomainLateArrival>;
export type LeaveRequestDetail = BaseAttDailyRequestDetail<DomainLeave>;
export type OvertimeWorkRequestDetail =
  BaseAttDailyRequestDetail<DomainOvertimeWork>;
export type PatternRequestDetail = BaseAttDailyRequestDetail<DomainPattern>;
export type NoneRequestDetail = BaseAttDailyRequestDetail<DomainNone>;

type AttDailyRequestDetail =
  | AbsenceRequestDetail
  | DirectRequestDetail
  | EarlyLeaveRequestDetail
  | EarlyStartWorkRequestDetail
  | HolidayWorkRequestDetail
  | LateArrivalRequestDetail
  | LeaveRequestDetail
  | OvertimeWorkRequestDetail
  | PatternRequestDetail
  | NoneRequestDetail;

/**
 * API からの値を Store 用に変換します。
 * @param {AttDailyDetailBaseFromApi}
 * @returns {AttDailyDetailBaseForStore}
 */
// eslint-disable-next-line import/prefer-default-export
export const convertForStoreFromApi = (
  obj: AttDailyRequestDetail
): DomainAttDailyRequestDetail => {
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
    case REQUEST_TYPE.Leave:
      return {
        request: {
          ...common,
          type: request.type,
          leaveName: request.leaveName,
          leaveDetailName: request.leaveDetailName,
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
              leaveDetailName: originalRequest.leaveDetailName,
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
      } as DomainLeaveRequestDetail;

    case REQUEST_TYPE.HolidayWork:
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
          patternName: request.patternName,
          dailyRestList: request.dailyRestList,
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
              patternName: originalRequest.patternName,
              dailyRestList: originalRequest.dailyRestList,
            }
          : undefined,
        historyList: obj.historyList,
      } as DomainHolidayWorkRequestDetail;

    case REQUEST_TYPE.EarlyStartWork:
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
      } as DomainEarlyStartWorkRequestDetail;

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
      } as DomainOvertimeWorkRequestDetail;

    case REQUEST_TYPE.LateArrival:
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
          personalReason: request.personalReason,
          useManageLateArrivalPersonalReason:
            request.useManageLateArrivalPersonalReason,
          reasonId: request.reasonId,
        },
        historyList: obj.historyList,
      } as DomainLateArrivalRequestDetail;

    case REQUEST_TYPE.EarlyLeave:
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
          personalReason: request.personalReason,
          useManageEarlyLeavePersonalReason:
            request.useManageEarlyLeavePersonalReason,
          reasonId: request.reasonId,
        },
        historyList: obj.historyList,
      } as DomainEarlyLeaveRequestDetail;

    case REQUEST_TYPE.Absence:
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason,
        },
        historyList: obj.historyList,
      } as DomainAbsenceRequestDetail;

    case REQUEST_TYPE.Direct:
      return {
        request: {
          ...common,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          startTime: request.startTime,
          endTime: request.endTime,
          restTimes: request.dailyRestList,
        },
        historyList: obj.historyList,
      } as DomainDirectRequestDetail;

    case REQUEST_TYPE.Pattern:
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
          workSystem: request.workSystem,
          flexStartTime: request.flexStartTime,
          flexEndTime: request.flexEndTime,
          withoutCoreTime: request.withoutCoreTime,
          requestDayType: request.requestDayType,
          isDirectInputTimeRequest: request.isDirectInputTimeRequest,
        },
        historyList: obj.historyList,
      } as DomainPatternRequestDetail;

    default:
      return {
        request: {
          ...common,
          type: '',
        },
        historyList: obj.historyList,
      } as DomainNoneRequestDetail;
  }
};

const fetch: IAttDailyRequestDetailRepository['fetch'] = async (id) => {
  const response = await Api.invoke({
    path: '/att/request/daily/get',
    param: { requestId: id },
  });
  return adapter.fromRemote(response, [convertForStoreFromApi]);
};

export default fetch;
