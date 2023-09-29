import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import {
  // @ts-ignore
  __get__,
  CAN_NOT_USE_MANEGE_COMMUTE_COUNT,
  convert,
} from '../BaseAttendanceSummary';
import {
  defaultValue,
  recordEmpty,
  recordWorkday,
} from './mocks/BaseAttendanceSummary.mock';
import { time } from '@attendance/__tests__/helpers';

describe('recordTotal', () => {
  const recordTotalKeys = [
    'restTime',
    'realWorkTime',
    'overTime',
    'nightTime',
    'lostTime',
    'virtualWorkTime',
    'holidayWorkTime',
  ];

  it('should create record totals', () => {
    // Act
    const result = convert(defaultValue);
    const expectedKeys = Object.keys(result.recordTotal);

    // Assert
    expect(expectedKeys).toHaveLength(recordTotalKeys.length);
    recordTotalKeys.forEach((key) => {
      expect(expectedKeys).toContain(key);
    });
  });

  it.each(recordTotalKeys)('should create %s total.', ([expectedKey]) => {
    // Arrange
    const records = Array(10)
      .fill(null)
      .map((_, idx) => ({
        ...recordEmpty,
        [expectedKey]: idx + 1,
      }));

    // Act
    const result = convert({
      ...defaultValue,
      records,
    });

    // Assert
    recordTotalKeys.forEach((key) => {
      if (key === expectedKey) {
        expect(result.recordTotal[key]).toBe(55);
      } else {
        expect(result.recordTotal[key]).toBe(0);
      }
    });
  });
});

describe('attentions', () => {
  it('should create ineffectiveWorkingType attentions.', () => {
    // Act
    const result = convert({
      ...defaultValue,
      records: [
        {
          ...recordWorkday,
          recordDate: '2022-01-01',
          startTime: time(7),
          endTime: time(23),
          outStartTime: time(9),
          outEndTime: time(18),
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-02',
          startTime: time(7),
          endTime: time(9),
          outStartTime: time(9),
          outEndTime: time(9),
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-03',
        },
      ],
    });

    // Assert
    expect(result.attention.ineffectiveWorkingTime).toBe(2);
    expect(result.attention.insufficientRestTime).toBe(0);
    expect(result.records[0].attentions).toHaveLength(2);
  });
  it('should create insufficientRestTime attentions.', () => {
    // Act
    const result = convert({
      ...defaultValue,
      records: [
        {
          ...recordWorkday,
          recordDate: '2022-01-01',
          insufficientRestTime: 5,
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-02',
          insufficientRestTime: 5,
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-03',
        },
      ],
    });

    // Assert
    expect(result.attention.ineffectiveWorkingTime).toBe(0);
    expect(result.attention.insufficientRestTime).toBe(2);
    expect(result.records[0].attentions).toHaveLength(1);
  });
  it('should create all attentions.', () => {
    // Act
    const result = convert({
      ...defaultValue,
      records: [
        {
          ...recordWorkday,
          recordDate: '2022-01-01',
          startTime: time(7),
          endTime: time(23),
          outStartTime: time(9),
          outEndTime: time(18),
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-02',
          startTime: time(7),
          endTime: time(9),
          outStartTime: time(9),
          outEndTime: time(9),
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-03',
          insufficientRestTime: 5,
        },
        {
          ...recordWorkday,
          recordDate: '2022-01-04',
        },
      ],
    });

    // Assert
    expect(result.attention.ineffectiveWorkingTime).toBe(2);
    expect(result.attention.insufficientRestTime).toBe(1);
  });
});

describe('commuteCount', () => {
  it.each`
    forward                             | backward                            | state                      | expected
    ${null}                             | ${null}                             | ${COMMUTE_STATE.UNENTERED} | ${true}
    ${0}                                | ${0}                                | ${COMMUTE_STATE.NONE}      | ${true}
    ${1}                                | ${0}                                | ${COMMUTE_STATE.FORWARD}   | ${true}
    ${0}                                | ${1}                                | ${COMMUTE_STATE.BACKWARD}  | ${true}
    ${undefined}                        | ${undefined}                        | ${undefined}               | ${true}
    ${CAN_NOT_USE_MANEGE_COMMUTE_COUNT} | ${CAN_NOT_USE_MANEGE_COMMUTE_COUNT} | ${undefined}               | ${false}
  `(
    `should be useManageCommuteCount is "$expected" and state is "$state" when [commuteCountForward=$forward, commuteCountBackward=$backward]`,
    ({ forward, backward, state, expected }) => {
      // Act
      const result = convert({
        ...defaultValue,
        records: [
          {
            ...recordEmpty,
            recordDate: '2022-01-01',
            commuteCountForward: forward,
            commuteCountBackward: backward,
          },
        ],
      });

      // Assert
      expect(result.records[0].commuteState).toBe(state);
      expect(result.workingType.useManageCommuteCount).toBe(expected);
    }
  );
});

describe('isUseManageCommuteCount', () => {
  const isUseManageCommuteCount = __get__('isUseManageCommuteCount');
  it(`should be false if CommuteForwardCount and CommuteBackwardCount are 99.`, () => {
    const attRecords = [{ commuteCountForward: 99, commuteCountBackward: 99 }];
    expect(isUseManageCommuteCount(attRecords)).toBe(false);
  });
  it(`should be true if CommuteForwardCount and CommuteBackwardCount are null.`, () => {
    const attRecords = [
      { commuteCountForward: null, commuteCountBackward: null },
    ];
    expect(isUseManageCommuteCount(attRecords)).toBe(true);
  });
  it(`should be true if CommuteForwardCount and CommuteBackwardCount are 0.`, () => {
    const attRecords = [{ commuteCountForward: 0, commuteCountBackward: 0 }];
    expect(isUseManageCommuteCount(attRecords)).toBe(true);
  });
  it(`should be true if CommuteForwardCount is 1 or more and CommuteBackwardCount is 0.`, () => {
    const attRecords = [{ commuteCountForward: 1, commuteCountBackward: 0 }];
    expect(isUseManageCommuteCount(attRecords)).toBe(true);
  });
  it(`should be true if CommuteForwardCount is 0 and CommuteBackwardCount is 1 or more.`, () => {
    const attRecords = [{ commuteCountForward: 0, commuteCountBackward: 1 }];
    expect(isUseManageCommuteCount(attRecords)).toBe(true);
  });
  it(`should be true if CommuteForwardCount is 1 or more and CommuteBackwardCount 1 or more.`, () => {
    const attRecords = [{ commuteCountForward: 1, commuteCountBackward: 1 }];
    expect(isUseManageCommuteCount(attRecords)).toBe(true);
  });
});
