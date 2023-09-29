import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import attentionSummaryMessages from '../attentionSummaryMessages';

it('should do.', () => {
  const result = attentionSummaryMessages({
    ineffectiveWorkingTime: 1,
    insufficientRestTime: 1,
  });
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual(
    TextUtil.template(msg().Appr_Msg_FixSummaryConfirmIneffectiveWorkingTime, 1)
  );
  expect(result[1]).toEqual(
    TextUtil.template(msg().Appr_Msg_FixSummaryConfirmInsufficientRestTime, 1)
  );
});

it('should do when ineffectiveWorkingTime.', () => {
  const result = attentionSummaryMessages({
    ineffectiveWorkingTime: 1,
    insufficientRestTime: 0,
  });
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(
    TextUtil.template(msg().Appr_Msg_FixSummaryConfirmIneffectiveWorkingTime, 1)
  );
});

it('should do when insufficientRestTime.', () => {
  const result = attentionSummaryMessages({
    ineffectiveWorkingTime: 0,
    insufficientRestTime: 1,
  });
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual(
    TextUtil.template(msg().Appr_Msg_FixSummaryConfirmInsufficientRestTime, 1)
  );
});
