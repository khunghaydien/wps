import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import method from '../setDefaultLeaveCode';

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  leaveCode | leaves                                                  | expected
  ${null}   | ${null}                                                 | ${null}
  ${null}   | ${createMapByCode([])}                                  | ${null}
  ${'TEST'} | ${null}                                                 | ${null}
  ${'TEST'} | ${createMapByCode([])}                                  | ${null}
  ${'TEST'} | ${createMapByCode([{ code: 'ABC' }])}                   | ${'ABC'}
  ${'TEST'} | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST' }])} | ${'TEST'}
`('should set default leaveCode', ({ leaveCode, leaves, expected }) => {
  const result = method({
    leaveCode,
    leaves,
  } as unknown as LeaveRequest);
  expect(result.leaveCode).toEqual(expected);
});
