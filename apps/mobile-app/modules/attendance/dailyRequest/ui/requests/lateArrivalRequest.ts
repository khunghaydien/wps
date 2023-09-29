import { AttDailyRecord } from '../../../../../../domain/models/attendance/AttDailyRecord';
import * as LateArrivalRequest from '../../../../../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';

export type State = {
  request: LateArrivalRequest.LateArrivalRequest | null;
};

const initialState: State = {
  request: null,
};

type Keys = keyof LateArrivalRequest.LateArrivalRequest;

type Values =
  LateArrivalRequest.LateArrivalRequest[keyof LateArrivalRequest.LateArrivalRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/INITIALIZE';
  payload: {
    request: LateArrivalRequest.LateArrivalRequest;
    record: AttDailyRecord | null;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: LateArrivalRequest.LateArrivalRequest,
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
        request: LateArrivalRequest.updateByAttDailyRecord(request, record),
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          request: LateArrivalRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
