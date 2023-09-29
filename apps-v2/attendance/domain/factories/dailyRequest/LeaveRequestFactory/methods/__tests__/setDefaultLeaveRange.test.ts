import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import method from '../setDefaultLeaveRange';

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  leaveCode | leaveDetailCode | leaveRange | leaves                                                                                                                               | expected
  ${null}   | ${null}         | ${null}    | ${null}                                                                                                                              | ${null}
  ${null}   | ${null}         | ${null}    | ${createMapByCode([])}                                                                                                               | ${null}
  ${null}   | ${null}         | ${null}    | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'TEST'} | ${null}         | ${null}    | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'TEST'} | ${null}         | ${'B'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'ABC'}  | ${null}         | ${null}    | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${'A'}
  ${'ABC'}  | ${null}         | ${'B'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${'B'}
  ${'ABC'}  | ${null}         | ${'D'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${'A'}
  ${'ABC'}  | ${'EFG'}        | ${null}    | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'ABC'}  | ${'EFG'}        | ${'B'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'ABC'}  | ${'EFG'}        | ${'D'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'] }])}                                                                       | ${null}
  ${'ABC'}  | ${'EFG'}        | ${null}    | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMapByCode([{ code: 'EFG', ranges: ['A', 'B', 'C'] }]) }])} | ${'A'}
  ${'ABC'}  | ${'EFG'}        | ${'B'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMapByCode([{ code: 'EFG', ranges: ['A', 'B', 'C'] }]) }])} | ${'B'}
  ${'ABC'}  | ${'EFG'}        | ${'D'}     | ${createMapByCode([{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMapByCode([{ code: 'EFG', ranges: ['A', 'B', 'C'] }]) }])} | ${'A'}
`('should set default leaveRange', ({ expected, ...request }) => {
  const result = method(request as unknown as LeaveRequest);
  expect(result.leaveRange).toEqual(expected);
});
