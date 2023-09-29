import DateUtil from '../../../../../../commons/utils/DateUtil';

import * as DirectRequest from '@attendance/domain/models/AttDailyRequest/DirectRequest';

import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

const createRestTimesFactory = $createRestTimesFactory();

export type State = {
  request: DirectRequest.DirectRequest | null;
  hasRange: boolean;
};

const initialState: State = {
  request: null,
  hasRange: false,
};

type Keys = keyof DirectRequest.DirectRequest;

type Values = DirectRequest.DirectRequest[keyof DirectRequest.DirectRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/INITIALIZE';
  payload: {
    request: DirectRequest.DirectRequest;
    maxRestTimesCount: number;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type UpdateHasRange = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/UPDATE_HAS_RANGE';
  payload: boolean;
};

type Action = Initialize | Update | UpdateHasRange;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/UPDATE';

const UPDATE_HAS_RANGE: UpdateHasRange['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/DIRECT_REQUEST/UPDATE_HAS_RANGE';

export const actions = {
  initialize: (
    request: DirectRequest.DirectRequest,
    maxRestTimesCount: number
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      maxRestTimesCount,
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

const getHasRange = (request: DirectRequest.DirectRequest): boolean =>
  !!request.endDate && request.startDate !== request.endDate;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request, maxRestTimesCount } = action.payload;
      const RestTimesFactory = createRestTimesFactory({
        maxLength: maxRestTimesCount,
      });
      return {
        request: DirectRequest.update(
          request,
          'directApplyRestTimes',
          RestTimesFactory.pushLast(request.directApplyRestTimes)
        ),
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
          request: DirectRequest.update(request, key, value),
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
          request: DirectRequest.update(
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
