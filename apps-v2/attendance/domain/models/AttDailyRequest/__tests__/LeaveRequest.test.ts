import createMap from '@attendance/libraries/utils/Array/createMapByCode';

import { CODE } from '../../AttDailyRequestType';
import { LEAVE_RANGE } from '../../LeaveRange';
import { LEAVE_TYPE } from '../../LeaveType';
import * as Base from '../BaseAttDailyRequest';
import * as LeaveRequest from '../LeaveRequest';

describe('getLeave()', () => {
  it('should return undefined when null', () => {
    expect(LeaveRequest.getLeave(null)).toEqual(undefined);
  });
  it.each`
    leaveCode    | leaves                           | expected
    ${undefined} | ${undefined}                     | ${undefined}
    ${'test'}    | ${createMap([])}                 | ${undefined}
    ${'test'}    | ${createMap([{ code: 'aaa' }])}  | ${undefined}
    ${'test'}    | ${createMap([{ code: 'test' }])} | ${{ code: 'test' }}
  `('should return $expected', ({ expected, ...request }) => {
    expect(
      LeaveRequest.getLeave(request as unknown as LeaveRequest.LeaveRequest)
    ).toEqual(expected);
  });
});

describe('getAvailableLeaveRanges()', () => {
  it('should return undefined when null', () => {
    expect(LeaveRequest.getAvailableLeaveRanges(null)).toEqual(undefined);
  });
  it.each`
    leaveCode | leaveDetailCode  | leaves                                                                                                                              | expected
    ${null}   | ${null}          | ${null}                                                                                                                             | ${undefined}
    ${null}   | ${null}          | ${createMap([])}                                                                                                                    | ${undefined}
    ${null}   | ${'TEST_DETAIL'} | ${null}                                                                                                                             | ${undefined}
    ${null}   | ${'TEST_DETAIL'} | ${createMap([])}                                                                                                                    | ${undefined}
    ${null}   | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC', details: createMap([{ code: 'EFG' }]) }])}                                                              | ${undefined}
    ${null}   | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC', details: createMap([{ code: 'TEST_DETAIL' }]) }, { code: 'TEST' }])}                                    | ${undefined}
    ${null}   | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST', details: createMap([{ code: 'TEST_DETAIL' }]) }])}                                    | ${undefined}
    ${'TEST'} | ${null}          | ${null}                                                                                                                             | ${undefined}
    ${'TEST'} | ${null}          | ${createMap([])}                                                                                                                    | ${undefined}
    ${'TEST'} | ${null}          | ${createMap([{ code: 'ABC' }])}                                                                                                     | ${undefined}
    ${'TEST'} | ${null}          | ${createMap([{ code: 'ABC' }, { code: 'TEST' }])}                                                                                   | ${undefined}
    ${'TEST'} | ${null}          | ${createMap([{ code: 'ABC' }, { code: 'TEST', details: createMap([{ code: 'TEST_DETAIL' }]) }])}                                    | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${null}                                                                                                                             | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([])}                                                                                                                    | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }])}                                                                                                     | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST' }])}                                                                                   | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST', details: createMap([{ code: 'TEST_DETAIL' }]) }])}                                    | ${undefined}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST', ranges: ['A'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['B'] }]) }])}      | ${['B']}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST', ranges: ['A'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['A', 'B'] }]) }])} | ${['A', 'B']}
    ${'TEST'} | ${'TEST_DETAIL'} | ${createMap([{ code: 'ABC' }, { code: 'TEST', ranges: ['A', 'B'], details: createMap([{ code: 'TEST_DETAIL', ranges: ['B'] }]) }])} | ${['B']}
  `(
    'should get available leaveRanges',
    ({ leaveCode, leaveDetailCode, leaves, expected }) => {
      const result = LeaveRequest.getAvailableLeaveRanges({
        leaveCode,
        leaveDetailCode,
        leaves,
      } as unknown as LeaveRequest.LeaveRequest);
      expect(result).toEqual(expected);
    }
  );
});

describe('convertFromBase()', () => {
  it('should set type', () => {
    expect(
      LeaveRequest.convertFromBase({} as unknown as Base.BaseAttDailyRequest)
    ).toEqual({
      type: CODE.Leave,
      leaveDetailCode: null,
      leaves: createMap([
        {
          code: undefined,
          name: undefined,
          type: LEAVE_TYPE.Annual,
          ranges: [],
          details: createMap([]),
          daysLeft: null,
          hoursLeft: null,
          timeLeaveDaysLeft: null,
          timeLeaveHoursLeft: null,
          requireReason: undefined,
        },
      ]),
    });
  });
  describe('setLeaves()', () => {
    it('should set leaves', () => {
      expect(
        LeaveRequest.convertFromBase({
          leaveName: 'Leave Name',
          leaveCode: 'LEAVE_CODE',
          leaveRange: LEAVE_RANGE.Day,
          leaveType: LEAVE_TYPE.Unpaid,
          requireReason: false,
        } as unknown as Base.BaseAttDailyRequest)
      ).toEqual({
        type: CODE.Leave,
        leaveName: 'Leave Name',
        leaveCode: 'LEAVE_CODE',
        leaveRange: LEAVE_RANGE.Day,
        leaveType: LEAVE_TYPE.Unpaid,
        leaveDetailCode: null,
        requireReason: false,
        leaves: createMap([
          {
            name: 'Leave Name',
            code: 'LEAVE_CODE',
            type: LEAVE_TYPE.Unpaid,
            ranges: [LEAVE_RANGE.Day],
            details: createMap([]),
            daysLeft: null,
            hoursLeft: null,
            timeLeaveDaysLeft: null,
            timeLeaveHoursLeft: null,
            requireReason: false,
          },
        ]),
      });
    });

    describe('with details', () => {
      it('should not set details', () => {
        expect(
          LeaveRequest.convertFromBase({
            leaveDetailName: 'leave Detail Name',
            leaveDetailCode: 'LEAVE_DETAIL_CODE',
          } as unknown as Base.BaseAttDailyRequest)
        ).toEqual({
          type: CODE.Leave,
          leaveDetailName: 'leave Detail Name',
          leaveDetailCode: null,
          leaves: createMap([
            {
              name: undefined,
              code: undefined,
              type: LEAVE_TYPE.Annual,
              ranges: [],
              details: createMap([]),
              daysLeft: null,
              hoursLeft: null,
              timeLeaveDaysLeft: null,
              timeLeaveHoursLeft: null,
              requireReason: undefined,
            },
          ]),
        });
      });

      it('should set details', () => {
        expect(
          LeaveRequest.convertFromBase({
            leaveName: 'Leave Name',
            leaveCode: 'LEAVE_CODE',
            leaveRange: LEAVE_RANGE.Day,
            leaveType: LEAVE_TYPE.Unpaid,
            requireReason: false,
            leaveDetailName: 'leave Detail Name',
            leaveDetailCode: 'LEAVE_DETAIL_CODE',
          } as unknown as Base.BaseAttDailyRequest)
        ).toEqual({
          type: CODE.Leave,
          leaveName: 'Leave Name',
          leaveCode: 'LEAVE_CODE',
          leaveRange: LEAVE_RANGE.Day,
          leaveType: LEAVE_TYPE.Unpaid,
          requireReason: false,
          leaveDetailName: 'leave Detail Name',
          leaveDetailCode: 'LEAVE_DETAIL_CODE',
          leaves: createMap([
            {
              name: 'Leave Name',
              code: 'LEAVE_CODE',
              type: LEAVE_TYPE.Unpaid,
              ranges: [LEAVE_RANGE.Day],
              details: createMap([
                {
                  name: 'leave Detail Name',
                  code: 'LEAVE_DETAIL_CODE',
                  ranges: [LEAVE_RANGE.Day],
                },
              ]),
              daysLeft: null,
              hoursLeft: null,
              timeLeaveDaysLeft: null,
              timeLeaveHoursLeft: null,
              requireReason: false,
            },
          ]),
        });
      });
    });
  });
});
