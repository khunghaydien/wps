import { defaultValue } from '../../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { create as createLeaveRequest } from '../../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { createFromParam as createAttLeave } from '../../../../../../domain/models/attendance/AttLeave';

export const availableLeaveTypes = [
  createAttLeave({
    name: '年次有給休暇',
    code: 'AnnualPaidLeave',
    type: 'Paid',
    ranges: ['Day', 'AM', 'PM', 'Half', 'Time'],
    daysLeft: 1,
    hoursLeft: null,
    timeLeaveDaysLeft: 3.5,
    timeLeaveHoursLeft: 2,
    isDaysLeftManaged: true,
    requireReason: false,
  }),
  createAttLeave({
    name: '日数管理休暇 - 残日数ゼロ',
    code: 'DaysManagedLeave',
    type: 'Paid',
    ranges: ['Day', 'AM', 'PM', 'Half', 'Time'],
    daysLeft: 0,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    isDaysLeftManaged: false,
    requireReason: false,
  }),
  createAttLeave({
    name: '欠勤 ※日数管理でない',
    code: 'Absence',
    type: 'Unpaid',
    ranges: ['Day'],
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    isDaysLeftManaged: false,
    requireReason: false,
  }),
];

export const rangeDay = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'AnnualPaidLeave',
    leaveRange: 'Day',
  },
  availableLeaveTypes
);

export const rangeAM = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'AnnualPaidLeave',
    leaveRange: 'AM',
  },
  availableLeaveTypes
);

export const rangeHalf = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'AnnualPaidLeave',
    leaveRange: 'Half',
  },
  availableLeaveTypes
);

export const rangeTime = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'AnnualPaidLeave',
    leaveRange: 'Time',
  },
  availableLeaveTypes
);

export const daysManagedWith1 = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'DaysManagedLeave',
    leaveRange: 'Time',
  },
  availableLeaveTypes
);

export const daysManagedWith0 = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'DaysManagedLeave',
    leaveRange: 'Day',
  },
  availableLeaveTypes
);

export const notDaysManaged = createLeaveRequest(
  {
    ...defaultValue,
    requestTypeCode: 'Leave',
    leaveCode: 'Absence',
    leaveRange: 'Day',
  },
  availableLeaveTypes
);
