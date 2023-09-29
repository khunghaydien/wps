import * as EarlyStartWorkRequest from '../../../../../../domain/models/attendance/AttDailyRequest/EarlyStartWorkRequest';

export type State = {
  request: EarlyStartWorkRequest.EarlyStartWorkRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof EarlyStartWorkRequest.EarlyStartWorkRequest;

type Values =
  EarlyStartWorkRequest.EarlyStartWorkRequest[keyof EarlyStartWorkRequest.EarlyStartWorkRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_START_WORK_REQUEST/INITIALIZE';
  payload: {
    request: EarlyStartWorkRequest.EarlyStartWorkRequest;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_START_WORK_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_START_WORK_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_START_WORK_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: EarlyStartWorkRequest.EarlyStartWorkRequest
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
          request: EarlyStartWorkRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
