import { Reducer } from 'redux';

import { StationInfo } from '../../../../../../domain/models/exp/jorudan/Station';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ARRIVAL/SET',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ARRIVAL/CLEAR',
};

export const actions = {
  set: (station?: StationInfo) => ({
    type: ACTIONS.SET,
    payload: station,
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
}) as Reducer<StationInfo | null | undefined, any>;
