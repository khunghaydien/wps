import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import schema from '../PatternRequestPageSchema';
import { create } from './helpers/errors';

const validate = create(schema);

it('return error when data is empty.', async () => {
  await expect(validate({})).rejects.toMatchSnapshot();
});

it('return error when data is null.', async () => {
  await expect(
    validate({
      startDate: null,
      endDate: null,
      patternCode: null,
      remarks: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      patternCode: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return true when data is not type.', async () => {
  await expect(
    validate({
      startDate: 0,
      endDate: 0,
      startTime: 0,
      endTime: 0,
      patternCode: 0,
      remarks: 0,
    })
  ).resolves.toBeTruthy();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      endDate: 'abc',
      startTime: 0,
      endTime: 0,
      patternCode: 'abc',
      remarks: 'abc',
    })
  ).resolves.toBeTruthy();
});

describe('startTime and endTime', () => {
  it.each`
    requestDayType      | workSystem                        | withoutCoreTime | expected
    ${DAY_TYPE.Holiday} | ${WORK_SYSTEM_TYPE.JP_Discretion} | ${false}        | ${true}
    ${DAY_TYPE.Holiday} | ${WORK_SYSTEM_TYPE.JP_Flex}       | ${false}        | ${true}
    ${DAY_TYPE.Holiday} | ${WORK_SYSTEM_TYPE.JP_Flex}       | ${true}         | ${true}
    ${DAY_TYPE.Holiday} | ${WORK_SYSTEM_TYPE.JP_Fix}        | ${true}         | ${true}
    ${DAY_TYPE.Workday} | ${WORK_SYSTEM_TYPE.JP_Discretion} | ${false}        | ${true}
    ${DAY_TYPE.Workday} | ${WORK_SYSTEM_TYPE.JP_Flex}       | ${false}        | ${false}
    ${DAY_TYPE.Workday} | ${WORK_SYSTEM_TYPE.JP_Flex}       | ${true}         | ${true}
    ${DAY_TYPE.Workday} | ${WORK_SYSTEM_TYPE.JP_Fix}        | ${false}        | ${false}
    ${DAY_TYPE.Workday} | ${WORK_SYSTEM_TYPE.JP_Fix}        | ${true}         | ${false}
  `(
    'should be $expected when [$requestDayType, $workSystem, $withoutCoreTime]',
    async ({ expected, ...param }) => {
      const result = validate({
        startDate: 'abc',
        endDate: 'abc',
        startTime: null,
        endTime: null,
        patternCode: 'abc',
        remarks: 'abc',
        ...param,
      });
      if (expected) {
        await expect(result).resolves.toBeTruthy();
      } else {
        await expect(result).rejects.toMatchSnapshot();
      }
    }
  );
});
