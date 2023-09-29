import AttRecord from '../../../models/AttRecord';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { MAX_STANDARD_REST_TIME_COUNT } from '@attendance/domain/models/RestTime';

import compare from '@apps/attendance/libraries/utils/compare';

import * as DailyAttTimeViewModel from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';
import {
  DailyRecordFactory as ToDailyRecordFactory,
  Factory as DailyAttTimeViewModelFactory,
} from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';

export const convertToSaving = ToDailyRecordFactory.create;

export const convertToEditing = DailyAttTimeViewModelFactory.createByAttRecord;

export const isChange = ({
  dailyAttTime,
  attRecord,
  dailyObjectivelyEventLog,
}: {
  dailyAttTime: DailyAttTimeViewModel.EditingDailyAttendanceTimeViewModel;
  attRecord: AttRecord;
  dailyObjectivelyEventLog: DailyObjectivelyEventLog | null;
}): boolean => {
  const originalRecord = convertToSaving(
    convertToEditing(
      attRecord,
      MAX_STANDARD_REST_TIME_COUNT,
      dailyObjectivelyEventLog
    )
  );
  const record = convertToSaving(dailyAttTime);
  return !compare(record, originalRecord);
};
