import Api from '@apps/commons/api';

import {
  EventType,
  IObjectivelyEventLogRepository,
} from '@attendance/domain/models/ObjectivelyEventLog';

export type Response = {
  objectivelyEventLogList: {
    id: string;
    objectivelyEventLogSettingCode: string;
    eventType: EventType;
    eventTime: number;
    importDateTime;
  }[];
};

const fetch: IObjectivelyEventLogRepository['fetch'] = async ({
  employeeId,
  targetDate,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/objectively-event-log/get',
    param: {
      empId: employeeId,
      targetDate,
    },
  });
  return response.objectivelyEventLogList.map((record) => ({
    id: record.id,
    eventType: record.eventType,
    time: record.eventTime,
    linked: record.importDateTime,
    isApplied: false,
    setting: {
      id: '',
      code: record.objectivelyEventLogSettingCode,
      name: '',
    },
  }));
};

export default fetch;
