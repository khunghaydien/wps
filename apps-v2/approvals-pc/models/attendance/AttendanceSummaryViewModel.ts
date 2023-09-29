/**
 * 勤怠サマリー ViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */
import * as Domain from '@attendance/domain/models/approval/AttendanceSummary';

import {
  convert as convertDisplayFieldLayout,
  DailyRecordDisplayFieldLayoutTableViewModel,
} from './DailyRecordDisplayFieldLayoutTableViewModel';

export type DailyRecord = Domain.DailyRecord;

export type AttendanceSummaryViewModel<
  AS extends Domain.AttendanceSummary = Domain.AttendanceSummary
> = Omit<AS, 'displayFieldLayout'> & {
  displayFieldLayout: DailyRecordDisplayFieldLayoutTableViewModel;
};

export const convert = <DAS extends Domain.AttendanceSummary>(
  request: DAS
): AttendanceSummaryViewModel<DAS> => ({
  ...request,
  displayFieldLayout: request.displayFieldLayout
    ? convertDisplayFieldLayout(request.displayFieldLayout)
    : null,
});
