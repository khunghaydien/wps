import * as DomainRestTime from '@attendance/domain/models/RestTime';

import { EditingDailyAttendanceTimeViewModel } from './Models';
import { IInputData } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';

const create = (
  dailyAttTime: EditingDailyAttendanceTimeViewModel
): IInputData => ({
  recordId: dailyAttTime.recordId,
  recordDate: dailyAttTime.recordDate,
  startTime: dailyAttTime.startTime,
  endTime: dailyAttTime.endTime,
  restTimes: dailyAttTime.restTimes?.map(DomainRestTime.create),
  restHours: dailyAttTime.restHours,
  otherRestReason: dailyAttTime.otherRestReason,
  commuteCount: dailyAttTime.commuteCount || null,
  objectivelyEventLog: dailyAttTime.dailyObjectivelyEventLog || null,
  remarks: dailyAttTime.remarks || '',
});

export default {
  create,
};
