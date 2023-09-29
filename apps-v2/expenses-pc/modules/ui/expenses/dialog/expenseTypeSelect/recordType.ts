import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/RECORD_LIST/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/RECORD_LIST/CLEAR',
};

export const actions = {
  set: (recordType: string) => ({
    type: ACTIONS.SET,
    payload: recordType,
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
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
