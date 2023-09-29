import schema from '../../schema';

import { create } from '../../__tests__/helpers/validate';
import needStartEndTime from '../needStartEndTime';

const name = 'request';

it.each`
  name    | startTime | endTime | expected
  ${name} | ${null}   | ${null} | ${{ flag: ['You need input startTime and endTime when to use request.'] }}
  ${name} | ${null}   | ${0}    | ${{ flag: ['You need input startTime and endTime when to use request.'] }}
  ${name} | ${0}      | ${null} | ${{ flag: ['You need input startTime and endTime when to use request.'] }}
  ${name} | ${0}      | ${0}    | ${null}
  ${name} | ${0}      | ${1}    | ${null}
  ${name} | ${1}      | ${0}    | ${null}
`('should be $expected', async ({ expected, name, ...input }) => {
  const validate = create(
    schema.object({
      flag: needStartEndTime(name),
    })
  );
  expect(await validate({ ...input, flag: true })).toEqual(expected);
});
