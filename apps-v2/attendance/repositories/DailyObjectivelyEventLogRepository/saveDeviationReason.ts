import Api from '@apps/commons/api';

import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

export type Result = {
  insufficientRestTime: number | null | undefined;
};

export default (async ({
  id,
  deviatedEnteringTimeReason,
  deviatedLeavingTimeReason,
  deviationReasonExtendedItemId,
}) => {
  const response = await Api.invoke({
    path: '/att/daily-objectively-event-log/deviated-reason/update',
    param: {
      id,
      deviatedEnteringTimeReason: deviatedEnteringTimeReason.text,
      deviatedLeavingTimeReason: deviatedLeavingTimeReason.text,
      deviatedEnteringTimeReasonSelectedValue: deviatedEnteringTimeReason.value,
      deviatedEnteringTimeReasonSelectedLabel: deviatedEnteringTimeReason.label,
      deviatedLeavingTimeReasonSelectedValue: deviatedLeavingTimeReason.value,
      deviatedLeavingTimeReasonSelectedLabel: deviatedLeavingTimeReason.label,
      deviationReasonExtendedItemId:
        !deviatedEnteringTimeReason.value && !deviatedLeavingTimeReason.value
          ? ''
          : deviationReasonExtendedItemId,
    },
  });
  return response;
}) as IDailyObjectivelyEventLogRepository['saveDeviationReason'];
