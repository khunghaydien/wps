import * as AbsenceRequest from '../../../../../../domain/models/attendance/AttDailyRequest/AbsenceRequest';

export type State = {
  request: AbsenceRequest.AbsenceRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof AbsenceRequest.AbsenceRequest;

type Values =
  AbsenceRequest.AbsenceRequest[keyof AbsenceRequest.AbsenceRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/ABSENCE_REQUEST/INITIALIZE';
  payload: {
    request: AbsenceRequest.AbsenceRequest;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/ABSENCE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/ABSENCE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/ABSENCE_REQUEST/UPDATE';

export const actions = {
  initialize: (request: AbsenceRequest.AbsenceRequest): Initialize => ({
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
          request: AbsenceRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
