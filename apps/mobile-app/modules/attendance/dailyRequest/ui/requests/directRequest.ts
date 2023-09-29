import * as DirectRequest from '../../../../../../domain/models/attendance/AttDailyRequest/DirectRequest';
import { pushLast as restTimePushLast } from '../../../../../../domain/models/attendance/RestTime';

export type State = {
  request: DirectRequest.DirectRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof DirectRequest.DirectRequest;

type Values = DirectRequest.DirectRequest[keyof DirectRequest.DirectRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/DIRECT_REQUEST/INITIALIZE';
  payload: {
    request: DirectRequest.DirectRequest;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/DIRECT_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/DIRECT_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/DIRECT_REQUEST/UPDATE';

export const actions = {
  initialize: (request: DirectRequest.DirectRequest): Initialize => ({
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
        request: DirectRequest.update(
          request,
          'directApplyRestTimes',
          restTimePushLast(request.directApplyRestTimes)
        ),
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          request: DirectRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
