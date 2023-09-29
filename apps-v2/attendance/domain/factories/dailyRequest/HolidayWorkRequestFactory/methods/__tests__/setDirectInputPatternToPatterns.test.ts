import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { createDirectInput } from '@attendance/domain/models/AttPattern';

import method from '../setDirectInputPatternToPatterns';

const patternName = 'Direct Input';

const directInput = createDirectInput(patternName, null);

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  patterns             | patternName          | expected
  ${null}              | ${patternName}       | ${[directInput]}
  ${[]}                | ${patternName}       | ${[directInput]}
  ${[{ code: 'ABC' }]} | ${patternName}       | ${[directInput, { code: 'ABC' }]}
  ${[{ code: 'ABC' }]} | ${() => patternName} | ${[directInput, { code: 'ABC' }]}
`(
  'should set default input pattern to patterns',
  ({ patterns, patternName, expected }) => {
    const result = method(patternName)({
      patterns,
    } as unknown as HolidayWorkRequest);
    expect(result.patterns).toEqual(expected);
  }
);
