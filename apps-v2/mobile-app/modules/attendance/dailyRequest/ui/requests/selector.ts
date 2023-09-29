import { createSelector } from 'reselect';

import { ORDER_OF_SUBSTITUTE_LEAVE_TYPES } from '@attendance/domain/models/SubstituteLeaveType';

import { State } from './index';
import substituteLeaveTypeName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/substituteLeaveTypeName';

export const substituteLeaveTypeOptions = createSelector(
  (s: State) => s.holidayWorkRequest.request?.substituteLeaveTypes,
  (substituteLeaveTypeList) => {
    if (!substituteLeaveTypeList) {
      return [];
    }

    return ORDER_OF_SUBSTITUTE_LEAVE_TYPES.filter((type) =>
      substituteLeaveTypeList.includes(type)
    ).map((type) => ({
      label: substituteLeaveTypeName(type),
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

export const lateArrivalReasonOptions = createSelector(
  (s: State) => s.lateArrivalRequest.lateArrivalReasonList,
  (lateArrivalReasonList) => {
    return (lateArrivalReasonList || []).map((lateArrivalReason) => ({
      label: lateArrivalReason.name,
      value: lateArrivalReason.id,
    }));
  }
);

export const earlyLeaveReasonOptions = createSelector(
  (s: State) => s.earlyLeaveRequest.earlyLeaveReasonList,
  (earlyLeaveReasonList) => {
    return (earlyLeaveReasonList || []).map((earlyLeaveReason) => ({
      label: earlyLeaveReason.name,
      value: earlyLeaveReason.id,
    }));
  }
);
