import schema from '../../schema';

import { create } from '../../__tests__/helpers/validate';
import startEndTime from '../startEndTime';

const validate = create(
  schema.object({
    endTime: schema.mixed().concat(startEndTime('startTime', 'endTime')),
  })
);

it.each`
  startTime | endTime | expected
  ${null}   | ${null} | ${null}
  ${null}   | ${0}    | ${null}
  ${null}   | ${1}    | ${{ endTime: ['Start time is not set'] }}
  ${0}      | ${null} | ${{ endTime: ['End time is not set'] }}
  ${0}      | ${0}    | ${null}
  ${0}      | ${1}    | ${null}
  ${1}      | ${0}    | ${{ endTime: ['Start time must be earlier than End time.'] }}
`('should be $expected', async ({ expected, ...input }) => {
  expect(await validate(input)).toEqual(expected);
});
