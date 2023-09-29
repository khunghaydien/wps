import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import { Leave } from '@attendance/domain/models/Leave';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import leaveOptions from '../leaveOptions';

it('should convert', () => {
  expect(
    leaveOptions({
      leaves: createMapByCode([
        {
          code: 'TEST1',
          name: 'test1',
        },
        {
          code: 'TEST2',
          name: 'test2',
        },
      ] as unknown as Leave[]),
    } as unknown as LeaveRequest.LeaveRequest)
  ).toEqual([
    {
      label: 'test1',
      value: 'TEST1',
    },
    {
      label: 'test2',
      value: 'TEST2',
    },
  ]);
});

it('should convert if argument is null', () => {
  expect(leaveOptions(null)).toEqual([]);
});
