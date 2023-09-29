import { DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import schema from '../HolidayWorkRequestPageSchema';
import { create } from './helpers/errors';

const validate = create(schema);

it('return error when data is empty.', async () => {
  await expect(validate({})).rejects.toMatchSnapshot();
});

it('return error when data is null.', async () => {
  await expect(
    validate({
      startDate: null,
      startTime: null,
      endTime: null,
      substituteLeaveType: null,
      substituteDate: null,
      remarks: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      startTime: '',
      endTime: '',
      substituteLeaveType: '',
      substituteDate: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return error when substituteDate is null.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      startTime: 0,
      endTime: 0,
      substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
      substituteDate: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return true when data is not type.', async () => {
  await expect(
    validate({
      startDate: 0,
      startTime: 'abc',
      endTime: 'abc',
      substituteLeaveType: 0,
      substituteDate: 0,
      remarks: 0,
    })
  ).resolves.toBeTruthy();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      startTime: 0,
      endTime: 0,
      substituteLeaveType: 'abc',
      substituteDate: 'abc',
      remarks: 'abc',
    })
  ).resolves.toBeTruthy();
});

describe('enabledPatternApply is false', () => {
  describe.each([
    [],
    [
      {
        code: 'abc',
        workSystem: WORK_SYSTEM_TYPE.JP_Flex,
        withoutCoreTime: true,
      },
    ],
  ])('patterns is %s', (patterns) => {
    describe.each(['', 'abc', DIRECT_INPUT])(
      'patternCode is %s',
      (patternCode) => {
        describe.each(Object.values(SUBSTITUTE_LEAVE_TYPE))(
          'substituteLeaveType is %s',
          (substituteLeaveType) => {
            it.each`
              startTime | endTime | expected
              ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
              ${null}   | ${0}    | ${{ startTime: [' Required'] }}
              ${0}      | ${null} | ${{ endTime: [' Required'] }}
              ${0}      | ${0}    | ${''}
            `(
              `return $expected when [startTime=$startTime, endTime=$endTime, patternCode=$patternCode]`,
              async ({ expected, ...input }) => {
                expect(
                  await validate({
                    startDate: 'abc',
                    substituteDate: 'abc',
                    remarks: 'abc',
                    enabledPatternApply: false,
                    patterns,
                    patternCode,
                    substituteLeaveType,
                    ...input,
                  })
                    .then(() => '')
                    .catch((e) => e)
                ).toEqual(expected);
              }
            );
          }
        );
      }
    );
  });
});

describe('enabledPatternApply is true', () => {
  it.each`
    patterns                                                                           | patternCode     | substituteLeaveType                 | startTime | endTime | expected
    ${[]}                                                                              | ${'abc'}        | ${''}                               | ${null}   | ${null} | ${''}
    ${[]}                                                                              | ${'abc'}        | ${''}                               | ${null}   | ${0}    | ${''}
    ${[]}                                                                              | ${'abc'}        | ${''}                               | ${0}      | ${null} | ${''}
    ${[]}                                                                              | ${'abc'}        | ${''}                               | ${0}      | ${0}    | ${''}
    ${[]}                                                                              | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[]}                                                                              | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[]}                                                                              | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[]}                                                                              | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${0}    | ${''}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${''}                               | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${''}                               | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${''}                               | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${''}                               | ${0}      | ${0}    | ${''}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[]}                                                                              | ${DIRECT_INPUT} | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${0}    | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${''}                               | ${null}   | ${null} | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${''}                               | ${null}   | ${0}    | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${''}                               | ${0}      | ${null} | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${''}                               | ${0}      | ${0}    | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: false }]} | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${0}    | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${''}                               | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${''}                               | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${''}                               | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${''}                               | ${0}      | ${0}    | ${''}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${null} | ${{ startTime: [' Required'], endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${null}   | ${0}    | ${{ startTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${null} | ${{ endTime: [' Required'] }}
    ${[{ code: 'abc', workSystem: WORK_SYSTEM_TYPE.JP_Flex, withoutCoreTime: true }]}  | ${'abc'}        | ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${0}      | ${0}    | ${''}
  `(
    `return $expected when [patternCode=$patternCode, substituteLeaveType=$substituteLeaveType, startTime=$startTime, endTime=$endTime]`,
    async ({ expected, ...input }) => {
      expect(
        await validate({
          startDate: 'abc',
          substituteDate: 'abc',
          remarks: 'abc',
          enabledPatternApply: true,
          ...input,
        })
          .then(() => '')
          .catch((e) => e)
      ).toEqual(expected);
    }
  );
});
