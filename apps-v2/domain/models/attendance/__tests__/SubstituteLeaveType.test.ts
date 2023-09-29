import STATUS from '../../approval/request/Status';
import { DAY_TYPE, DayType } from '../AttDailyRecord';
import { defaultValue as attDailyRequestDefaultValue } from '../AttDailyRequest/BaseAttDailyRequest';
import { create as createHolidayWorkRequest } from '../AttDailyRequest/HolidayWorkRequest';
import { CODE as REQUEST_TYPE_CODE } from '../AttDailyRequestType';
import {
  create,
  SUBSTITUTE_LEAVE_TYPE,
  SubstituteLeaveType,
} from '../SubstituteLeaveType';
import {
  defaultValue as workingTypeDefaultValue,
  WORK_SYSTEM_TYPE,
  WorkingType,
  WorkSystemType,
} from '../WorkingType';

describe('domain/models/attendance/SubstituteLeaveType', () => {
  describe('create', () => {
    test('No parameter', () => {
      const list = create();
      expect(list).toStrictEqual([SUBSTITUTE_LEAVE_TYPE.None]);
    });

    describe('With HolidayWorkRequest', () => {
      test.each([
        [null, [SUBSTITUTE_LEAVE_TYPE.None]],
        [SUBSTITUTE_LEAVE_TYPE.None, [SUBSTITUTE_LEAVE_TYPE.None]],
        [
          SUBSTITUTE_LEAVE_TYPE.Substitute,
          [SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute],
        ],
      ] as [SubstituteLeaveType | null, SubstituteLeaveType[]][])(
        'substituteLeaveType: %s = [%s]',
        (substituteLeaveType, expected) => {
          const request = createHolidayWorkRequest({
            ...attDailyRequestDefaultValue,
            substituteLeaveType,
          });
          const list = create(request);
          expect(list).toStrictEqual(expected);
        }
      );
    });

    describe('With WorkingType', () => {
      test.each([
        [[], [SUBSTITUTE_LEAVE_TYPE.None]],
        [[SUBSTITUTE_LEAVE_TYPE.None], [SUBSTITUTE_LEAVE_TYPE.None]],
        [
          [SUBSTITUTE_LEAVE_TYPE.Substitute],
          [SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute],
        ],
        [['abc'], [SUBSTITUTE_LEAVE_TYPE.None, 'abc']],
        [
          ['abc', 'def'],
          [SUBSTITUTE_LEAVE_TYPE.None, 'abc', 'def'],
        ],
      ] as [string[], string[]][])(
        'holidayWorkConfig.substituteLeaveType: [%s] = [%s]',
        (substituteLeaveTypeList, expected) => {
          const workingType = {
            ...workingTypeDefaultValue,
            holidayWorkConfig: {
              substituteLeaveTypeList,
            },
          } as WorkingType;
          const list = create(undefined, workingType);
          expect(list).toStrictEqual(expected);
        }
      );
    });

    describe('With HolidayWorkRequest and WorkingType', () => {
      test.each([
        [null, [], [SUBSTITUTE_LEAVE_TYPE.None]],
        [null, [SUBSTITUTE_LEAVE_TYPE.None], [SUBSTITUTE_LEAVE_TYPE.None]],
        [
          SUBSTITUTE_LEAVE_TYPE.None,
          [SUBSTITUTE_LEAVE_TYPE.None],
          [SUBSTITUTE_LEAVE_TYPE.None],
        ],
        [
          SUBSTITUTE_LEAVE_TYPE.None,
          [SUBSTITUTE_LEAVE_TYPE.Substitute],
          [SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute],
        ],
        [
          SUBSTITUTE_LEAVE_TYPE.Substitute,
          [SUBSTITUTE_LEAVE_TYPE.None],
          [SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute],
        ],
        [
          SUBSTITUTE_LEAVE_TYPE.Substitute,
          [SUBSTITUTE_LEAVE_TYPE.Substitute],
          [SUBSTITUTE_LEAVE_TYPE.None, SUBSTITUTE_LEAVE_TYPE.Substitute],
        ],
      ] as [SubstituteLeaveType | null, string[], string[]][])(
        '\n substituteLeaveType: %s \n holidayWorkConfig.substituteLeaveType: [%s] \n   = [%s]',
        (substituteLeaveType, substituteLeaveTypeList, expected) => {
          const request = createHolidayWorkRequest({
            ...attDailyRequestDefaultValue,
            substituteLeaveType,
          });
          const workingType = {
            ...workingTypeDefaultValue,
            holidayWorkConfig: {
              substituteLeaveTypeList,
            },
          } as WorkingType;
          const list = create(request, workingType);
          expect(list).toStrictEqual(expected);
        }
      );
    });

    describe('With WorkingType, dayType', () => {
      test.each([
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Flex,
            includesHolidayWorkInPlainTime: true,
          },
          DAY_TYPE.Holiday,
          [SUBSTITUTE_LEAVE_TYPE.None],
        ],
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Flex,
            includesHolidayWorkInPlainTime: true,
          },
          DAY_TYPE.LegalHoliday,
          [
            SUBSTITUTE_LEAVE_TYPE.None,
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          ],
        ],
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Flex,
            includesHolidayWorkInPlainTime: false,
          },
          DAY_TYPE.Workday,
          [
            SUBSTITUTE_LEAVE_TYPE.None,
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          ],
        ],
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Flex,
            includesHolidayWorkInPlainTime: false,
          },
          DAY_TYPE.LegalHoliday,
          [
            SUBSTITUTE_LEAVE_TYPE.None,
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          ],
        ],
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Fix,
            includesHolidayWorkInPlainTime: true,
          },
          DAY_TYPE.LegalHoliday,
          [
            SUBSTITUTE_LEAVE_TYPE.None,
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          ],
        ],
        [
          {
            workSystem: WORK_SYSTEM_TYPE.JP_Fix,
            includesHolidayWorkInPlainTime: false,
          },
          DAY_TYPE.LegalHoliday,
          [
            SUBSTITUTE_LEAVE_TYPE.None,
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          ],
        ],
      ] as [
        {
          includesHolidayWorkInPlainTime: boolean;
          workSystem: WorkSystemType;
        },
        DayType,
        string[]
      ][])(
        '\n WorkingType: %p \n DayType : %s \n   = [%s]',
        ($workingType, dayType, expected) => {
          const request = createHolidayWorkRequest({
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
          const list = create(request, workingType, dayType);
          expect(list).toStrictEqual(expected);
        }
      );
    });

    describe('isForReapply', () => {
      test('true', () => {
        const request = createHolidayWorkRequest({
          ...attDailyRequestDefaultValue,
          status: STATUS.Approved,
          requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
        });
        const workingType = {
          ...workingTypeDefaultValue,
          holidayWorkConfig: {
            substituteLeaveTypeList: [
              SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
            ],
          },
        } as WorkingType;
        const expected = [SUBSTITUTE_LEAVE_TYPE.None];
        const list = create(request, workingType);
        expect(list).toStrictEqual(expected);
      });

      test('false', () => {
        const request = createHolidayWorkRequest({
          ...attDailyRequestDefaultValue,
          status: STATUS.Approved,
          substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
          requestTypeCode: REQUEST_TYPE_CODE.HolidayWork,
        });
        const workingType = {
          ...workingTypeDefaultValue,
          holidayWorkConfig: {
            substituteLeaveTypeList: [
              SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
            ],
          },
        } as WorkingType;
        const expected = [
          SUBSTITUTE_LEAVE_TYPE.None,
          SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
        ];
        const list = create(request, workingType);
        expect(list).toStrictEqual(expected);
      });
    });
  });
});
