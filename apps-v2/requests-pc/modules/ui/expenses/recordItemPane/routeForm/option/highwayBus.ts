import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/OPTION/HIGHWAY_BUS/SET',
  CLEAR:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/OPTION/HIGHWAY_BUS/CLEAR',
};

export const actions = {
  set: (value: string) => ({
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
const initialState = '0';

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
