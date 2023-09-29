import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import method from '../setDefaultLeaveDetailCode';

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  leaveCode | leaveDetailCode  | leaves                                                                                                       | expected
  ${null}   | ${null}          | ${null}                                                                                                      | ${null}
  ${null}   | ${null}          | ${createMapByCode([])}                                                                                       | ${null}
  ${null}   | ${'TEST_DETAIL'} | ${null}                                                                                                      | ${null}
  ${null}   | ${'TEST_DETAIL'} | ${createMapByCode([])}                                                                                       | ${null}
  ${null}   | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC', details: createMapByCode([{ code: 'EFG' }]) }])}                           | ${null}
  ${null}   | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC', details: createMapByCode([{ code: 'TEST_DETAIL' }]) }, { code: 'TEST' }])} | ${null}
  ${null}   | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST', details: createMapByCode([{ code: 'TEST_DETAIL' }]) }])} | ${null}
  ${'TEST'} | ${null}          | ${null}                                                                                                      | ${null}
  ${'TEST'} | ${null}          | ${createMapByCode([])}                                                                                       | ${null}
  ${'TEST'} | ${null}          | ${createMapByCode([{ code: 'ABC' }])}                                                                        | ${null}
  ${'TEST'} | ${null}          | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST' }])}                                                      | ${null}
  ${'TEST'} | ${null}          | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST', details: createMapByCode([{ code: 'TEST_DETAIL' }]) }])} | ${null}
  ${'TEST'} | ${'TEST_DETAIL'} | ${null}                                                                                                      | ${null}
  ${'TEST'} | ${'TEST_DETAIL'} | ${createMapByCode([])}                                                                                       | ${null}
  ${'TEST'} | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC' }])}                                                                        | ${null}
  ${'TEST'} | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST' }])}                                                      | ${null}
  ${'TEST'} | ${'TEST_DETAIL'} | ${createMapByCode([{ code: 'ABC' }, { code: 'TEST', details: createMapByCode([{ code: 'TEST_DETAIL' }]) }])} | ${'TEST_DETAIL'}
`(
  'should set default leaveDefaultCode',
  ({ leaveCode, leaveDetailCode, leaves, expected }) => {
    const result = method({
      leaveCode,
      leaveDetailCode,
      leaves,
    } as unknown as LeaveRequest);
    expect(result.leaveDetailCode).toEqual(expected);
  }
);
