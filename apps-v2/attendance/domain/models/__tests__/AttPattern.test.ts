import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import * as AttPattern from '../AttPattern';

describe('isFlexWithoutCore', () => {
  it.each`
    workSystem                  | withoutCoreTime | expected
    ${null}                     | ${false}        | ${false}
    ${WORK_SYSTEM_TYPE.JP_Fix}  | ${false}        | ${false}
    ${WORK_SYSTEM_TYPE.JP_Fix}  | ${true}         | ${false}
    ${WORK_SYSTEM_TYPE.JP_Flex} | ${false}        | ${false}
    ${WORK_SYSTEM_TYPE.JP_Flex} | ${true}         | ${true}
  `('should be $expected', ({ expected, ...input }) => {
    expect(AttPattern.isFlexWithoutCoreTime(input)).toBe(expected);
  });
});
