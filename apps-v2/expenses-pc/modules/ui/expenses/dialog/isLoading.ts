import { Reducer } from 'redux';

export const ACTIONS = {
  TOGGLE: 'MODULES/EXPENSES/DIALOG/IS_LOADING/TOGGLE',
  CLEAR: 'MODULES/EXPENSES/DIALOG/IS_LOADING/CLEAR',
};

// for show & hide loading skeletons in dialog
export const actions = {
  toggle: (isLoading: boolean) => ({
    type: ACTIONS.TOGGLE,
    payload: isLoading,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = 0;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      if (action.payload) {
        return state + 1;
      } else {
        return Math.max(state - 1, 0);
      }
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<number, any>;
