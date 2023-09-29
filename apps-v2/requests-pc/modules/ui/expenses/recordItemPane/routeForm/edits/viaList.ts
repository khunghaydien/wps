import { Reducer } from 'redux';

import _ from 'lodash';

import { MAX_LENGTH_VIA_LIST } from '../../../../../../../domain/models/exp/Record';

export const ACTIONS = {
  INITIALIZE:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/INITIALIZE',
  ADD: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/ADD',
  DELETE: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/DELETE',
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/SET',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/CLEAR',
  ALL_CLEAR:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/ALL_CLEAR',
  REVERSE:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/EDITS/VIA_LIST/REVERSE',
};

export const actions = {
  initialize: (valueList: Array<string>) => ({
    type: ACTIONS.INITIALIZE,
    payload: valueList,
  }),
  add: () => ({
    type: ACTIONS.ADD,
  }),
  delete: (idx: number) => ({
    type: ACTIONS.DELETE,
    payload: idx,
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
  reverse: () => ({ type: ACTIONS.REVERSE }),
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  const tmpState = _.cloneDeep(state);
  switch (action.type) {
    case ACTIONS.INITIALIZE:
      return action.payload;
    case ACTIONS.ADD:
      if (tmpState.length < MAX_LENGTH_VIA_LIST) {
        tmpState.push('');
      }

      return tmpState;
    case ACTIONS.SET:
      if (action.payload.idx < MAX_LENGTH_VIA_LIST) {
        tmpState[action.payload.idx] = action.payload.value;
      }

      return tmpState;
    case ACTIONS.DELETE:
    case ACTIONS.CLEAR:
      tmpState.splice(action.payload, 1);
      return tmpState;
    case ACTIONS.REVERSE:
      tmpState.reverse();
      return tmpState;
    case ACTIONS.ALL_CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
