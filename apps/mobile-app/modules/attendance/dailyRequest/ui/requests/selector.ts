import { createSelector } from 'reselect';

import msg from '../../../../../../commons/languages';
import DurationUtil from '../../../../../../commons/utils/DurationUtil';

import {
  LEAVE_RANGE,
  ORDER_OF_RANGE_TYPES,
} from '../../../../../../domain/models/attendance/LeaveRange';
import {
  ORDER_OF_SUBSTITUTE_LEAVE_TYPES,
  SUBSTITUTE_LEAVE_TYPE,
} from '../../../../../../domain/models/attendance/SubstituteLeaveType';

import { State } from './index';

export const rangeOptions = createSelector(
  (s: State) => s.leaveRequest.request,
  (s: State) => s.leaveRequest.selectedAttLeave,
  (request, selectedAttLeave) => {
    if (request === null) {
      return [];
    }
    if (selectedAttLeave === null) {
      return [];
    }

    const RANGE_LABEL_MAP = {
      Day: () => msg().Att_Lbl_FullDayLeave,
      AM: () => msg().Att_Lbl_FirstHalfOfDayLeave,
      PM: () => msg().Att_Lbl_SecondHalfOfDayLeave,
      Half: () => msg().Att_Lbl_HalfDayLeave,
      Time: () => msg().Att_Lbl_HourlyLeave,
    };

    return ORDER_OF_RANGE_TYPES.filter((rangeType) =>
      selectedAttLeave.ranges.includes(rangeType)
    ).map((rangeKey) => {
      // 年間取得制限のある時間単位休暇の場合
      if (
        rangeKey === LEAVE_RANGE.Time &&
        selectedAttLeave.timeLeaveDaysLeft !== null &&
        selectedAttLeave.timeLeaveHoursLeft !== null
      ) {
        return {
          // 時間単位休(残り: x日 x時間)
          label: `${RANGE_LABEL_MAP[rangeKey]()} (${
            msg().Att_Lbl_TimeLeaveDaysLeft
          }: ${DurationUtil.formatDaysAndHoursWithUnit(
            Number(selectedAttLeave.timeLeaveDaysLeft),
            Number(selectedAttLeave.timeLeaveHoursLeft)
          )})`,
          value: rangeKey,
        };
      }

      return {
        label: RANGE_LABEL_MAP[rangeKey](),
        value: rangeKey,
      };
    });
  }
);

export const leaveTypeOptions = createSelector(
  (s: State) => s.leaveRequest.attLeaveList,
  (attLeaveList) => {
    return (attLeaveList || []).map((leave) => ({
      label: leave.name,
      value: leave.code,
    }));
  }
);

export const substituteLeaveTypeOptions = createSelector(
  (s: State) => s.holidayWorkRequest.substituteLeaveTypeList,
  (substituteLeaveTypeList) => {
    if (substituteLeaveTypeList === null) {
      return [];
    }

    const LABEL_MAP = {
      [SUBSTITUTE_LEAVE_TYPE.None]: () =>
        msg().Att_Lbl_DoNotUseReplacementDayOff,
      [SUBSTITUTE_LEAVE_TYPE.Substitute]: () => msg().Att_Lbl_Substitute,
      [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]: () =>
        msg().Att_Lbl_CompensatoryLeave,
    };

    return ORDER_OF_SUBSTITUTE_LEAVE_TYPES.filter((type) =>
      substituteLeaveTypeList.includes(type)
    ).map((type) => ({
      label: LABEL_MAP[type](),
      value: type,
    }));
  }
);

export const patternOptions = createSelector(
  (s: State) => s.patternRequest.attPatternList,
  (attPatternList) => {
    return (attPatternList || []).map((pattern) => ({
      label: pattern.name,
      value: pattern.code,
    }));
  }
);
