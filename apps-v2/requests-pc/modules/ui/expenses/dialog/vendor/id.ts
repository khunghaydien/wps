import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/VENDOR/VENDOR_ID/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/VENDOR/VENDOR_ID/CLEAR',
};

export const actions = {
  set: (id: string) => ({
    type: ACTIONS.SET,
    payload: id,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
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
