import schema from '../../schema';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { MAX_LENGTH_REMARK } from '@attendance/domain/models/importer/DailyRequest/HolidayWorkRequest';

import { create } from '../../__tests__/helpers/validate';
import holidayWorkRequest from '../holidayWorkRequest';

describe('holidayWorkRequestStartTime', () => {
  const txtRequired = TextUtil.template(
    msg().Com_Err_NullValue,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestStartTime
  );
  it.each`
    appliedHolidayWorkRequest | holidayWorkRequestStartTime | expected
    ${false}                  | ${null}                     | ${null}
    ${false}                  | ${0}                        | ${null}
    ${true}                   | ${null}                     | ${{ holidayWorkRequestStartTime: [txtRequired] }}
    ${true}                   | ${0}                        | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        holidayWorkRequestStartTime:
          holidayWorkRequest.holidayWorkRequestStartTime,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('holidayWorkRequestEndTime', () => {
  const txtEndTimeIsNotSet = TextUtil.template(
    msg().Com_Err_NullValue,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestEndTime
  );
  const txtLaterThanEndTime = TextUtil.template(
    msg().Com_Err_InvalidValueEarlier,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestStartTime,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestEndTime
  );
  const txtStartTimeIsNotSet = TextUtil.template(
    msg().Com_Err_NullValue,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestStartTime
  );
  it.each`
    appliedHolidayWorkRequest | holidayWorkRequestStartTime | holidayWorkRequestEndTime | expected
    ${false}                  | ${null}                     | ${null}                   | ${null}
    ${false}                  | ${null}                     | ${0}                      | ${null}
    ${false}                  | ${null}                     | ${1}                      | ${null}
    ${false}                  | ${0}                        | ${null}                   | ${null}
    ${false}                  | ${0}                        | ${0}                      | ${null}
    ${true}                   | ${null}                     | ${null}                   | ${{ holidayWorkRequestEndTime: [txtEndTimeIsNotSet] }}
    ${true}                   | ${null}                     | ${0}                      | ${null}
    ${true}                   | ${null}                     | ${1}                      | ${{ holidayWorkRequestEndTime: [txtStartTimeIsNotSet] }}
    ${true}                   | ${0}                        | ${null}                   | ${{ holidayWorkRequestEndTime: [txtEndTimeIsNotSet] }}
    ${true}                   | ${0}                        | ${0}                      | ${null}
    ${true}                   | ${0}                        | ${1}                      | ${null}
    ${true}                   | ${1}                        | ${0}                      | ${{ holidayWorkRequestEndTime: [txtLaterThanEndTime] }}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        holidayWorkRequestEndTime: holidayWorkRequest.holidayWorkRequestEndTime,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('holidayWorkRequestRemark', () => {
  const max = TextUtil.template(
    msg().Com_Err_MaxLengthOver,
    msg().Att_Lbl_ImpHeaderHolidayWorkRequestRemark,
    MAX_LENGTH_REMARK
  );
  it.each`
    appliedHolidayWorkRequest | holidayWorkRequestRemark | expected
    ${false}                  | ${null}                  | ${null}
    ${false}                  | ${'T'.repeat(1)}         | ${null}
    ${false}                  | ${'T'.repeat(255)}       | ${null}
    ${false}                  | ${'T'.repeat(256)}       | ${null}
    ${true}                   | ${null}                  | ${null}
    ${true}                   | ${'T'.repeat(1)}         | ${null}
    ${true}                   | ${'T'.repeat(255)}       | ${null}
    ${true}                   | ${'T'.repeat(256)}       | ${{ holidayWorkRequestRemark: [max] }}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        holidayWorkRequestRemark: holidayWorkRequest.holidayWorkRequestRemark,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});
