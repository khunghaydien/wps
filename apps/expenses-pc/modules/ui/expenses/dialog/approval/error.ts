import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/APPROVAL/ERROR/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/APPROVAL/ERROR/CLEAR',
  CLEAR_DIALOG: 'MODULES/EXPENSES/DIALOG/CLEAR',
};

export const actions = {
  set: (errors: Record<string, any>) => ({
    type: ACTIONS.SET,
    payload: errors,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...action.payload };
    case ACTIONS.CLEAR:
    case ACTIONS.CLEAR_DIALOG:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Record<string, any>, any>;
