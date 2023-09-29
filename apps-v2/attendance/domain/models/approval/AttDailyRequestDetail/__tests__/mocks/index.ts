import { defaultValue as historyList } from '@apps/domain/models/approval/request/__test__/mocks/History';
import {
  REQUEST_TYPE,
  STATUS,
} from '@attendance/domain/models/approval/AttDailyRequestDetail';

import { AbsenceRequestDetail } from '../../Absence';
import { DirectRequestDetail } from '../../Direct';
import { EarlyLeaveRequestDetail } from '../../EarlyLeave';
import { EarlyStartWorkRequestDetail } from '../../EarlyStartWork';
import { HolidayWorkRequestDetail } from '../../HolidayWork';
import { LateArrivalRequestDetail } from '../../LateArrival';
import { LeaveRequestDetail } from '../../Leave';
import { NoneRequestDetail } from '../../None';
import { OvertimeWorkRequestDetail } from '../../OvertimeWork';
import { PatternRequestDetail } from '../../Pattern';

const request = {
  id: '0001',
  status: STATUS.APPROVED,
  employeeName: 'Employee Name',
  employeePhotoUrl: 'employee-photo-url',
  delegatedEmployeeName: 'Delegated Employee Name',
  comment: 'Comment',
  typeLabel: 'typeLabel',
  remarks: 'Remarks ',
};
const originalRequest = {
  id: '0002',
  status: STATUS.APPROVED,
  employeeName: 'Employee Name Original ',
  employeePhotoUrl: 'employee-photo-url-original',
  delegatedEmployeeName: 'Delegated Employee Name Original ',
  comment: 'Comment',
  typeLabel: 'typeLabel',
  remarks: 'Remarks ',
};

export const absence: AbsenceRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.Absence,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    reason: 'Reason',
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.Absence,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    reason: 'Reason Original ',
  },
  ...historyList,
};
export const direct: DirectRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.Direct,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 11,
    endTime: 12,
    restTimes: [
      { restStartTime: 1, restEndTime: 2 },
      { restStartTime: 3, restEndTime: 4 },
      { restStartTime: 5, restEndTime: 6 },
      { restStartTime: 7, restEndTime: 8 },
      { restStartTime: 9, restEndTime: 10 },
    ],
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.Direct,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 21,
    endTime: 22,
    restTimes: [
      { restStartTime: 31, restEndTime: 32 },
      { restStartTime: 33, restEndTime: 34 },
      { restStartTime: 35, restEndTime: 36 },
      { restStartTime: 37, restEndTime: 38 },
      { restStartTime: 39, restEndTime: 40 },
    ],
  },
  ...historyList,
};
export const earlyLeave: EarlyLeaveRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.EarlyLeave,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
    reason: 'Reason',
    personalReason: false,
    useManageEarlyLeavePersonalReason: false,
    reasonId: '',
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.EarlyLeave,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
    reason: 'Reason Original',
    personalReason: true,
    useManageEarlyLeavePersonalReason: true,
    reasonId: '',
  },
  ...historyList,
};
export const earlyStartWork: EarlyStartWorkRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.EarlyStartWork,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.EarlyStartWork,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
  },
  ...historyList,
};
export const holidayWork: HolidayWorkRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.HolidayWork,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
    substituteLeaveType: 'substituteLeaveType',
    substituteDate: 'substituteDate',
    patternName: 'patternName',
    dailyRestList: [
      { restStartTime: 1, restEndTime: 2 },
      { restStartTime: 3, restEndTime: 4 },
      { restStartTime: 5, restEndTime: 6 },
      { restStartTime: 7, restEndTime: 8 },
      { restStartTime: 9, restEndTime: 10 },
    ],
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.HolidayWork,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
    substituteLeaveType: 'substituteLeaveTypeOrigin',
    substituteDate: 'substituteDateOrigin',
    patternName: 'patternName',
    dailyRestList: [
      { restStartTime: 1, restEndTime: 2 },
      { restStartTime: 3, restEndTime: 4 },
      { restStartTime: 5, restEndTime: 6 },
      { restStartTime: 7, restEndTime: 8 },
      { restStartTime: 9, restEndTime: 10 },
    ],
  },
  ...historyList,
};
export const lateArrival: LateArrivalRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.LateArrival,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
    reason: 'Reason',
    personalReason: false,
    useManageLateArrivalPersonalReason: false,
    reasonId: '',
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.LateArrival,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
    reason: 'Reason Origin',
    personalReason: true,
    useManageLateArrivalPersonalReason: true,
    reasonId: '',
  },
  ...historyList,
};
export const leave: LeaveRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.Leave,
    leaveName: 'Leave Name',
    leaveDetailName: 'Leave Detail Name',
    leaveRange: 'AM',
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
    reason: 'Reason',
    requireReason: false,
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.Leave,
    leaveName: 'Leave Name Original',
    leaveDetailName: 'Leave Detail Name Original',
    leaveRange: 'PM',
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
    reason: 'Reason Origin',
    requireReason: true,
  },
  ...historyList,
};
export const overtimeWork: OvertimeWorkRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.OvertimeWork,
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 1,
    endTime: 2,
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.OvertimeWork,
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 11,
    endTime: 12,
  },
  ...historyList,
};
export const pattern: PatternRequestDetail = {
  request: {
    ...request,
    type: REQUEST_TYPE.Pattern,
    attPatternName: 'AttPatternName',
    startDate: '2020-01-01',
    endDate: '2020-01-02',
    startTime: 11,
    endTime: 12,
    rest1StartTime: 1,
    rest1EndTime: 2,
    rest2StartTime: 3,
    rest2EndTime: 4,
    rest3StartTime: 5,
    rest3EndTime: 6,
    rest4StartTime: 7,
    rest4EndTime: 8,
    rest5StartTime: 9,
    rest5EndTime: 10,
    workSystem: 'workSystem',
    flexStartTime: 100,
    flexEndTime: 200,
    withoutCoreTime: true,
    requestDayType: null,
    isDirectInputTimeRequest: false,
  },
  originalRequest: {
    ...originalRequest,
    type: REQUEST_TYPE.Pattern,
    attPatternName: 'AttPatternNameOrigin',
    startDate: '2020-01-03',
    endDate: '2020-01-04',
    startTime: 21,
    endTime: 22,
    rest1StartTime: 31,
    rest1EndTime: 32,
    rest2StartTime: 33,
    rest2EndTime: 34,
    rest3StartTime: 35,
    rest3EndTime: 36,
    rest4StartTime: 37,
    rest4EndTime: 38,
    rest5StartTime: 39,
    rest5EndTime: 40,
    workSystem: 'workSystemOriginal',
    flexStartTime: 300,
    flexEndTime: 400,
    withoutCoreTime: false,
    requestDayType: 'Holiday',
    isDirectInputTimeRequest: false,
  },
  ...historyList,
};
export const none: NoneRequestDetail = {
  request: {
    ...request,
    type: '',
  },
  originalRequest: {
    ...originalRequest,
    type: '',
  },
  ...historyList,
};
