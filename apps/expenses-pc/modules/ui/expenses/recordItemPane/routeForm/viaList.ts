import { Reducer } from 'redux';

import _ from 'lodash';

import { StationInfo } from '../../../../../../domain/models/exp/jorudan/Station';
import { ViaList } from '../../../../../../domain/models/exp/Record';

export const ACTIONS = {
  INITIALIZE:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/INITIALIZE',
  ADD: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/ADD',
  DELETE: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/DELETE',
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/SET',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/CLEAR',
  ALL_CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/ALL_CLEAR',
  REVERSE: 'MODULES/EXPENSES/RECORD_ITEM_PANE/ROUTE_FORM/VIA_LIST/REVERSE',
};

export const actions = {
  initialize: (viaList: ViaList) => ({
    type: ACTIONS.INITIALIZE,
    payload: viaList,
  }),
  add: () => ({
    type: ACTIONS.ADD,
  }),
  delete: (idx: number) => ({
    type: ACTIONS.DELETE,
    payload: idx,
  }),
  set: (station: StationInfo, idx: number) => ({
    type: ACTIONS.SET,
    payload: { station, idx },
  }),
  clear: (idx: number) => ({
    type: ACTIONS.CLEAR,
    payload: idx,
  }),
  allClear: () => ({
    type: ACTIONS.ALL_CLEAR,
  }),
  reverse: () => ({
    type: ACTIONS.REVERSE,
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
      return action.payload;
    case ACTIONS.ADD:
      tmpState.push(null);
      return tmpState;
    case ACTIONS.SET:
      tmpState[action.payload.idx] = action.payload.station;
      return tmpState;
    case ACTIONS.DELETE:
      tmpState.splice(action.payload, 1);
      return tmpState;
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
}) as Reducer<ViaList, any>;
