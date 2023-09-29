import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { ObjectivelyEventLogSetting } from '@attendance/domain/models/ObjectivelyEventLogSetting';

export default (
  record: DailyObjectivelyEventLog
): ObjectivelyEventLogSetting[] =>
  record.logs.filter((log) => log).map((log) => log.setting);
