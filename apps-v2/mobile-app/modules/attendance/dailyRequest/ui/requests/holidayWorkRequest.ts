import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import {
  AttPattern,
  getDefaultPatternCode,
} from '@attendance/domain/models/AttPattern';

export type State = {
  request: HolidayWorkRequest.HolidayWorkRequest | null;
  selectedPattern: AttPattern | null;
};

const initialState: State = {
  request: null,
  selectedPattern: null,
};

type Keys = keyof HolidayWorkRequest.HolidayWorkRequest;

type Values =
  HolidayWorkRequest.HolidayWorkRequest[keyof HolidayWorkRequest.HolidayWorkRequest];

const ACTION_TYPE_ROOT =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/HOLIDAY_WORK_REQUEST' as const;

const ACTION_TYPE = {
  INITIALIZE: `${ACTION_TYPE_ROOT}/INITIALIZE`,
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INITIALIZE;
  payload: {
    request: HolidayWorkRequest.HolidayWorkRequest;
  };
};

type Update = {
  type: typeof ACTION_TYPE.UPDATE;
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] = ACTION_TYPE.INITIALIZE;

const UPDATE: Update['type'] = ACTION_TYPE.UPDATE;

export const actions = {
  initialize: (request: HolidayWorkRequest.HolidayWorkRequest): Initialize => ({
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
      const selectedPattern = getDefaultPatternCode(
        request.patterns,
        request.patternCode
      );
      return {
        ...state,
        request,
        selectedPattern,
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;

      if (request === null) {
        return state;
      } else {
        const selectedPattern =
          key === 'patternCode'
            ? getDefaultPatternCode(request.patterns, String(value))
            : state.selectedPattern;
        return {
          ...state,
          request: HolidayWorkRequest.update(request, key, value),
          selectedPattern,
        };
      }
    }

    default:
      return state;
  }
};
