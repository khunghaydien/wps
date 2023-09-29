/**
 * 日次勤務確定 ViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */
import * as Domain from '@attendance/domain/models/approval/FixDailyRequest';

import {
  AttendanceSummaryViewModel,
  convert as $convert,
} from './AttendanceSummaryViewModel';

export type FixDailyRequestViewModel =
  AttendanceSummaryViewModel<Domain.FixDailyRequest>;

export const convert = (
  request: Domain.FixDailyRequest
): FixDailyRequestViewModel => $convert(request);
