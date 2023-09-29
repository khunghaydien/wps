import * as DomainAttDailyRecord from '@attendance/domain/models/AttDailyRecord';
import * as DomainDailyObjectivelyEventLog from '@attendance/domain/models/DailyObjectivelyEventLog';
import * as DomainRestTime from '@attendance/domain/models/RestTime';

export type RestTime = DomainRestTime.RestTime & {
  id: string;
};

export type DailyObjectivelyEventLog =
  DomainDailyObjectivelyEventLog.DailyObjectivelyEventLog;

export type DeviationReason = DomainDailyObjectivelyEventLog.DeviationReason;

export type EditingDailyAttendanceTimeViewModel = Omit<
  DomainAttDailyRecord.DailyAttendanceTime,
  'restTimes'
> & {
  restTimes: RestTime[];
  hasRestTime: boolean;
  maxRestTimesCount: number;
  dailyObjectivelyEventLog?: DomainDailyObjectivelyEventLog.DailyObjectivelyEventLog | null;
};
