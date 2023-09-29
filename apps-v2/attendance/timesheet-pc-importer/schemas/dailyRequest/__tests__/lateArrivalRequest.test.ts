import schema from '../../schema';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { MAX_LENGTH_REASON } from '@attendance/domain/models/importer/DailyRequest/LateArrivalRequest';

import { create } from '../../__tests__/helpers/validate';
import lateArrivalRequest from '../lateArrivalRequest';

describe('appliedLateArrivalRequest', () => {
  const errorText = TextUtil.template(
    msg().Att_Err_NeedStartEndTime,
    msg().Att_Lbl_LateArrival
  );
  it.each`
    appliedLateArrivalRequest | startTime | endTime | expected
    ${false}                  | ${null}   | ${null} | ${null}
    ${false}                  | ${null}   | ${0}    | ${null}
    ${false}                  | ${0}      | ${null} | ${null}
    ${false}                  | ${0}      | ${0}    | ${null}
    ${true}                   | ${null}   | ${null} | ${{ appliedLateArrivalRequest: [errorText] }}
    ${true}                   | ${null}   | ${0}    | ${{ appliedLateArrivalRequest: [errorText] }}
    ${true}                   | ${0}      | ${null} | ${{ appliedLateArrivalRequest: [errorText] }}
    ${true}                   | ${0}      | ${0}    | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        appliedLateArrivalRequest: lateArrivalRequest.appliedLateArrivalRequest,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('lateArrivalRequestReasonText', () => {
  const max = TextUtil.template(
    msg().Com_Err_MaxLengthOver,
    msg().Att_Lbl_ImpHeaderLateArrivalRequestReason,
    MAX_LENGTH_REASON
  );
  it.each`
    appliedLateArrivalRequest | lateArrivalRequestReasonText | expected
    ${false}                  | ${null}                      | ${null}
    ${false}                  | ${'T'.repeat(1)}             | ${null}
    ${false}                  | ${'T'.repeat(255)}           | ${null}
    ${false}                  | ${'T'.repeat(256)}           | ${null}
    ${true}                   | ${null}                      | ${null}
    ${true}                   | ${'T'.repeat(1)}             | ${null}
    ${true}                   | ${'T'.repeat(255)}           | ${null}
    ${true}                   | ${'T'.repeat(256)}           | ${{ lateArrivalRequestReasonText: [max] }}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        lateArrivalRequestReasonText:
          lateArrivalRequest.lateArrivalRequestReasonText,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});

describe('lateArrivalRequestReasonCode', () => {
  it.each`
    appliedLateArrivalRequest | lateArrivalRequestReasonText | lateArrivalRequestReasonCode | expected
    ${false}                  | ${null}                      | ${null}                      | ${null}
    ${false}                  | ${null}                      | ${'CODE'}                    | ${null}
    ${false}                  | ${'reason'}                  | ${null}                      | ${null}
    ${false}                  | ${'reason'}                  | ${'CODE'}                    | ${null}
    ${true}                   | ${null}                      | ${null}                      | ${{ lateArrivalRequestReasonCode: [msg().Att_Err_InvalidReason] }}
    ${true}                   | ${null}                      | ${'CODE'}                    | ${null}
    ${true}                   | ${'reason'}                  | ${null}                      | ${null}
    ${true}                   | ${'reason'}                  | ${'CODE'}                    | ${null}
  `('should be $expected', async ({ expected, ...input }) => {
    const validate = create(
      schema.object().shape({
        lateArrivalRequestReasonCode:
          lateArrivalRequest.lateArrivalRequestReasonCode,
      })
    );
    expect(await validate(input)).toEqual(expected);
  });
});
