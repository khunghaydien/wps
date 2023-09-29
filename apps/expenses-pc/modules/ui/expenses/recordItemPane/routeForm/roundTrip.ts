import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ROUND_TRIP/SET',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ROUND_TRIP/CLEAR',
};

export const actions = {
  set: (value: boolean) => ({
    type: ACTIONS.SET,
    payload: value,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = false;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
