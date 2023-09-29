import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import * as LateArrivalRequest from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import {
  createFromLateArrivalRequest,
  LateArrivalReason,
} from '@attendance/domain/models/LateArrivalReason';

export type State = {
  request: LateArrivalRequest.LateArrivalRequest | null;
  lateArrivalReasonList: LateArrivalReason[];
  useLateArrivalReason: boolean;
};

const initialState: State = {
  request: null,
  lateArrivalReasonList: [],
  useLateArrivalReason: false,
};

type Keys = keyof LateArrivalRequest.LateArrivalRequest;

type Values =
  LateArrivalRequest.LateArrivalRequest[keyof LateArrivalRequest.LateArrivalRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/INITIALIZE';
  payload: {
    request: LateArrivalRequest.LateArrivalRequest;
    record: AttDailyRecord | null;
    lateArrivalReasonList: LateArrivalReason[] | null;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type SetLateArrivalReason = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/SET_USE_LATE_ARRIVAL_REASON';
  payload: {
    useLateArrivalReason: boolean;
  };
};

type Action = Initialize | Update | SetLateArrivalReason;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/INITIALIZE';

const SET_USE_LATE_ARRIVAL_REASON: SetLateArrivalReason['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/SET_USE_LATE_ARRIVAL_REASON';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LATE_ARRIVAL_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: LateArrivalRequest.LateArrivalRequest,
    record: AttDailyRecord | null = null,
    lateArrivalReasonList: LateArrivalReason[] | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      record,
      lateArrivalReasonList,
    },
  }),

  setLateArrivalReason: (
    useLateArrivalReason: boolean
  ): SetLateArrivalReason => ({
    type: SET_USE_LATE_ARRIVAL_REASON,
    payload: {
      useLateArrivalReason,
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
      const {
        request,
        record,
        lateArrivalReasonList: $lateArrivalReasonList,
      } = action.payload;
      const { useLateArrivalReason } = state;
      const lateArrivalReasonList = $lateArrivalReasonList || [
        createFromLateArrivalRequest(request),
      ];
      return {
        request: LateArrivalRequest.updateByAttDailyRecord(request, record),
        lateArrivalReasonList,
        useLateArrivalReason,
      };
    }

    case SET_USE_LATE_ARRIVAL_REASON: {
      const { useLateArrivalReason } = action.payload;
      return {
        ...state,
        useLateArrivalReason,
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
          request: LateArrivalRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
