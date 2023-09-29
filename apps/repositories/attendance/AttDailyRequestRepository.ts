import Api from '../../commons/api';

// import adapter from './adapters';
import {
  AttDailyRequest,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '../../domain/models/attendance/AttDailyRequest';
import { CODE } from '../../domain/models/attendance/AttDailyRequestType';
import { LEAVE_RANGE } from '../../domain/models/attendance/LeaveRange';
import * as RestTime from '../../domain/models/attendance/RestTime';

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
    case CODE.HolidayWork:
      return {
        path: '/att/request/holiday-work/submit',
        param: {
          empId,
          requestId,
          targetDate: request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          substituteLeaveType: request.substituteLeaveType,
          substituteDate: request.substituteDate,
          remarks: request.remarks,
        },
      };
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
      const restTimes = RestTime.filter(request.directApplyRestTimes);
      return {
        path: '/att/request/direct/submit',
        param: {
          empId,
          requestId,
          startDate: request.startDate,
          endDate: request.endDate || request.startDate,
          startTime: request.startTime,
          endTime: request.endTime,
          rest1StartTime: restTimes[0] ? restTimes[0].startTime : null,
          rest1EndTime: restTimes[0] ? restTimes[0].endTime : null,
          rest2StartTime: restTimes[1] ? restTimes[1].startTime : null,
          rest2EndTime: restTimes[1] ? restTimes[1].endTime : null,
          rest3StartTime: restTimes[2] ? restTimes[2].startTime : null,
          rest3EndTime: restTimes[2] ? restTimes[2].endTime : null,
          rest4StartTime: restTimes[3] ? restTimes[3].startTime : null,
          rest4EndTime: restTimes[3] ? restTimes[3].endTime : null,
          rest5StartTime: restTimes[4] ? restTimes[4].startTime : null,
          rest5EndTime: restTimes[4] ? restTimes[4].endTime : null,
          remarks: request.remarks || '',
        },
      };
    }
    case CODE.Pattern:
      return {
        path: '/att/request/pattern/submit',
        param: {
          empId,
          requestId,
          startDate: request.startDate,
          endDate: request.endDate || request.startDate,
          patternCode: request.patternCode,
          remarks: request.remarks,
        },
      };
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
        return {
          path: '/att/request/holiday-work/reapply',
          param: {
            empId,
            targetDate: request.startDate,
            startTime: request.startTime,
            endTime: request.endTime,
            substituteLeaveType: request.substituteLeaveType,
            substituteDate: request.substituteDate,
            remarks: request.remarks,
            ...param,
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
