import createMap from '@attendance/libraries/utils/Array/createMapByCode';

import * as Leave from '../Leave';

describe('isDaysLeftManaged()', () => {
  it('should be false if argument is null', () => {
    expect(Leave.isDaysLeftManaged(null)).toBe(false);
  });
  it.each`
    daysLeft     | expected
    ${undefined} | ${false}
    ${null}      | ${false}
    ${0}         | ${true}
    ${1}         | ${true}
  `('should be $expected', ({ expected, ...leave }) => {
    expect(Leave.isDaysLeftManaged(leave)).toBe(expected);
  });
});

describe('isTimeLeftManaged()', () => {
  it('should be false if argument is null', () => {
    expect(Leave.isTimeLeftManaged(null)).toBe(false);
  });
  it.each`
    timeLeaveDaysLeft | timeLeaveHoursLeft | expected
    ${undefined}      | ${undefined}       | ${false}
    ${null}           | ${null}            | ${false}
    ${null}           | ${0}               | ${false}
    ${0}              | ${null}            | ${false}
    ${0}              | ${0}               | ${true}
    ${1}              | ${0}               | ${true}
    ${0}              | ${1}               | ${true}
  `('should be $expected', ({ expected, ...leave }) => {
    expect(Leave.isTimeLeftManaged(leave)).toBe(expected);
  });
});

describe('getAvailableLeaveRanges()', () => {
  it('should return undefined when null', () => {
    expect(Leave.getAvailableLeaveRanges(null)).toEqual(undefined);
  });
  it.each`
    leave                                                                                                               | leaveDetailCode  | expected
    ${null}                                                                                                             | ${null}          | ${undefined}
    ${null}                                                                                                             | ${'TEST_DETAIL'} | ${undefined}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'] }}                                                                         | ${null}          | ${['A', 'B', 'C']}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'] }}                                                                         | ${'TEST_DETAIL'} | ${undefined}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMap([{ code: 'DEF' }]) }}                                  | ${'TEST_DETAIL'} | ${undefined}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMap([{ code: 'TEST_DETAIL' }]) }}                          | ${'TEST_DETAIL'} | ${undefined}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['A'] }]) }}           | ${'TEST_DETAIL'} | ${['A']}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['A', 'B', 'C'] }]) }} | ${'TEST_DETAIL'} | ${['A', 'B', 'C']}
    ${{ code: 'ABC', ranges: ['A', 'B', 'C'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['D'] }]) }}           | ${'TEST_DETAIL'} | ${['D']}
  `(
    'should get available leaveRanges',
    ({ leave, leaveDetailCode, expected }) => {
      const result = Leave.getAvailableLeaveRanges(leave, leaveDetailCode);
      expect(result).toEqual(expected);
    }
  );
});
