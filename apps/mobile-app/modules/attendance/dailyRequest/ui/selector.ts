import { createSelector } from 'reselect';

import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import { State } from './index';

/* eslint-disable import/prefer-default-export */

export const targetRequest = createSelector(
  (s: State) => s.detail.requestTypeCode,
  (s: State) => s.requests,
  (requestTypeCode, requests) => {
    switch (requestTypeCode) {
      case CODE.Absence:
        return requests.absenceRequest.request;
      case CODE.Direct:
        return requests.directRequest.request;
      case CODE.EarlyStartWork:
        return requests.earlyStartWorkRequest.request;
      case CODE.HolidayWork:
        return requests.holidayWorkRequest.request;
      case CODE.LateArrival:
        return requests.lateArrivalRequest.request;
      case CODE.EarlyLeave:
        return requests.earlyLeaveRequest.request;
      case CODE.Leave:
        return requests.leaveRequest.request;
      case CODE.OvertimeWork:
        return requests.overtimeWorkRequest.request;
      case CODE.Pattern:
        return requests.patternRequest.request;
      default:
        return null;
    }
  }
);
/* eslint-enable import/prefer-default-export */
