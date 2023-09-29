import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/EXP/RECEIPT_LIBRARY/MAX_SELECTION_COUNT/SET',
  RESET: 'MODULES/UI/EXP/RECEIPT_LIBRARY/MAX_SELECTION_COUNT/RESET',
};

export const actions = {
  set: (maxCount: number) => ({
    type: ACTIONS.SET,
    payload: maxCount,
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

const initialState = 10;

export default ((state: number = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}) as Reducer<number, any>;
