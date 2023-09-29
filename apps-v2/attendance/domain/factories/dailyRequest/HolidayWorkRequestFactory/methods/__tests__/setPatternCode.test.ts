import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { DIRECT_INPUT } from '@attendance/domain/models/AttPattern';

import method from '../setPatternCode';

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  patternCode | patterns                               | expected
  ${null}     | ${null}                                | ${DIRECT_INPUT}
  ${null}     | ${[]}                                  | ${DIRECT_INPUT}
  ${'TEST'}   | ${null}                                | ${DIRECT_INPUT}
  ${'TEST'}   | ${[]}                                  | ${DIRECT_INPUT}
  ${'TEST'}   | ${[{ code: 'ABC' }]}                   | ${DIRECT_INPUT}
  ${'TEST'}   | ${[{ code: 'ABC' }, { code: 'TEST' }]} | ${'TEST'}
`('should set patternCode', ({ patternCode, patterns, expected }) => {
  const result = method({
    patternCode,
    patterns,
  } as unknown as HolidayWorkRequest);
  expect(result.patternCode).toEqual(expected);
});
