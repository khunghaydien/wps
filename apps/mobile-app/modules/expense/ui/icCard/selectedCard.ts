import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/IC_CARD/SELECTED_CARD/SET',
  CLEAR: 'MODULES/EXPENSE/UI/IC_CARD/SELECTED_CARD/CLEAR',
};

export const actions = {
  set: (cardNo: string) => ({
    type: ACTIONS.SET,
    payload: cardNo,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
