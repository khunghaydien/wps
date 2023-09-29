import {
  ACTIONS_FOR_FIX,
  FixDailyRequest,
} from '@attendance/domain/models/FixDailyRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import isEnabledSubmitting from '../isEnabledSubmitting';
import { time } from '@attendance/__tests__/helpers';

const targetDate = '2022-02-22';

const enabledWorkingType = {
  startDate: targetDate,
  endDate: targetDate,
  useFixDailyRequest: true,
} as unknown as WorkingType;

const disabledWorkingType = {
  startDate: targetDate,
  endDate: targetDate,
  useFixDailyRequest: false,
} as unknown as WorkingType;

const enabledRecord = {
  recordDate: targetDate,
  startTime: time(9, 0),
  fixDailyRequest: {
    performableActionForFix: ACTIONS_FOR_FIX.Submit,
  } as unknown as FixDailyRequest,
};

const disabledRecord = {
  recordDate: targetDate,
  startTime: time(9, 0),
  fixDailyRequest: null,
};

it.each`
  targetDate    | workingTypes             | records             | expected
  ${''}         | ${[enabledWorkingType]}  | ${[enabledRecord]}  | ${false}
  ${null}       | ${[enabledWorkingType]}  | ${[enabledRecord]}  | ${false}
  ${undefined}  | ${[enabledWorkingType]}  | ${[enabledRecord]}  | ${false}
  ${targetDate} | ${null}                  | ${[enabledRecord]}  | ${false}
  ${targetDate} | ${[]}                    | ${[enabledRecord]}  | ${false}
  ${targetDate} | ${[disabledWorkingType]} | ${[enabledRecord]}  | ${false}
  ${targetDate} | ${[enabledWorkingType]}  | ${null}             | ${false}
  ${targetDate} | ${[enabledWorkingType]}  | ${[]}               | ${false}
  ${targetDate} | ${[enabledWorkingType]}  | ${[disabledRecord]} | ${false}
  ${targetDate} | ${[enabledWorkingType]}  | ${[enabledRecord]}  | ${true}
`(
  'should be $expected when [targetDate=$targetDate, workingTypes=$workingTypes, records=$records]',
  ({ expected, ...params }) => {
    expect(isEnabledSubmitting(params)).toBe(expected);
  }
);

it('should be false if startTime is null', () => {
  expect(
    isEnabledSubmitting({
      targetDate,
      workingTypes: [enabledWorkingType],
      records: [
        {
          recordDate: targetDate,
          startTime: null,
          fixDailyRequest: {
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          } as unknown as FixDailyRequest,
        },
      ],
    })
  ).toBe(false);
});

it.each(
  Object.values(ACTIONS_FOR_FIX).filter((v) => v !== ACTIONS_FOR_FIX.Submit)
)('should be false if performableActionForFix is %s', (value) => {
  expect(
    isEnabledSubmitting({
      targetDate,
      workingTypes: [enabledWorkingType],
      records: [
        {
          recordDate: targetDate,
          startTime: time(9, 0),
          fixDailyRequest: {
            performableActionForFix: value,
          } as unknown as FixDailyRequest,
        },
      ],
    })
  ).toBe(false);
});
