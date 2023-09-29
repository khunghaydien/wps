import isNumber from 'lodash/fp/isNumber';

import Api from '../../commons/api';

import {
  AttDailyRequest,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import * as AttPattern from '@attendance/domain/models/AttPattern';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

const patternCodeIsNull = (request: AttDailyRequest) => {
  if (
    (request.requestableDayType === 'Holiday' &&
      request.requestDayType === 'Holiday') ||
    (request.requestableDayType === 'Workday' &&
      request.patternCode === AttPattern.REGULAR_SHIFT_CODE) ||
    request.patternCode === AttPattern.DIRECT_INPUT
  ) {
    return true;
  } else {
    return false;
  }
};

const fieldsIsNull = (request: AttDailyRequest) => {
  if (
    request.requestDayType !== 'Holiday' &&
    request.patternCode === AttPattern.DIRECT_INPUT
  ) {
    return false;
  } else {
    return true;
  }
};

const getSubmitRequest = (
  request: AttDailyRequest,
  targetEmpId: string | null = null
) => {
  const { type } = request;
  const empId = targetEmpId || null; // NOTE: Some of APIs reject empty string as ID
  const requestId = request.id || null; // NOTE: Some of APIs reject empty string as ID
  switch (type) {
    case CODE.Leave:
      return {
        path: '/att/request/leave/submit',
        param: {
          empId,
          requestId,
          leaveCode: request.leaveCode,
          leaveDetailCode: request.leaveDetailCode,
          range: request.leaveRange,
          startDate: request.startDate,
          endDate:
            request.leaveRange === LEAVE_RANGE.Day ? request.endDate : null,
          startTime:
            request.leaveRange === LEAVE_RANGE.Time ? request.startTime : null,
          endTime:
            request.leaveRange === LEAVE_RANGE.Time ? request.endTime : null,
          remarks: request.remarks,
          reason: request.reason,
        },
      };
    case CODE.HolidayWork: {
      const patternCode =
        request.enabledPatternApply &&
        request.substituteLeaveType !== SUBSTITUTE_LEAVE_TYPE.Substitute &&
        request.patternCode !== AttPattern.DIRECT_INPUT
          ? request.patternCode
          : null;
      const selectedPattern =
        request.patterns?.find(({ code }) => code === patternCode) || null;
      const flgFlexWithCore =
        selectedPattern?.workSystem === WORK_SYSTEM_TYPE.JP_Flex &&
        selectedPattern?.withoutCoreTime;
      const flgClearingStartEndTime = patternCode && !flgFlexWithCore;

      return {
        path: '/att/request/holiday-work/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime:
            isNumber(request.startTime) && !flgClearingStartEndTime
              ? request.startTime
              : null,
          endTime:
            isNumber(request.endTime) && !flgClearingStartEndTime
              ? request.endTime
              : null,
          substituteLeaveType: request.substituteLeaveType,
          substituteDate: request.substituteDate,
          remarks: request.remarks,
          patternCode,
        },
      };
    }
    case CODE.EarlyStartWork:
      return {
        path: '/att/request/earlystart-work/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          remarks: request.remarks,
        },
      };
    case CODE.OvertimeWork:
      return {
        path: '/att/request/overtime-work/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          remarks: request.remarks,
        },
      };
    case CODE.LateArrival:
      return {
        path: '/att/request/late-arrival/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
          personalReason: request.personalReason,
          reasonId: request.reasonId,
          remarks: request.remarks,
        },
      };
    case CODE.EarlyLeave:
      return {
        path: '/att/request/early-leave/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          reason: request.reason,
          personalReason: request.personalReason,
          reasonId: request.reasonId,
          remarks: request.remarks,
        },
      };
    case CODE.Absence:
      return {
        path: '/att/request/absence/submit',
        param: {
          empId,
          requestId,
          startDate: request.startDate,
          endDate: request.endDate || request.startDate, // NOTE: endDate of Absence Request cannot be null
          reason: request.reason,
        },
      };
    case CODE.Direct: {
      return {
        path: '/att/request/direct/submit',
        param: {
          empId,
          requestId,
          startDate: request.startDate,
          endDate: request.endDate || request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          dailyRestList: request.directApplyRestTimes.map(
            ({ startTime, endTime }) => ({
              restStartTime: startTime,
              restEndTime: endTime,
            })
          ),
          remarks: request.remarks || '',
        },
      };
    }
    case CODE.Pattern: {
      const restTimes = request.patternRestTimes;
      return {
        path: '/att/request/pattern/submit',
        param: {
          empId,
          requestId,
          startDate: request.startDate,
          endDate: request.endDate || request.startDate,
          patternCode: patternCodeIsNull(request) ? null : request.patternCode,
          startTime: fieldsIsNull(request) ? null : request.startTime,
          endTime: fieldsIsNull(request) ? null : request.endTime,
          rest1StartTime: fieldsIsNull(request)
            ? null
            : restTimes[0]
            ? restTimes[0].startTime
            : null,
          rest1EndTime: fieldsIsNull(request)
            ? null
            : restTimes[0]
            ? restTimes[0].endTime
            : null,
          rest2StartTime: fieldsIsNull(request)
            ? null
            : restTimes[1]
            ? restTimes[1].startTime
            : null,
          rest2EndTime: fieldsIsNull(request)
            ? null
            : restTimes[1]
            ? restTimes[1].endTime
            : null,
          rest3StartTime: fieldsIsNull(request)
            ? null
            : restTimes[2]
            ? restTimes[2].startTime
            : null,
          rest3EndTime: fieldsIsNull(request)
            ? null
            : restTimes[2]
            ? restTimes[2].endTime
            : null,
          rest4StartTime: fieldsIsNull(request)
            ? null
            : restTimes[3]
            ? restTimes[3].startTime
            : null,
          rest4EndTime: fieldsIsNull(request)
            ? null
            : restTimes[3]
            ? restTimes[3].endTime
            : null,
          rest5StartTime: fieldsIsNull(request)
            ? null
            : restTimes[4]
            ? restTimes[4].startTime
            : null,
          rest5EndTime: fieldsIsNull(request)
            ? null
            : restTimes[4]
            ? restTimes[4].endTime
            : null,
          remarks: request.remarks,
          requestDayType: request.requestDayType,
        },
      };
    }
    default:
      throw new Error('Undefined AttDailyRequestType');
  }
};

const getUpdateRequest = <T extends AttDailyRequest>(
  request: T,
  editAction: EditAction,
  empId: string | null = null
) => {
  const { requestTypeCode, isForReapply } = request;
  if (
    editAction === EDIT_ACTION.Reapply ||
    (editAction === EDIT_ACTION.Modify && isForReapply)
  ) {
    const param: {
      requestId: string | null;
      originalRequestId: string | null;
    } = {
      requestId: null,
      originalRequestId: null,
    };
    if (editAction === EDIT_ACTION.Reapply) {
      // Reapply.
      param.originalRequestId = request.id;
    } else {
      // Reapply request again.
      param.requestId = request.id;
      param.originalRequestId = request.originalRequestId;
    }
    switch (requestTypeCode) {
      case CODE.HolidayWork:
        const patternCode =
          request.substituteLeaveType === SUBSTITUTE_LEAVE_TYPE.Substitute ||
          request.patternCode === AttPattern.DIRECT_INPUT
            ? null
            : request.patternCode;
        return {
          path: '/att/request/holiday-work/reapply',
          param: {
            empId,
            targetDate: request.startDate,
            startTime:
              request.startTime !== 0 && Number(request.startTime) === 0
                ? null
                : request.startTime,
            endTime:
              request.startTime !== 0 && Number(request.endTime) === 0
                ? null
                : request.endTime,
            substituteLeaveType: request.substituteLeaveType,
            substituteDate: request.substituteDate,
            remarks: request.remarks,
            ...param,
            patternCode,
          },
        };
      case CODE.Leave:
        return {
          path: '/att/request/leave/reapply',
          param: {
            startDate: request.startDate,
            endDate: request.endDate,
            remarks: request.remarks,
            reason: request.reason,
            ...param,
          },
        };
      default:
        return getSubmitRequest(request, empId);
    }
  }
  return getSubmitRequest(request, empId);
};

const getRemoveRequest = (id: string, disableAction: DisableAction) => {
  const path = {
    [DISABLE_ACTION.CancelRequest]: '/att/request/daily/cancel-request',
    [DISABLE_ACTION.CancelApproval]: '/att/request/daily/cancel-approval',
    [DISABLE_ACTION.Remove]: '/att/request/daily/remove',
  }[disableAction];

  if (!path) {
    throw new Error('Undefined DisableAction');
  }

  return {
    path,
    param: { requestId: id },
  };
};

export default {
  /**
   * Execute to create an AttDailyRequest
   */
  create: <T extends AttDailyRequest>(
    request: T,
    empId: string | null = null
  ): Promise<any> => {
    return Api.invoke(getSubmitRequest(request, empId));
  },

  /**
   * Execute to update an AttDailyRequest
   */
  update: <T extends AttDailyRequest>(
    request: T,
    editAction: EditAction,
    empId: string | null = null
  ): Promise<any> => {
    return Api.invoke(getUpdateRequest(request, editAction, empId));
  },

  /**
   * Execute to delete an AttDailyRequest
   */
  delete: (id: string, disableAction: DisableAction): Promise<any> => {
    return Api.invoke(getRemoveRequest(id, disableAction));
  },
};
