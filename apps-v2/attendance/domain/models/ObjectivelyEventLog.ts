import { ObjectivelyEventLogRecord } from './ObjectivelyEventLogRecord';
import { ObjectivelyEventLogSetting } from './ObjectivelyEventLogSetting';

export type { EventType } from './ObjectivelyEventLogRecord';

export type ObjectivelyEventLog = {
  setting: ObjectivelyEventLogSetting;
  isApplied: boolean;
} & ObjectivelyEventLogRecord;

export type IObjectivelyEventLogRepository = {
  fetch: (parameters: {
    employeeId?: string;
    targetDate: string;
  }) => Promise<ObjectivelyEventLog[]>;
  create: (parameters: {
    employeeId: string;
    targetDate: string;
    settingCode: ObjectivelyEventLogSetting['code'];
    eventType: ObjectivelyEventLogRecord['eventType'];
    time: ObjectivelyEventLogRecord['time'];
  }) => Promise<void>;
  remove: (id: ObjectivelyEventLogRecord['id']) => Promise<void>;
};

export const apply = (
  records: ObjectivelyEventLog[],
  id: ObjectivelyEventLog['id']
): ObjectivelyEventLog[] => {
  const selected = records.find((record) => record.id === id);

  if (!selected) {
    return records;
  }

  const settingId = selected.setting.id;
  const eventType = selected.eventType;

  return records.map((record) => {
    if (record.setting.id === settingId && record.eventType === eventType) {
      return {
        ...record,
        isApplied: record.id === id,
      };
    }
    return record;
  });
};
