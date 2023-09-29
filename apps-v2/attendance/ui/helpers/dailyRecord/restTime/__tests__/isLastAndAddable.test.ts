import {
  MAX_STANDARD_REST_TIME_COUNT,
  RestTimes,
} from '@attendance/domain/models/RestTime';

import isLastAndAddable from '../isLastAndAddable';

it.each`
  idx                                 | length                          | maxLength                       | expected
  ${-1}                               | ${0}                            | ${MAX_STANDARD_REST_TIME_COUNT} | ${true}
  ${0}                                | ${0}                            | ${MAX_STANDARD_REST_TIME_COUNT} | ${false}
  ${0}                                | ${1}                            | ${MAX_STANDARD_REST_TIME_COUNT} | ${true}
  ${0}                                | ${MAX_STANDARD_REST_TIME_COUNT} | ${MAX_STANDARD_REST_TIME_COUNT} | ${false}
  ${MAX_STANDARD_REST_TIME_COUNT - 1} | ${MAX_STANDARD_REST_TIME_COUNT} | ${MAX_STANDARD_REST_TIME_COUNT} | ${false}
  ${MAX_STANDARD_REST_TIME_COUNT - 1} | ${MAX_STANDARD_REST_TIME_COUNT} | ${10}                           | ${true}
  ${9}                                | ${10}                           | ${10}                           | ${false}
`(
  'should return $expected when [idx=$idx, length=$length, maxLength=$maxLength]',
  ({ idx, length, maxLength, expected }) => {
    expect(
      isLastAndAddable(idx, new Array(length) as RestTimes, maxLength)
    ).toBe(expected);
  }
);
