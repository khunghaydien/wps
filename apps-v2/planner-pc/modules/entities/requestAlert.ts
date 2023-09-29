import {
  defaultRequest,
  RequestWithPeriod,
} from '../../../domain/models/time-tracking/RequestWithPeriod';

// State

export type State = RequestWithPeriod;

export const initialState: State = defaultRequest;

// Actions

type FetchSuccess = {
  type: 'PLANNER-PC/MODULES/ENTITIES/REQUEST_LIST/FETCH_SUCCESS';
  payload: RequestWithPeriod;
};

type Action = FetchSuccess;

export const FETCH_SUCCESS =
  'PLANNER-PC/MODULES/ENTITIES/REQUEST_LIST/FETCH_SUCCESS';

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
