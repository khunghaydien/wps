import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import AttRecord from '@attendance/timesheet-pc/models/AttRecord';

import { EditingDailyAttendanceTimeViewModel } from './Models';
import { RestTimeFactory } from './RestTimeFactory';

export default {
  createByAttRecord: (
    {
      id,
      recordDate,
      startTime,
      endTime,
      dailyRestList,
      restHours,
      otherRestReason,
      hasRestTime,
      remarks,
    }: AttRecord,
    maxRestTimesCount: number,
    dailyObjectivelyEventLog?: DailyObjectivelyEventLog | null
  ): EditingDailyAttendanceTimeViewModel => {
    const restTimes: EditingDailyAttendanceTimeViewModel['restTimes'] = [];

    dailyRestList?.forEach((rest) => {
      if (rest.restStartTime !== null || rest.restEndTime !== null) {
        restTimes.push(
          RestTimeFactory.create({
            startTime: rest.restStartTime,
            endTime: rest.restEndTime,
            restReason: rest.restReason,
          })
        );
      }
    });

    if (restTimes.length === 0) {
      restTimes.push(
        RestTimeFactory.create({
          startTime: null,
          endTime: null,
          restReason: null,
        })
      );
    }

    return {
      recordId: id,
      recordDate,
      startTime,
      endTime,
      restTimes,
      restHours,
      otherRestReason,
      hasRestTime,
      remarks: remarks || '',
      maxRestTimesCount,
      commuteCount: null,
      dailyObjectivelyEventLog: dailyObjectivelyEventLog
        ? {
            ...dailyObjectivelyEventLog,
            deviatedEnteringTimeReason: {
              ...dailyObjectivelyEventLog.deviatedEnteringTimeReason,
              text:
                dailyObjectivelyEventLog.deviatedEnteringTimeReason?.text || '',
            },
            deviatedLeavingTimeReason: {
              ...dailyObjectivelyEventLog.deviatedLeavingTimeReason,
              text:
                dailyObjectivelyEventLog.deviatedLeavingTimeReason?.text || '',
            },
          }
        : null,
    };
  },
};
