import Api from '@apps/commons/api';

import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

const create: IObjectivelyEventLogRepository['create'] = async ({
  employeeId,
  targetDate,
  settingCode,
  eventType,
  time,
}) => {
  return Api.invoke({
    path: '/att/objectively-event-log/create',
    param: {
      empId: employeeId,
      targetDate,
      objectivelyEventLogSettingCode: settingCode,
      eventType,
      eventTime: time,
    },
  });
};

export default create;
