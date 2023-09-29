import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';

import extractSettingFromDaily from './extractSettingFromDaily';

export default (
  records: ObjectivelyEventLog[],
  dailyRecord: DailyObjectivelyEventLog
): ObjectivelyEventLog[] => {
  const settings = extractSettingFromDaily(dailyRecord);
  const logs = dailyRecord.logs.filter((log) => log) || [];
  return records
    .map((record) => {
      const isApplied = logs.some(
        ({ entering, leaving }) =>
          entering.id === record.id || leaving.id === record.id
      );
      const setting =
        settings.find(({ code }) => record.setting.code === code) ||
        record.setting;
      return {
        ...record,
        setting,
        isApplied,
      };
    })
    .sort((a, b) => {
      const indexOfA = settings.findIndex((e) => {
        return e.code === a.setting.code;
      });
      const indexOfB = settings.findIndex((e) => {
        return e.code === b.setting.code;
      });
      if (indexOfA > indexOfB) {
        return 1;
      } else if (indexOfA < indexOfB) {
        return -1;
      }
      if (a.time > b.time) {
        return 1;
      } else if (a.time < b.time) {
        return -1;
      }
      return 0;
    });
};
