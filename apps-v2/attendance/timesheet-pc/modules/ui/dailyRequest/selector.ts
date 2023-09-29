import { createSelector } from 'reselect';

import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from './index';

export const targetState = createSelector(
  (s: State) => s.editing.requestTypeCode,
  (s: State) => s.requests,
  (requestTypeCode, requests) => {
    switch (requestTypeCode) {
      case CODE.Absence:
        return requests.absenceRequest;
      case CODE.Direct:
        return requests.directRequest;
      case CODE.EarlyStartWork:
        return requests.earlyStartWorkRequest;
      case CODE.HolidayWork:
        return requests.holidayWorkRequest;
      case CODE.LateArrival:
        return requests.lateArrivalRequest;
      case CODE.EarlyLeave:
        return requests.earlyLeaveRequest;
      case CODE.Leave:
        return requests.leaveRequest;
      case CODE.OvertimeWork:
        return requests.overtimeWorkRequest;
      case CODE.Pattern:
        return requests.patternRequest;
      default:
        return null;
    }
  }
);

export const targetRequest = createSelector(targetState, (state) => {
  return state ? state.request : null;
});
