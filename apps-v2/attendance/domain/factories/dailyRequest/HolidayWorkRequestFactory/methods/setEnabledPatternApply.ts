import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

/**
 * 勤務パターンを使用するか否か
 */
export default (workingType: WorkingType | null = null) =>
  (
    request: HolidayWorkRequest.HolidayWorkRequest
  ): HolidayWorkRequest.HolidayWorkRequest => ({
    ...request,
    enabledPatternApply: !!workingType?.useHolidayWorkPatternApply,
  });
