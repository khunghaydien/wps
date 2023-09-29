import * as DailyRecordViewModel from '..';

describe('isChecked', () => {
  it.each`
    input    | expected
    ${false} | ${false}
    ${true}  | ${true}
  `('should be $expected', ({ input, expected }) => {
    expect(
      DailyRecordViewModel.isChecked({
        checked: input,
      } as unknown as DailyRecordViewModel.DailyRecordViewModel)
    ).toBe(expected);
  });
});

describe('hasError', () => {
  it.each`
    input        | expected
    ${undefined} | ${false}
    ${null}      | ${false}
    ${''}        | ${false}
    ${'error'}   | ${true}
  `('should be $expected', ({ input, expected }) => {
    expect(
      DailyRecordViewModel.hasError({
        errors: input,
      } as unknown as DailyRecordViewModel.DailyRecordViewModel)
    ).toBe(expected);
  });
});

describe('filterForSubmitting', () => {
  it.each`
    isChecked | hasError     | expected
    ${false}  | ${undefined} | ${0}
    ${false}  | ${null}      | ${0}
    ${false}  | ${[]}        | ${0}
    ${false}  | ${['error']} | ${0}
    ${true}   | ${undefined} | ${1}
    ${true}   | ${null}      | ${1}
    ${true}   | ${[]}        | ${1}
    ${true}   | ${['error']} | ${0}
  `('should be $expected', ({ isChecked, hasError, expected }) => {
    expect(
      DailyRecordViewModel.filterForSubmitting([
        {
          checked: isChecked,
          errors: hasError,
        } as unknown as DailyRecordViewModel.DailyRecordViewModel,
      ]).length
    ).toBe(expected);
  });
});

describe('hasErrors', () => {
  it.each`
    isChecked | hasError     | expected
    ${false}  | ${undefined} | ${false}
    ${false}  | ${null}      | ${false}
    ${false}  | ${[]}        | ${false}
    ${false}  | ${['error']} | ${false}
    ${true}   | ${undefined} | ${false}
    ${true}   | ${null}      | ${false}
    ${true}   | ${[]}        | ${false}
    ${true}   | ${['error']} | ${true}
  `('should be $expected', ({ isChecked, hasError, expected }) => {
    expect(
      DailyRecordViewModel.hasErrors([
        {
          checked: isChecked,
          errors: hasError,
        } as unknown as DailyRecordViewModel.DailyRecordViewModel,
      ])
    ).toBe(expected);
  });
});

describe('hasChecked', () => {
  it.each`
    checked  | expected
    ${false} | ${false}
    ${true}  | ${true}
  `('should be $expected', ({ checked, expected }) => {
    expect(
      DailyRecordViewModel.hasChecked([
        {
          checked,
        } as unknown as DailyRecordViewModel.DailyRecordViewModel,
      ])
    ).toBe(expected);
  });
});

describe('getCheckedStartEndTime', () => {
  it.each`
    input                                                                                     | expected
    ${[]}                                                                                     | ${{ startDate: null, endDate: null }}
    ${[{ checked: true, recordDate: 'targetDate' }]}                                          | ${{ startDate: 'targetDate', endDate: 'targetDate' }}
    ${[{ checked: true, recordDate: 'startDate' }, { checked: true, recordDate: 'endDate' }]} | ${{ startDate: 'startDate', endDate: 'endDate' }}
    ${[{ checked: false, recordDate: 'targetDate' }]}                                         | ${{ startDate: null, endDate: null }}
    ${[{ checked: false, recordDate: 'none' }, { checked: true, recordDate: 'targetDate' }]}  | ${{ startDate: 'targetDate', endDate: 'targetDate' }}
  `('should be $expected', ({ input, expected }) => {
    expect(DailyRecordViewModel.getCheckedStartEndTime(input)).toEqual(
      expected
    );
  });
});

describe('getMaxDate', () => {
  it.each`
    input           | expected
    ${'2023-01-01'} | ${'2023-01-31'}
    ${'2023-02-01'} | ${'2023-02-28'}
    ${'2023-01-15'} | ${'2023-02-14'}
    ${'2023-01-31'} | ${'2023-02-27'}
  `('should be $expected', ({ input, expected }) => {
    expect(DailyRecordViewModel.getMaxDate(input)).toEqual(expected);
  });
});

describe('isRequiredLoadingLeaveRequestLeaves', () => {
  it.each`
    appliedLeaveRequest1 | leaveRequestLeaves | loadingLeaveRequestLeaves | expected
    ${false}             | ${null}            | ${false}                  | ${false}
    ${false}             | ${null}            | ${true}                   | ${false}
    ${false}             | ${[]}              | ${false}                  | ${false}
    ${false}             | ${[]}              | ${true}                   | ${false}
    ${true}              | ${null}            | ${false}                  | ${true}
    ${true}              | ${null}            | ${true}                   | ${false}
    ${true}              | ${[]}              | ${false}                  | ${false}
    ${true}              | ${[]}              | ${true}                   | ${false}
  `(
    'should be $expected when [appliedLeaveRequest1=$appliedLeaveRequest1, leaveRequestLeaves=$leaveRequestLeaves, loadingLeaveRequestLeaves=$loadingLeaveRequestLeaves]',
    async ({ expected, ...input }) => {
      expect(
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves(input)
      ).toEqual(expected);
    }
  );
});

describe('isRequiredLoadingEarlyLeaveRequestReasons', () => {
  it.each`
    appliedEarlyLeaveRequest | earlyLeaveReasons | loadingEarlyLeaveRequestReasons | expected
    ${false}                 | ${null}           | ${false}                        | ${false}
    ${false}                 | ${null}           | ${true}                         | ${false}
    ${false}                 | ${[]}             | ${false}                        | ${false}
    ${false}                 | ${[]}             | ${true}                         | ${false}
    ${true}                  | ${null}           | ${false}                        | ${true}
    ${true}                  | ${null}           | ${true}                         | ${false}
    ${true}                  | ${[]}             | ${false}                        | ${false}
    ${true}                  | ${[]}             | ${true}                         | ${false}
  `(
    'should be $expected when [appliedEarlyLeaveRequest=$appliedEarlyLeaveRequest, earlyLeaveReasons=$earlyLeaveReasons, loadingEarlyLeaveRequestReasons=$loadingEarlyLeaveRequestReasons]',
    async ({ expected, ...input }) => {
      expect(
        DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons(input)
      ).toEqual(expected);
    }
  );
});

describe('isRequiredLoadingLateArrivalRequestReasons', () => {
  it.each`
    appliedLateArrivalRequest | lateArrivalReasons | loadingLateArrivalRequestReasons | expected
    ${false}                  | ${null}            | ${false}                         | ${false}
    ${false}                  | ${null}            | ${true}                          | ${false}
    ${false}                  | ${[]}              | ${false}                         | ${false}
    ${false}                  | ${[]}              | ${true}                          | ${false}
    ${true}                   | ${null}            | ${false}                         | ${true}
    ${true}                   | ${null}            | ${true}                          | ${false}
    ${true}                   | ${[]}              | ${false}                         | ${false}
    ${true}                   | ${[]}              | ${true}                          | ${false}
  `(
    'should be $expected when [appliedLateArrivalRequest=$appliedLateArrivalRequest, lateArrivalReasons=$lateArrivalReasons, loadingLateArrivalRequestReasons=$loadingLateArrivalRequestReasons]',
    async ({ expected, ...input }) => {
      expect(
        DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons(input)
      ).toEqual(expected);
    }
  );
});

describe('isRequiredLoadingRestTimeReasons', () => {
  it.each`
    rest1StartTime | rest1EndTime | rest2StartTime | rest2EndTime | restTimeReasons | loadingRestTimeReasons | expected
    ${null}        | ${null}      | ${null}        | ${null}      | ${null}         | ${false}               | ${false}
    ${null}        | ${null}      | ${null}        | ${null}      | ${null}         | ${true}                | ${false}
    ${null}        | ${null}      | ${null}        | ${null}      | ${[]}           | ${false}               | ${false}
    ${null}        | ${null}      | ${null}        | ${null}      | ${[]}           | ${true}                | ${false}
    ${null}        | ${null}      | ${null}        | ${0}         | ${null}         | ${false}               | ${true}
    ${null}        | ${null}      | ${null}        | ${0}         | ${null}         | ${true}                | ${false}
    ${null}        | ${null}      | ${null}        | ${0}         | ${[]}           | ${false}               | ${false}
    ${null}        | ${null}      | ${null}        | ${0}         | ${[]}           | ${true}                | ${false}
    ${null}        | ${null}      | ${0}           | ${null}      | ${null}         | ${false}               | ${true}
    ${null}        | ${null}      | ${0}           | ${null}      | ${null}         | ${true}                | ${false}
    ${null}        | ${null}      | ${0}           | ${null}      | ${[]}           | ${false}               | ${false}
    ${null}        | ${null}      | ${0}           | ${null}      | ${[]}           | ${true}                | ${false}
    ${null}        | ${0}         | ${null}        | ${null}      | ${null}         | ${false}               | ${true}
    ${null}        | ${0}         | ${null}        | ${null}      | ${null}         | ${true}                | ${false}
    ${null}        | ${0}         | ${null}        | ${null}      | ${[]}           | ${false}               | ${false}
    ${null}        | ${0}         | ${null}        | ${null}      | ${[]}           | ${true}                | ${false}
    ${0}           | ${null}      | ${null}        | ${null}      | ${null}         | ${false}               | ${true}
    ${0}           | ${null}      | ${null}        | ${null}      | ${null}         | ${true}                | ${false}
    ${0}           | ${null}      | ${null}        | ${null}      | ${[]}           | ${false}               | ${false}
    ${0}           | ${null}      | ${null}        | ${null}      | ${[]}           | ${true}                | ${false}
    ${0}           | ${0}         | ${0}           | ${0}         | ${null}         | ${false}               | ${true}
    ${0}           | ${0}         | ${0}           | ${0}         | ${null}         | ${true}                | ${false}
    ${0}           | ${0}         | ${0}           | ${0}         | ${[]}           | ${false}               | ${false}
    ${0}           | ${0}         | ${0}           | ${0}         | ${[]}           | ${true}                | ${false}
  `(
    'should be $expected when [rest1StartTime=$rest1StartTime, rest1EndTime=$rest1EndTime, rest2StartTime=$rest2StartTime, rest2EndTime=$rest2EndTime, restTimeReasons=$restTimeReasons, loadingRestTimeReasons=$loadingRestTimeReasons]',
    async ({ expected, ...input }) => {
      expect(
        DailyRecordViewModel.isRequiredLoadingRestTimeReasons(input)
      ).toEqual(expected);
    }
  );
});

describe('getLabel', () => {
  it('should has all', () => {
    // Arrange
    const model = DailyRecordViewModel.create();
    const keys = Object.keys(
      model
    ) as (keyof DailyRecordViewModel.DailyRecordViewModel)[];

    // Act
    const result = keys
      .map((key) => DailyRecordViewModel.getLabel(key))
      .filter((value) => value);

    expect(new Set(result).size).toBe(
      Object.keys(DailyRecordViewModel.getLabels()).length
    );
  });
});

describe('getLabels', () => {
  it('should get labels', () => {
    const result = DailyRecordViewModel.getLabels();
    expect(result).not.toBeNull();
    expect(new Set(Object.keys(result)).size).toEqual(
      new Set(Object.values(result)).size
    );
  });
});
