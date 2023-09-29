import { Reducer } from 'redux';

import _ from 'lodash';

import { MAX_LENGTH_VIA_LIST } from '../../../../../../../domain/models/exp/Record';

export const ACTIONS = {
  INITIALIZE:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ERRORS/VIA_LIST/INITIALIZE',
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ERRORS/VIA_LIST/SET',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ERRORS/VIA_LIST/CLEAR',
  ALL_CLEAR:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/ERRORS/VIA_LIST/ALL_CLEAR',
};

export const actions = {
  initialize: () => ({
    type: ACTIONS.INITIALIZE,
  }),
  set: (value: string, idx: number) => ({
    type: ACTIONS.SET,
    payload: { value, idx },
  }),
  clear: (idx: number) => ({
    type: ACTIONS.CLEAR,
    payload: idx,
  }),
  allClear: () => ({
    type: ACTIONS.ALL_CLEAR,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  const tmpState = _.cloneDeep(state);
  switch (action.type) {
    case ACTIONS.INITIALIZE:
      return initialState;
    case ACTIONS.SET:
      if (action.payload.idx < MAX_LENGTH_VIA_LIST) {
        tmpState[action.payload.idx] = action.payload.value;
      }

      return tmpState;
    case ACTIONS.CLEAR:
      tmpState.splice(action.payload, 1);
      return tmpState;
    case ACTIONS.ALL_CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
