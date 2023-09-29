import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import Factory from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/Default';

export type State = {
  /**
   * 申請
   */
  request: LeaveRequest.LeaveRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof LeaveRequest.LeaveRequest;

type Values = LeaveRequest.LeaveRequest[keyof LeaveRequest.LeaveRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: LeaveRequest.LeaveRequest;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/UPDATE';

export const actions = {
  initialize: (request: LeaveRequest.LeaveRequest): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
    },
  }),

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request } = action.payload;
      return {
        request,
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          request: Factory().updateByKeyValue(request, key, value),
        };
      }
    }
    default:
      return state;
  }
};
