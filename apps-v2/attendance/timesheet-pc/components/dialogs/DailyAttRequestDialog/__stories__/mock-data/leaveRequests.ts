import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import {
  convertFromBase as $createLeaveRequest,
  LeaveRequest,
} from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { Leave } from '@attendance/domain/models/Leave';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import { LEAVE_TYPE } from '@attendance/domain/models/LeaveType';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import Factory from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/Default';

const createLeaveRequest = (param: Partial<LeaveRequest>) =>
  Factory().create({
    ...$createLeaveRequest({
      ...defaultValue,
    }),
    ...param,
    leaves,
  });

const leaves = createMapByCode([
  {
    name: '年次有給休暇',
    code: 'AnnualPaidLeave',
    type: LEAVE_TYPE.Annual,
    ranges: [
      LEAVE_RANGE.Day,
      LEAVE_RANGE.AM,
      LEAVE_RANGE.PM,
      LEAVE_RANGE.Half,
      LEAVE_RANGE.Time,
    ],
    details: null,
    daysLeft: 1,
    hoursLeft: null,
    timeLeaveDaysLeft: 3.5,
    timeLeaveHoursLeft: 2,
    requireReason: false,
  },
  {
    name: '年次有給休暇（内訳あり）',
    code: 'AnnualPaidLeaveWithDetail',
    type: LEAVE_TYPE.Annual,
    ranges: [
      LEAVE_RANGE.Day,
      LEAVE_RANGE.AM,
      LEAVE_RANGE.PM,
      LEAVE_RANGE.Half,
      LEAVE_RANGE.Time,
    ],
    details: createMapByCode([
      {
        code: 'Detail1',
        name: '内訳１',
        ranges: [
          LEAVE_RANGE.Day,
          LEAVE_RANGE.AM,
          LEAVE_RANGE.PM,
          LEAVE_RANGE.Half,
          LEAVE_RANGE.Time,
        ],
      },
      {
        code: 'Detail2',
        name: '内訳２',
        ranges: [LEAVE_RANGE.AM, LEAVE_RANGE.PM, LEAVE_RANGE.Half],
      },
    ]),
    daysLeft: 1,
    hoursLeft: null,
    timeLeaveDaysLeft: 3.5,
    timeLeaveHoursLeft: 2,
    requireReason: false,
  },
  {
    name: '日数管理休暇 - 残日数ゼロ',
    code: 'DaysManagedLeave',
    type: LEAVE_TYPE.Paid,
    ranges: [
      LEAVE_RANGE.Day,
      LEAVE_RANGE.AM,
      LEAVE_RANGE.PM,
      LEAVE_RANGE.Half,
      LEAVE_RANGE.Time,
    ],
    details: null,
    daysLeft: 0,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: false,
  },
  {
    name: '欠勤 ※日数管理でない',
    code: 'Absence',
    type: LEAVE_TYPE.Unpaid,
    ranges: [LEAVE_RANGE.Day],
    details: null,
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: false,
  },
  {
    name: '欠勤 ※理由あり',
    code: 'AbsenceWithReason',
    type: LEAVE_TYPE.Unpaid,
    ranges: [LEAVE_RANGE.Day],
    details: null,
    daysLeft: null,
    hoursLeft: null,
    timeLeaveDaysLeft: null,
    timeLeaveHoursLeft: null,
    requireReason: true,
  },
] as Leave[]);

export const rangeDay = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AnnualPaidLeave',
  leaveRange: LEAVE_RANGE.Day,
});

export const rangeAM = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AnnualPaidLeave',
  leaveRange: LEAVE_RANGE.AM,
});

export const rangeHalf = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AnnualPaidLeave',
  leaveRange: LEAVE_RANGE.Half,
});

export const rangeTime = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AnnualPaidLeave',
  leaveRange: LEAVE_RANGE.Time,
});

export const daysManagedWith1 = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'DaysManagedLeave',
  leaveRange: LEAVE_RANGE.Time,
});

export const daysManagedWith0 = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'DaysManagedLeave',
  leaveRange: LEAVE_RANGE.Day,
});

export const notDaysManaged = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'Absence',
  leaveRange: LEAVE_RANGE.Day,
});

export const AbsenceWithReason = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AbsenceWithReason',
  leaveRange: LEAVE_RANGE.Day,
});

export const withDetail = createLeaveRequest({
  requestTypeCode: 'Leave',
  leaveCode: 'AnnualPaidLeaveWithDetail',
  leaveDetailCode: 'Detail2',
  leaveRange: LEAVE_RANGE.Half,
});
