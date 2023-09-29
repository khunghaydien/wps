import DateUtil from '../../../../../commons/utils/DateUtil';

import * as AbsenceRequest from '../../../../../domain/models/attendance/AttDailyRequest/AbsenceRequest';

export type State = {
  request: AbsenceRequest.AbsenceRequest | null;
  hasRange: boolean;
};

const initialState: State = {
  request: null,
  hasRange: false,
};

type Keys = keyof AbsenceRequest.AbsenceRequest;

type Values =
  AbsenceRequest.AbsenceRequest[keyof AbsenceRequest.AbsenceRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/INITIALIZE';
  payload: {
    request: AbsenceRequest.AbsenceRequest;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type UpdateHasRange = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/UPDATE_HAS_RANGE';
  payload: boolean;
};

type Action = Initialize | Update | UpdateHasRange;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/UPDATE';

const UPDATE_HAS_RANGE: UpdateHasRange['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/ABSENCE_REQUEST/UPDATE_HAS_RANGE';

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

  updateHasRange: (value: boolean): UpdateHasRange => ({
    type: UPDATE_HAS_RANGE,
    payload: value,
  }),
};

const getHasRange = (request: AbsenceRequest.AbsenceRequest): boolean =>
  !!request.endDate && request.startDate !== request.endDate;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request } = action.payload;
      return {
        request: { ...request },
        hasRange: getHasRange(request),
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
          request: AbsenceRequest.update(request, key, value),
        };
      }
    }

    case UPDATE_HAS_RANGE: {
      const hasRange = action.payload;
      const { request } = state;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          hasRange,
          request: AbsenceRequest.update(
            request,
            'endDate',
            hasRange
              ? DateUtil.addDays(request.startDate, 1)
              : request.startDate
          ),
        };
      }
    }

    default:
      return state;
  }
};
