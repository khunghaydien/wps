import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  AttDailyAttention,
  CODE,
} from '@attendance/domain/models/AttDailyAttention';

export const tip = (attentions: AttDailyAttention[]): string | null => {
  const messages = alert(attentions);
  return !messages
    ? null
    : messages.length === 1
    ? messages[0]
    : msg().Att_Msg_MultipulAttentionMessage;
};

export const alert = (attentions: AttDailyAttention[]): string[] | null => {
  const messages = attentions
    .map((attention) => {
      switch (attention.code) {
        case CODE.INEFFECTIVE_WORKING_TIME:
          return TextUtil.template(
            msg().Att_Msg_NotIncludeWorkingTime,
            TimeUtil.toHHmm(attention.value.fromTime),
            TimeUtil.toHHmm(attention.value.toTime)
          );
        case CODE.INSUFFICIENT_REST_TIME:
          return TextUtil.template(
            msg().Att_Msg_InsufficientRestTime,
            attention.value
          );
        case CODE.OVER_ALLOWING_DEVIATION_TIME:
          return msg().Att_Msg_OverAllowingDeviationTime;
        case CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS:
          return TextUtil.template(
            msg().Att_Msg_OutInsufficientMinimumWorkHours,
            TimeUtil.toHHmm(attention.value)
          );
        default:
          return null;
      }
    })
    .filter((m) => m);
  return messages.length ? messages : null;
};

export const remarks = (attentions: AttDailyAttention[]): string[] | null => {
  const messages = attentions
    .map((attention) => {
      switch (attention.code) {
        case CODE.INEFFECTIVE_WORKING_TIME:
          return TextUtil.template(
            msg().Att_Msg_SummaryCommentIneffectiveWorkingTime,
            TimeUtil.toHHmm(attention.value.fromTime),
            TimeUtil.toHHmm(attention.value.toTime)
          );
        case CODE.INSUFFICIENT_REST_TIME:
          return TextUtil.template(
            msg().Att_Msg_SummaryCommentInsufficientRestTime,
            attention.value
          );
        // NOTE: 必要ならば追加してください。
        // case CODE.OverAllowingDeviationTime:
        default:
          return null;
      }
    })
    .filter((m) => m);
  return messages.length ? messages : null;
};
