import {
  Alerts,
  defaultValue,
} from '../../../domain/models/time-tracking/Alert';

// State

export type State = Alerts;

export const initialState: State = defaultValue;

// Actions

type FetchSuccess = {
  type: 'PLANNER-PC/MODULES/ENTITIES/TIMETRACKALERT/FETCH_SUCCESS';
  payload: Alerts;
};

type Action = FetchSuccess;

export const FETCH_SUCCESS =
  'PLANNER-PC/MODULES/ENTITIES/TIMETRACKALERT/FETCH_SUCCESS';

export const actions = {
  fetchSuccess: (payload: Alerts): FetchSuccess => ({
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
