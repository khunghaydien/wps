import msg from '@commons/languages';
import DurationUtil from '@commons/utils/DurationUtil';

import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import leaveRangeName from '../../../leave/rangeName';
import leaveRangeOptions from '../leaveRangeOptions';

it('should convert', () => {
  expect(
    leaveRangeOptions({
      leaveCode: 'TEST1',
      leaveDetailCode: null,
      leaves: createMapByCode([
        {
          code: 'TEST1',
          name: 'test1',
          ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.Half],
        },
        {
          code: 'TEST2',
          name: 'test2',
          ranges: [LEAVE_RANGE.Day],
        },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual([
    {
      label: leaveRangeName(LEAVE_RANGE.Day),
      value: LEAVE_RANGE.Day,
    },
    {
      label: leaveRangeName(LEAVE_RANGE.Half),
      value: LEAVE_RANGE.Half,
    },
  ]);
});

it('should convert with details', () => {
  expect(
    leaveRangeOptions({
      leaveCode: 'TEST1',
      leaveDetailCode: 'TEST_DETAIL1',
      leaves: createMapByCode([
        {
          code: 'TEST1',
          name: 'test1',
          ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.Half],
          details: createMapByCode([
            {
              code: 'TEST_DETAIL1',
              name: 'test_detail1',
              ranges: [LEAVE_RANGE.Half],
            },
          ]),
        },
        {
          code: 'TEST2',
          name: 'test2',
          ranges: [LEAVE_RANGE.Day],
        },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual([
    {
      label: leaveRangeName(LEAVE_RANGE.Half),
      value: LEAVE_RANGE.Half,
    },
  ]);
});

it('should convert with TimeLeaveDaysLeft', () => {
  expect(
    leaveRangeOptions({
      leaveCode: 'TEST1',
      leaveDetailCode: null,
      leaves: createMapByCode([
        {
          code: 'TEST1',
          name: 'test1',
          ranges: [LEAVE_RANGE.Day, LEAVE_RANGE.Half, LEAVE_RANGE.Time],
          timeLeaveDaysLeft: 1,
          timeLeaveHoursLeft: 2,
        },
        {
          code: 'TEST2',
          name: 'test2',
          ranges: [LEAVE_RANGE.Day],
        },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual([
    {
      label: leaveRangeName(LEAVE_RANGE.Day),
      value: LEAVE_RANGE.Day,
    },
    {
      label: leaveRangeName(LEAVE_RANGE.Half),
      value: LEAVE_RANGE.Half,
    },
    {
      label: `${leaveRangeName(LEAVE_RANGE.Time)} (${
        msg().Att_Lbl_TimeLeaveDaysLeft
      }: ${DurationUtil.formatDaysAndHoursWithUnit(1, 2)})`,
      value: LEAVE_RANGE.Time,
    },
  ]);
});

it('should convert if argument is null', () => {
  expect(leaveRangeOptions(null)).toEqual([]);
});
