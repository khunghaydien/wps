import {
  defaultRequest,
  RequestWithPeriod,
} from '@apps/domain/models/time-tracking/RequestWithPeriod';

// State

export type State = RequestWithPeriod;

export const initialState: State = defaultRequest;

// Actions

type FetchSuccess = {
  type: 'TRACK_SUMMARY/MODULES/ENTITIES/REQUEST_LIST/FETCH_SUCCESS';
  payload: RequestWithPeriod;
};

type Action = FetchSuccess;

export const FETCH_SUCCESS =
  'TRACK_SUMMARY/MODULES/ENTITIES/REQUEST_LIST/FETCH_SUCCESS';

export const actions = {
  fetchSuccess: (payload: RequestWithPeriod): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
