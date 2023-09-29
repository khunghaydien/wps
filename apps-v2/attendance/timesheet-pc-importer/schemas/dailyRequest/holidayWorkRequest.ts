import schema from '../schema';

import { MAX_LENGTH_REMARK } from '@attendance/domain/models/importer/DailyRequest/HolidayWorkRequest';

import { startEndTime } from '../methods';
import { DailyRecordViewModel } from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const holidayWorkRequestStartTime = schema
  .mixed()
  .when('appliedHolidayWorkRequest', {
    is: true,
    then: schema.number().nullable().required(),
  });

const holidayWorkRequestEndTime = schema
  .mixed()
  .when('appliedHolidayWorkRequest', {
    is: true,
    then: schema
      .mixed()
      .required()
      .concat(
        startEndTime('holidayWorkRequestStartTime', 'holidayWorkRequestEndTime')
      ),
  });

const holidayWorkRequestRemark = schema
  .mixed()
  .when('appliedHolidayWorkRequest', {
    is: true,
    then: schema.string().nullable().max(MAX_LENGTH_REMARK),
  });

export default {
  holidayWorkRequestStartTime,
  holidayWorkRequestEndTime,
  holidayWorkRequestRemark,
} as { [key in keyof DailyRecordViewModel]: schema.AnyObjectSchema };
