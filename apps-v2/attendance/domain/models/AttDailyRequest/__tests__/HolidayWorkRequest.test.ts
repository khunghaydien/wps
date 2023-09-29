import { DIRECT_INPUT } from '../../AttPattern';
import { SUBSTITUTE_LEAVE_TYPE } from '../../SubstituteLeaveType';
import { WORK_SYSTEM_TYPE } from '../../WorkingType';
import * as HolidayWorkRequest from '../HolidayWorkRequest';

describe('getSelectedPattern', () => {
  it.each`
    patterns             | patternCode | expected
    ${null}              | ${null}     | ${undefined}
    ${[]}                | ${null}     | ${undefined}
    ${[]}                | ${'abc'}    | ${undefined}
    ${[{ code: 'abc' }]} | ${null}     | ${undefined}
    ${[{ code: 'abc' }]} | ${'abc'}    | ${{ code: 'abc' }}
  `('should return $expected', ({ expected, ...input }) => {
    expect(HolidayWorkRequest.getSelectedPattern(input)).toEqual(expected);
  });
});

describe('isUsePattern', () => {
  it.each`
    enabledPatternApply | substituteLeaveType                          | expected
    ${false}            | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${false}
    ${false}            | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${false}
    ${false}            | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${false}
    ${true}             | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${true}             | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${false}
    ${true}             | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
  `('should return $expected', ({ expected, ...input }) => {
    expect(HolidayWorkRequest.isUsePattern(input)).toBe(expected);
  });
});

describe('isUseStartTimeAndEndTime', () => {
  it.each`
    enabledPatternApply | patterns                                                                      | patternCode     | substituteLeaveType                          | expected
    ${false}            | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${false}            | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${false}            | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${false}            | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${true}             | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${true}             | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[]}                                                                         | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${true}             | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${false}
    ${true}             | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[]}                                                                         | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${false}
    ${true}             | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${true}             | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[]}                                                                         | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${null}         | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${false}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${false}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.None}                | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute}          | ${true}
    ${true}             | ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCode: true }]} | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked} | ${true}
  `('should return $expected', ({ expected, ...input }) => {
    expect(HolidayWorkRequest.isUseStartTimeAndEndTime(input)).toBe(expected);
  });
});
