import { Reducer } from 'redux';

export const ACTIONS = {
  FETCHING_LOADING_START: 'MODULES/UI/LOADING_START',
  FETCHING_LOADING_END: 'MODULES/UI/LOADING_END',
};

export const modes = {
  FETCHING_LOADING_START: true,
  FETCHING_LOADING_END: false,
};

export const actions = {
  fetchingLoadingStart: () => ({
    type: ACTIONS.FETCHING_LOADING_START,
    payload: modes.FETCHING_LOADING_START,
  }),
  fetchingLoadingEnd: () => ({
    type: ACTIONS.FETCHING_LOADING_END,
    payload: modes.FETCHING_LOADING_END,
  }),
};

const initialState = modes.FETCHING_LOADING_END;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCHING_LOADING_START:
    case ACTIONS.FETCHING_LOADING_END:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
