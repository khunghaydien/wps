import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { ObjectivelyEventLogRecord } from '@attendance/domain/models/DailyObjectivelyEventLog';

export const label = (
  settingName: string,
  record: ObjectivelyEventLogRecord,
  allowingDeviationTime: number | null
) => {
  if (!record.id) {
    // 連携がない場合
    return TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName);
  } else if (allowingDeviationTime !== null && record.deviatedTime) {
    // 乖離がある場合
    return TextUtil.template(
      msg().Att_Lbl_DeviatedTime,
      settingName,
      TimeUtil.toHHmm(record.time),
      `${Math.abs(record.deviatedTime)}`
    );
  } else {
    // それ以外
    return `${settingName} ${TimeUtil.toHHmm(record.time)}`;
  }
};
