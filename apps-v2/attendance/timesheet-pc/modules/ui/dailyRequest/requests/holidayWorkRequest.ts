import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import * as AttPattern from '@attendance/domain/models/AttPattern';

export type State = {
  request: HolidayWorkRequest.HolidayWorkRequest | null;
  selectedAttPattern: AttPattern.AttPattern | null;
};

const initialState: State = {
  request: null,
  selectedAttPattern: null,
};

type Keys = keyof HolidayWorkRequest.HolidayWorkRequest;

type Values =
  HolidayWorkRequest.HolidayWorkRequest[keyof HolidayWorkRequest.HolidayWorkRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/HOLIDAY_WORK_REQUEST/INITIALIZE';
  payload: {
    request: HolidayWorkRequest.HolidayWorkRequest;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/HOLIDAY_WORK_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/HOLIDAY_WORK_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/HOLIDAY_WORK_REQUEST/UPDATE';

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

      const selectedAttPattern = AttPattern.getDefaultPatternCode(
        request.patterns,
        request.patternCode
      );

      return {
        ...state,
        request,
        selectedAttPattern,
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        const selectedAttPattern =
          key === 'patternCode'
            ? AttPattern.getDefaultPatternCode(request.patterns, String(value))
            : state.selectedAttPattern;
        return {
          ...state,
          request: HolidayWorkRequest.update(request, key, value),
          selectedAttPattern,
        };
      }
    }

    default:
      return state;
  }
};
