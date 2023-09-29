import msg from '@commons/languages';
import DurationUtil from '@commons/utils/DurationUtil';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import * as Leave from '@attendance/domain/models/Leave';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import leaveRangeName from '../../leave/rangeName';

export default (request: LeaveRequest.LeaveRequest) => {
  const leave = LeaveRequest.getLeave(request);
  const leaveRanges = LeaveRequest.getAvailableLeaveRanges(request);
  const enabledTimeLeftManaged = Leave.isTimeLeftManaged(leave);
  return (
    leaveRanges?.map((leaveRange) => {
      // 年間取得制限のある時間単位休暇の場合
      if (leaveRange === LEAVE_RANGE.Time && enabledTimeLeftManaged) {
        return {
          // 時間単位休(残り: x日 x時間)
          label: `${leaveRangeName(leaveRange)} (${
            msg().Att_Lbl_TimeLeaveDaysLeft
          }: ${DurationUtil.formatDaysAndHoursWithUnit(
            Number(leave.timeLeaveDaysLeft),
            Number(leave.timeLeaveHoursLeft)
          )})`,
          value: leaveRange,
        };
      } else {
        return {
          label: leaveRangeName(leaveRange),
          value: leaveRange,
        };
      }
    }) || []
  );
};
