/**
 * 月次勤務確定 ViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */
import * as Domain from '@attendance/domain/models/approval/FixMonthlyRequest';

import {
  AttendanceSummaryViewModel,
  convert as $convert,
} from './AttendanceSummaryViewModel';

export type FixMonthlyRequestViewModel =
  AttendanceSummaryViewModel<Domain.FixMonthlyRequest>;

export const convert = (
  request: Domain.FixMonthlyRequest
): FixMonthlyRequestViewModel => $convert(request);
