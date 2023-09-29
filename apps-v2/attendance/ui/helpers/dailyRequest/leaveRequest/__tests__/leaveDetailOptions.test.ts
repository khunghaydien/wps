import msg from '@commons/languages';

import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import leaveDetailOptions from '../leaveDetailOptions';

it.each([undefined, null])(
  'should return undefined if request is empty',
  (value) => {
    expect(leaveDetailOptions(value)).toEqual(undefined);
  }
);
it('should return undefined if leave is not found', () => {
  expect(
    leaveDetailOptions({
      leaveCode: 'CODE',
      leaves: createMapByCode([
        {
          code: 'CODE_TEST',
        },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual(undefined);
});

it.each([undefined, null, new Map()])(
  'should return undefined if details is empty',
  (details) => {
    expect(
      leaveDetailOptions({
        leaveCode: 'CODE',
        leaves: createMapByCode([
          {
            code: 'CODE',
            details,
          },
        ]),
      } as unknown as LeaveRequest)
    ).toEqual(undefined);
  }
);

it('should convert if details is not null', () => {
  expect(
    leaveDetailOptions({
      leaveCode: 'CODE',
      leaves: createMapByCode([
        {
          code: 'CODE',
          details: createMapByCode([
            {
              code: 'TEST1',
              name: 'test1',
            },
            {
              code: 'TEST2',
              name: 'test2',
            },
          ]),
        },
      ]),
    } as unknown as LeaveRequest)
  ).toEqual([
    {
      label: msg().Com_Lbl_None,
      value: null,
    },
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
