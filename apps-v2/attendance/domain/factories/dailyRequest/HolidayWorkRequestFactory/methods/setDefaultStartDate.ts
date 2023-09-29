import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';

/**
 *  開始日のデフォルト値の設定します。
 */
export default (targetDate: string | null) =>
  (request: HolidayWorkRequest.HolidayWorkRequest) => ({
    ...request,
    startDate: targetDate || null,
  });
