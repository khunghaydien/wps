import Api from '@apps/commons/api';

import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

const remove: IObjectivelyEventLogRepository['remove'] = async (id) => {
  return Api.invoke({
    path: '/att/objectively-event-log/delete',
    param: {
      id,
    },
  });
};

export default remove;
