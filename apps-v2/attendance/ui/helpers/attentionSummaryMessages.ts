import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import { FixMonthlyRequest } from '@attendance/domain/models/approval/FixMonthlyRequest';

export default ({
  ineffectiveWorkingTime,
  insufficientRestTime,
}: FixMonthlyRequest['attention']): string[] | null => {
  const messages = [];
  if (ineffectiveWorkingTime) {
    messages.push(
      TextUtil.template(
        msg().Appr_Msg_FixSummaryConfirmIneffectiveWorkingTime,
        ineffectiveWorkingTime
      )
    );
  }

  if (insufficientRestTime) {
    messages.push(
      TextUtil.template(
        msg().Appr_Msg_FixSummaryConfirmInsufficientRestTime,
        insufficientRestTime
      )
    );
  }

  // NOTE: 必要であれば実装してください。
  // if (overAllowingDeviationTime)

  return messages.length ? messages : null;
};
