import {
  convertFromBase,
  LeaveRequest,
} from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LeaveRange } from '@attendance/domain/models/LeaveRange';
import { LeaveType } from '@attendance/domain/models/LeaveType';

/* eslint-disable import/prefer-default-export */
export const generateLeaveRequest = (
  leaveType: LeaveType,
  leaveRange: LeaveRange
): LeaveRequest =>
  convertFromBase({
    leaveType,
    leaveRange,
    leaveCode: '',

    id: 'a',
    requestTypeCode: CODE.Leave,
    requestTypeName: 'Leave Request',
    status: 'Approved',
    startDate: '2010-10-14',
    endDate: '2010-10-14',
    startTime: 600,
    endTime: 1080,
    remarks: 'remarks',
    reason: '',
    leaveName: 'Leave1',
    substituteLeaveType: null,
    substituteDate: null,
    directApplyRestTimes: [],
    patternCode: '',
    patternName: '',
    patternRestTimes: [],
    requireReason: false,
    originalRequestId: null,
    isForReapply: false,
    approver01Name: '',
    // @ts-ignore
    targetDate: '2010-10-14',
  });
