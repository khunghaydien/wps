import { Reducer } from 'redux';

import { ACTIONS as ACTIVE_DIALOG_ACTIONS } from '../activeDialog';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/SEARCH_CONDITION/INPUTERROR/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/SEARCH_CONDITION/INPUTERROR/CLEAR',
};

export const actions = {
  set: (error: string) => ({
    type: ACTIONS.SET,
    payload: error,
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
    case ACTIVE_DIALOG_ACTIONS.SEARCH_CONDITION:
    case ACTIVE_DIALOG_ACTIONS.DELETE_SEARCH_CONDITION:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
