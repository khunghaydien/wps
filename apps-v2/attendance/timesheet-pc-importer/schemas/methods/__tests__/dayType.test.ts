import schema from '../../schema';

import msg from '@commons/languages';

import { DAY_TYPE } from '@apps/attendance/domain/models/AttDailyRecord';
import { ContractedWorkTime } from '@attendance/domain/models/importer/ContractedWorkTime';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import { create } from '../../__tests__/helpers/validate';
import dayType from '../dayType';

describe('No Contracted Work Time', () => {
  it.each`
    startTime | appliedHolidayWorkRequest
    ${null}   | ${false}
    ${null}   | ${true}
    ${0}      | ${false}
    ${0}      | ${true}
  `('should be $expected', async ({ ...input }) => {
    const validate = create(
      schema.object({
        startTime: dayType(null),
      })
    );
    expect(await validate({ ...input, recordDate: 'recordDate' })).toEqual(
      null
    );
  });
});

describe('WorkDay', () => {
  it.each`
    startTime | appliedLeaveRequest1 | leaveRequest1Range  | expected
    ${null}   | ${false}             | ${null}             | ${{ startTime: [msg().Att_Err_NeedInputStartEndTimeAtWorkDay] }}
    ${null}   | ${true}              | ${LEAVE_RANGE.Half} | ${{ startTime: [msg().Att_Err_NeedInputStartEndTimeAtWorkDay] }}
    ${null}   | ${true}              | ${LEAVE_RANGE.Day}  | ${null}
    ${0}      | ${false}             | ${null}             | ${null}
    ${0}      | ${true}              | ${LEAVE_RANGE.Half} | ${null}
    ${0}      | ${true}              | ${LEAVE_RANGE.Day}  | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object({
        startTime: dayType({
          records: new Map([['recordDate', { dayType: DAY_TYPE.Workday }]]),
        } as unknown as ContractedWorkTime),
      })
    );
    expect(await validate({ ...input, recordDate: 'recordDate' })).toEqual(
      expected
    );
  });
});

describe('No WorkDay', () => {
  it.each`
    startTime | appliedHolidayWorkRequest | expected
    ${null}   | ${false}                  | ${null}
    ${null}   | ${true}                   | ${null}
    ${0}      | ${false}                  | ${{ startTime: [msg().Att_Err_CannotInputStartEndTimeAtHoliday] }}
    ${0}      | ${true}                   | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object({
        startTime: dayType({
          records: new Map([['recordDate', { dayType: DAY_TYPE.Holiday }]]),
        } as unknown as ContractedWorkTime),
      })
    );
    expect(await validate({ ...input, recordDate: 'recordDate' })).toEqual(
      expected
    );
  });
});
