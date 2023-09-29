import * as OvertimeWorkRequest from '../../../../../domain/models/attendance/AttDailyRequest/OvertimeWorkRequest';

export type State = {
  request: OvertimeWorkRequest.OvertimeWorkRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof OvertimeWorkRequest.OvertimeWorkRequest;

type Values =
  OvertimeWorkRequest.OvertimeWorkRequest[keyof OvertimeWorkRequest.OvertimeWorkRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/OVERTIME_WORK_REQUEST/INITIALIZE';
  payload: {
    request: OvertimeWorkRequest.OvertimeWorkRequest;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/OVERTIME_WORK_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/OVERTIME_WORK_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/OVERTIME_WORK_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: OvertimeWorkRequest.OvertimeWorkRequest
  ): Initialize => ({
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
        request: { ...request },
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          request: OvertimeWorkRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
