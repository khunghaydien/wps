import schema from '../../schema';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { MAX_LENGTH_REASON } from '@attendance/domain/models/importer/DailyRequest/EarlyLeaveRequest';

import { create } from '../../__tests__/helpers/validate';
import earlyLeaveRequest from '../earlyLeaveRequest';

describe('appliedEarlyLeaveRequest', () => {
  const errorText = TextUtil.template(
    msg().Att_Err_NeedStartEndTime,
    msg().Att_Lbl_EarlyLeave
  );
  it.each`
    appliedEarlyLeaveRequest | startTime | endTime | expected
    ${false}                 | ${null}   | ${null} | ${null}
    ${false}                 | ${null}   | ${0}    | ${null}
    ${false}                 | ${0}      | ${null} | ${null}
    ${false}                 | ${0}      | ${0}    | ${null}
    ${true}                  | ${null}   | ${null} | ${{ appliedEarlyLeaveRequest: [errorText] }}
    ${true}                  | ${null}   | ${0}    | ${{ appliedEarlyLeaveRequest: [errorText] }}
    ${true}                  | ${0}      | ${null} | ${{ appliedEarlyLeaveRequest: [errorText] }}
    ${true}                  | ${0}      | ${0}    | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        appliedEarlyLeaveRequest: earlyLeaveRequest.appliedEarlyLeaveRequest,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('earlyLeaveRequestReasonText', () => {
  const max = TextUtil.template(
    msg().Com_Err_MaxLengthOver,
    msg().Att_Lbl_ImpHeaderEarlyLeaveRequestReason,
    MAX_LENGTH_REASON
  );
  it.each`
    appliedEarlyLeaveRequest | earlyLeaveRequestReasonText | expected
    ${false}                 | ${null}                     | ${null}
    ${false}                 | ${'T'.repeat(1)}            | ${null}
    ${false}                 | ${'T'.repeat(255)}          | ${null}
    ${false}                 | ${'T'.repeat(256)}          | ${null}
    ${true}                  | ${null}                     | ${null}
    ${true}                  | ${'T'.repeat(1)}            | ${null}
    ${true}                  | ${'T'.repeat(255)}          | ${null}
    ${true}                  | ${'T'.repeat(256)}          | ${{ earlyLeaveRequestReasonText: [max] }}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        earlyLeaveRequestReasonText:
          earlyLeaveRequest.earlyLeaveRequestReasonText,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('earlyLeaveRequestReasonCode', () => {
  it.each`
    appliedEarlyLeaveRequest | earlyLeaveRequestReasonText | earlyLeaveRequestReasonCode | expected
    ${false}                 | ${null}                     | ${null}                     | ${null}
    ${false}                 | ${null}                     | ${'CODE'}                   | ${null}
    ${false}                 | ${'reason'}                 | ${null}                     | ${null}
    ${false}                 | ${'reason'}                 | ${'CODE'}                   | ${null}
    ${true}                  | ${null}                     | ${null}                     | ${{ earlyLeaveRequestReasonCode: [msg().Att_Err_InvalidReason] }}
    ${true}                  | ${null}                     | ${'CODE'}                   | ${null}
    ${true}                  | ${'reason'}                 | ${null}                     | ${null}
    ${true}                  | ${'reason'}                 | ${'CODE'}                   | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        earlyLeaveRequestReasonCode:
          earlyLeaveRequest.earlyLeaveRequestReasonCode,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});
