import { Reducer } from 'redux';

export const ACTIONS = {
  LOADING_MORE_START: 'MODULES/UI/LOADING_MORE_START',
  LOADING_MORE_END: 'MODULES/UI/LOADING_MORE_END',
};

export const modes = {
  LOADING_MORE_START: true,
  LOADING_MORE_END: false,
};

export const actions = {
  loadingMoreStart: () => ({
    type: ACTIONS.LOADING_MORE_START,
    payload: modes.LOADING_MORE_START,
  }),
  loadingMoreEnd: () => ({
    type: ACTIONS.LOADING_MORE_END,
    payload: modes.LOADING_MORE_END,
  }),
};

const initialState = modes.LOADING_MORE_END;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOADING_MORE_START:
    case ACTIONS.LOADING_MORE_END:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
