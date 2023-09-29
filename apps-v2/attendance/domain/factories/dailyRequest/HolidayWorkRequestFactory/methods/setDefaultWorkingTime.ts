import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import {
  getWorkTimeRange,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

/**
 * デフォルトの出勤時間退勤時間
 */
export default (workingType: WorkingType | null = null) =>
  (
    request: HolidayWorkRequest.HolidayWorkRequest
  ): HolidayWorkRequest.HolidayWorkRequest => ({
    ...request,
    ...getWorkTimeRange(workingType),
  });
