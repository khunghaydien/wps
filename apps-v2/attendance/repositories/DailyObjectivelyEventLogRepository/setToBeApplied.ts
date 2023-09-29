import Api from '@apps/commons/api';

import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

const setToBeApplied: IDailyObjectivelyEventLogRepository['setToBeApplied'] =
  async ({ id, records }) => {
    return Api.invoke({
      path: '/att/daily-objectively-event-log/event-log/update',
      param: {
        id,
        enteringEventLogId1: records[0]?.enteringId,
        leavingEventLogId1: records[0]?.leavingId,
        enteringEventLogId2: records[1]?.enteringId,
        leavingEventLogId2: records[1]?.leavingId,
        enteringEventLogId3: records[2]?.enteringId,
        leavingEventLogId3: records[2]?.leavingId,
      },
    });
  };

export default setToBeApplied;
