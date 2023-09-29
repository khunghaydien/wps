import Api from '@apps/commons/api';

import { IDailyObjectivelyEventLogDeviationReasonRepository } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

export type Response = {
  id: string;
  deviationReasons: {
    label: string;
    value: string;
  }[];
};

export default (async ({ employeeId, targetDate }) => {
  const response: Response = await Api.invoke({
    path: '/att/objectively-event-log/deviated-reason/list',
    param: {
      empId: employeeId,
      targetDate,
    },
  });
  return {
    employeeId,
    targetDate,
    id: response.id,
    deviationReasons: new Map(
      response.deviationReasons?.map((value) => [value.value, value]) || []
    ),
  };
}) as IDailyObjectivelyEventLogDeviationReasonRepository['fetchList'];
