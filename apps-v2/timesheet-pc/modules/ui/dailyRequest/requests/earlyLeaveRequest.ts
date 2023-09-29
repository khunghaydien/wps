import { AttDailyRecord } from '../../../../../domain/models/attendance/AttDailyRecord';
import * as EarlyLeaveRequest from '../../../../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';

export type State = {
  request: EarlyLeaveRequest.EarlyLeaveRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof EarlyLeaveRequest.EarlyLeaveRequest;

type Values =
  EarlyLeaveRequest.EarlyLeaveRequest[keyof EarlyLeaveRequest.EarlyLeaveRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/EARLY_LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: EarlyLeaveRequest.EarlyLeaveRequest;
    record: AttDailyRecord | null;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/EARLY_LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/EARLY_LEAVE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/EARLY_LEAVE_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: EarlyLeaveRequest.EarlyLeaveRequest,
    record: AttDailyRecord | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      record,
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
      const { request, record } = action.payload;
      return {
        request: EarlyLeaveRequest.updateByAttDailyRecord(request, record),
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
          request: EarlyLeaveRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
