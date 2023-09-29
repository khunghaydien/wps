import { Reducer } from 'redux';

import { ACTIONS as ACTIVE_DIALOG_ACTIONS } from '../activeDialog';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/APPROVAL/COMMENT/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/APPROVAL/COMMENT/CLEAR',
};

export const actions = {
  set: (comment: string) => ({
    type: ACTIONS.SET,
    payload: comment,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
    case ACTIVE_DIALOG_ACTIONS.APPROVAL:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
