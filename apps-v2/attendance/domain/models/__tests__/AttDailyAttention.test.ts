import * as DailyObjectivelyEventLog from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as AttDailyAttention from '../AttDailyAttention';
import { time } from '@attendance/__tests__/helpers';

jest.mock('../DailyObjectivelyEventLog', () => {
  const original = jest.requireActual('../DailyObjectivelyEventLog');
  return {
    ...original,
    __esModule: true,
    getAttentionTypeAtDaily: jest
      .fn()
      .mockReturnValue(original.ATTENTION_TYPE.NONE),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createAttDailyAttention()', () => {
  test('Check All', () => {
    (
      DailyObjectivelyEventLog.getAttentionTypeAtDaily as unknown as jest.Mock
    ).mockReturnValueOnce(DailyObjectivelyEventLog.ATTENTION_TYPE.ERROR);
    const record: Parameters<
      typeof AttDailyAttention['createAttDailyAttentions']
    >[0] = {
      startTime: time(7),
      endTime: time(18),
      outStartTime: time(9),
      outEndTime: time(18),
      insufficientRestTime: 100,
      outInsufficientMinimumWorkHours: 60,
      objectivelyEventLog:
        {} as unknown as DailyObjectivelyEventLog.DailyObjectivelyEventLog,
    };
    const result = AttDailyAttention.createAttDailyAttentions(record);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual({
      code: AttDailyAttention.CODE.INEFFECTIVE_WORKING_TIME,
      value: {
        fromTime: record.startTime,
        toTime: record.outStartTime,
      },
    });
    expect(result).toContainEqual({
      code: AttDailyAttention.CODE.INSUFFICIENT_REST_TIME,
      value: record.insufficientRestTime,
    });
    expect(result).toContainEqual({
      code: AttDailyAttention.CODE.OVER_ALLOWING_DEVIATION_TIME,
    });
    expect(result).toContainEqual({
      code: AttDailyAttention.CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS,
      value: record.outInsufficientMinimumWorkHours,
    });
  });

  describe('Check IneffectiveWorkingTime', () => {
    it.each`
      startTime   | endTime     | outStartTime | outEndTime  | expected                                      | describe
      ${null}     | ${null}     | ${null}      | ${null}     | ${null}                                       | ${'not working'}
      ${null}     | ${null}     | ${null}      | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${null}     | ${null}     | ${time(9)}   | ${null}     | ${null}                                       | ${'invaild data'}
      ${null}     | ${null}     | ${time(9)}   | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${null}     | ${time(18)} | ${null}      | ${null}     | ${null}                                       | ${'invaild data'}
      ${null}     | ${time(18)} | ${null}      | ${time(18)} | ${null}                                       | ${'in range'}
      ${null}     | ${time(18)} | ${time(9)}   | ${null}     | ${null}                                       | ${'invaild data'}
      ${null}     | ${time(18)} | ${time(9)}   | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${null}     | ${null}      | ${null}     | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${null}     | ${null}      | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${null}     | ${time(9)}   | ${null}     | ${null}                                       | ${'in range'}
      ${time(9)}  | ${null}     | ${time(9)}   | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${time(18)} | ${null}      | ${null}     | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${time(18)} | ${null}      | ${time(18)} | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${time(18)} | ${time(9)}   | ${null}     | ${null}                                       | ${'invaild data'}
      ${time(9)}  | ${time(18)} | ${time(9)}   | ${time(18)} | ${null}                                       | ${'in range'}
      ${time(7)}  | ${null}     | ${time(9)}   | ${null}     | ${[[time(7), time(9)]]}                       | ${'start time is  of range'}
      ${null}     | ${time(20)} | ${null}      | ${time(18)} | ${[[time(18), time(20)]]}                     | ${'end time is out of range'}
      ${time(7)}  | ${time(20)} | ${time(9)}   | ${time(18)} | ${[[time(7), time(9)], [time(18), time(20)]]} | ${'start-end time is over range'}
      ${time(7)}  | ${time(9)}  | ${time(9)}   | ${time(9)}  | ${[[time(7), time(9)]]}                       | ${'early working before range'}
      ${time(18)} | ${time(20)} | ${time(18)}  | ${time(18)} | ${[[time(18), time(20)]]}                     | ${'overtime working after range'}
    `(
      'returns $expected when [startTime = $startTime, endTime = $endTime, outStartTime = $outStartTime, outEndTime = $outEndTime] = $describe',
      ({ expected, ...record }) => {
        // Act
        const result = AttDailyAttention.createAttDailyAttentions(record);

        // Assert
        if (result.length) {
          expect(result.length).toBe(expected.length);
          result.forEach((value, idx) => {
            expect(value).toEqual({
              code: AttDailyAttention.CODE.INEFFECTIVE_WORKING_TIME,
              value: {
                fromTime: expected[idx][0],
                toTime: expected[idx][1],
              },
            });
          });
        } else {
          expect(expected).toBeNull();
        }
      }
    );
  });

  describe('Check InsufficientRestTime', () => {
    it.each`
      value        | expected
      ${100}       | ${true}
      ${0}         | ${false}
      ${null}      | ${false}
      ${undefined} | ${false}
    `('returns $expected if value is $value', ({ value, expected }) => {
      const result = AttDailyAttention.createAttDailyAttentions({
        startTime: null,
        endTime: null,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: value,
        outInsufficientMinimumWorkHours: null,
      });
      if (expected) {
        expect(result[0]).toEqual({
          code: AttDailyAttention.CODE.INSUFFICIENT_REST_TIME,
          value,
        });
      } else {
        expect(result).toHaveLength(0);
      }
    });
  });

  describe('Check OutInsufficientMinimumWorkHours', () => {
    it.each`
      value        | expected
      ${100}       | ${true}
      ${0}         | ${false}
      ${null}      | ${false}
      ${undefined} | ${false}
    `('returns $expected if value is $value', ({ value, expected }) => {
      const result = AttDailyAttention.createAttDailyAttentions({
        startTime: null,
        endTime: null,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        outInsufficientMinimumWorkHours: value,
      });
      if (expected) {
        expect(result[0]).toEqual({
          code: AttDailyAttention.CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS,
          value,
        });
      } else {
        expect(result).toHaveLength(0);
      }
    });
  });

  describe('Check OverAllowingDeviationTime', () => {
    it('should call with parameters.', () => {
      (
        DailyObjectivelyEventLog.getAttentionTypeAtDaily as unknown as jest.Mock
      ).mockReturnValue(DailyObjectivelyEventLog.ATTENTION_TYPE.ERROR);
      const base = {
        startTime: 1,
        endTime: 2,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        outInsufficientMinimumWorkHours: null,
      };
      const _ = AttDailyAttention.createAttDailyAttentions({
        ...base,
        objectivelyEventLog:
          'record' as unknown as DailyObjectivelyEventLog.DailyObjectivelyEventLog,
      });
      expect(DailyObjectivelyEventLog.getAttentionTypeAtDaily).toBeCalledTimes(
        1
      );
      expect(DailyObjectivelyEventLog.getAttentionTypeAtDaily).toBeCalledWith({
        startTime: 1,
        endTime: 2,
        dailyObjectivelyEventLog: 'record',
      });
    });
    it('should have waring if return is error.', () => {
      (
        DailyObjectivelyEventLog.getAttentionTypeAtDaily as unknown as jest.Mock
      ).mockReturnValue(DailyObjectivelyEventLog.ATTENTION_TYPE.ERROR);
      const base = {
        startTime: 1,
        endTime: 2,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        outInsufficientMinimumWorkHours: null,
      };
      const result = AttDailyAttention.createAttDailyAttentions({
        ...base,
        objectivelyEventLog:
          'record' as unknown as DailyObjectivelyEventLog.DailyObjectivelyEventLog,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        code: AttDailyAttention.CODE.OVER_ALLOWING_DEVIATION_TIME,
      });
    });
    it('should not have waring if return is warning.', () => {
      (
        DailyObjectivelyEventLog.getAttentionTypeAtDaily as unknown as jest.Mock
      ).mockReturnValue(DailyObjectivelyEventLog.ATTENTION_TYPE.WARNING);
      const base = {
        startTime: 1,
        endTime: 2,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        outInsufficientMinimumWorkHours: null,
      };
      const result = AttDailyAttention.createAttDailyAttentions({
        ...base,
        objectivelyEventLog:
          'record' as unknown as DailyObjectivelyEventLog.DailyObjectivelyEventLog,
      });
      expect(result).toHaveLength(0);
    });
    it('should not have waring if return is none.', () => {
      (
        DailyObjectivelyEventLog.getAttentionTypeAtDaily as unknown as jest.Mock
      ).mockReturnValue(DailyObjectivelyEventLog.ATTENTION_TYPE.NONE);
      const base = {
        startTime: 1,
        endTime: 2,
        outStartTime: null,
        outEndTime: null,
        insufficientRestTime: null,
        outInsufficientMinimumWorkHours: null,
      };
      const result = AttDailyAttention.createAttDailyAttentions({
        ...base,
        objectivelyEventLog:
          'record' as unknown as DailyObjectivelyEventLog.DailyObjectivelyEventLog,
      });
      expect(result).toHaveLength(0);
    });
  });
});
