import DateUtil from '../../../../../../commons/utils/DateUtil';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import Factory from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/Default';

export type State = {
  request: LeaveRequest.LeaveRequest | null;
  hasRange: boolean;
};

const initialState: State = {
  request: null,
  hasRange: false,
};

const getHasRange = (request: LeaveRequest.LeaveRequest): boolean =>
  !!request.endDate && request.startDate !== request.endDate;

type Keys = keyof LeaveRequest.LeaveRequest;

type Values = LeaveRequest.LeaveRequest[keyof LeaveRequest.LeaveRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: LeaveRequest.LeaveRequest;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type UpdateHasRange = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE_HAS_RANGE';
  payload: boolean;
};

type Action = Initialize | Update | UpdateHasRange;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE';

const UPDATE_HAS_RANGE: UpdateHasRange['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE_HAS_RANGE';

export const actions = {
  initialize: (request: LeaveRequest.LeaveRequest): Initialize => ({
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

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request } = action.payload;
      return {
        request,
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
          request: Factory().updateByKeyValue(request, key, value),
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
          request: Factory().updateByKeyValue(
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
