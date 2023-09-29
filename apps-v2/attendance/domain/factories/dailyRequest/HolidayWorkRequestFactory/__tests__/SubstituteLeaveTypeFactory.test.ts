import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import {
  defaultValue as attDailyRequestDefaultValue,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { convertFromBase as convertHolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { CODE as REQUEST_TYPE_CODE } from '@attendance/domain/models/AttDailyRequestType';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';
import {
  defaultValue as workingTypeDefaultValue,
  WORK_SYSTEM_TYPE,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

import Factory from '../SubstituteLeaveTypesFactory';

describe('create', () => {
  test('No parameter', () => {
    const list = Factory().create();
    expect(list).toStrictEqual([SUBSTITUTE_LEAVE_TYPE.None]);
  });

  describe('With HolidayWorkRequest', () => {
    test.each`
      substituteLeaveType                 | expected
      ${null}                             | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${SUBSTITUTE_LEAVE_TYPE.None}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${[SUBSTITUTE_LEAVE_TYPE.None]}
    `(
      'substituteLeaveType: $substituteLeaveType = $expected',
      ({ substituteLeaveType, expected }) => {
        const request = convertHolidayWorkRequest({
          ...attDailyRequestDefaultValue,
          substituteLeaveType,
        });
        const list = Factory().create({ request });
        expect(list).toStrictEqual(expected);
      }
    );
  });

  describe('With WorkingType', () => {
    test.each`
      substituteLeaveTypeList               | expected
      ${[]}                                 | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${[SUBSTITUTE_LEAVE_TYPE.None]}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${[SUBSTITUTE_LEAVE_TYPE.Substitute]} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute]}
      ${['abc']}                            | ${[SUBSTITUTE_LEAVE_TYPE.None, 'abc']}
      ${['abc', 'def']}                     | ${[SUBSTITUTE_LEAVE_TYPE.None, 'abc', 'def']}
    `(
      'holidayWorkConfig.substituteLeaveType: [$substituteLeaveType] = [$expected]',
      ({ substituteLeaveTypeList, expected }) => {
        const workingType = {
          ...workingTypeDefaultValue,
          holidayWorkConfig: {
            substituteLeaveTypeList,
          },
        } as WorkingType;
        const list = Factory().create({ request: undefined, workingType });
        expect(list).toStrictEqual(expected);
      }
    );
  });

  describe('With HolidayWorkRequest and WorkingType', () => {
    test.each`
      substituteLeaveType                 | substituteLeaveTypeList               | expected
      ${null}                             | ${[]}                                 | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${null}                             | ${[SUBSTITUTE_LEAVE_TYPE.None]}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${SUBSTITUTE_LEAVE_TYPE.None}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${SUBSTITUTE_LEAVE_TYPE.None}       | ${[SUBSTITUTE_LEAVE_TYPE.Substitute]} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute]}
      ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${[SUBSTITUTE_LEAVE_TYPE.None]}       | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${SUBSTITUTE_LEAVE_TYPE.Substitute} | ${[SUBSTITUTE_LEAVE_TYPE.Substitute]} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute]}
    `(
      '\n substituteLeaveType: $substituteLeaveType \n holidayWorkConfig.substituteLeaveType: $substituteLeaveTypeList \n   = $expected',
      ({ substituteLeaveType, substituteLeaveTypeList, expected }) => {
        const request = convertHolidayWorkRequest({
          ...attDailyRequestDefaultValue,
          substituteLeaveType,
        });
        const workingType = {
          ...workingTypeDefaultValue,
          holidayWorkConfig: {
            substituteLeaveTypeList,
          },
        } as WorkingType;
        const list = Factory().create({ request, workingType });
        expect(list).toStrictEqual(expected);
      }
    );
  });

  describe('With WorkingType, dayType', () => {
    test.each`
      workingType                                                                        | dayType                  | expected
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Flex, includesHolidayWorkInPlainTime: true }}  | ${DAY_TYPE.Holiday}      | ${[SUBSTITUTE_LEAVE_TYPE.None]}
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Flex, includesHolidayWorkInPlainTime: true }}  | ${DAY_TYPE.LegalHoliday} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]}
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Flex, includesHolidayWorkInPlainTime: false }} | ${DAY_TYPE.Workday}      | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]}
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Flex, includesHolidayWorkInPlainTime: false }} | ${DAY_TYPE.LegalHoliday} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]}
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Fix, includesHolidayWorkInPlainTime: true }}   | ${DAY_TYPE.LegalHoliday} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]}
      ${{ workSystem: WORK_SYSTEM_TYPE.JP_Fix, includesHolidayWorkInPlainTime: false }}  | ${DAY_TYPE.LegalHoliday} | ${[SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]}
    `(
      '\n WorkingType: $workingType \n DayType : $dayType \n   = $expected',
      ({ workingType: $workingType, dayType, expected }) => {
        const request = convertHolidayWorkRequest({
          ...attDailyRequestDefaultValue,
        });
        const workingType = {
          ...workingTypeDefaultValue,
          ...$workingType,
          holidayWorkConfig: {
            substituteLeaveTypeList: [
              SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
            ],
          },
        } as WorkingType;
        const list = Factory().create({ request, workingType, dayType });
        expect(list).toStrictEqual(expected);
      }
    );
  });

  describe('isForReapply', () => {
    test('true', () => {
      const request = convertHolidayWorkRequest({
        ...attDailyRequestDefaultValue,
        status: STATUS.APPROVED,
        requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
      });
      const workingType = {
        ...workingTypeDefaultValue,
        holidayWorkConfig: {
          substituteLeaveTypeList: [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked],
        },
      } as WorkingType;
      const expected = [SUBSTITUTE_LEAVE_TYPE.None];
      const list = Factory().create({ request, workingType });
      expect(list).toStrictEqual(expected);
    });

    test('false', () => {
      const request = convertHolidayWorkRequest({
        ...attDailyRequestDefaultValue,
        status: STATUS.APPROVED,
        substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
        requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
      });
      const workingType = {
        ...workingTypeDefaultValue,
        holidayWorkConfig: {
          substituteLeaveTypeList: [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked],
        },
      } as WorkingType;
      const expected = [
        SUBSTITUTE_LEAVE_TYPE.None,
        SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
      ];
      const list = Factory().create({ request, workingType });
      expect(list).toStrictEqual(expected);
    });
  });
});
