import { Reducer } from 'redux';

import { dropRight } from 'lodash';

//
// constants
//
export const ACTIONS = {
  HIDE: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE',
  HIDE_ALL: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE_ALL',
  RECORD_ITEMS_CONFIRM: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_ITEMS_CONFIRM',
};

export const dialogTypes = {
  RECORD_ITEMS_CONFIRM: 'RECORD_ITEMS_CONFIRM',
};

//
// actions
//
export const actions = {
  hide: () => ({
    type: ACTIONS.HIDE,
  }),
  hideAll: () => ({
    type: ACTIONS.HIDE_ALL,
  }),

  recordItemsConfirm: () => ({
    type: ACTIONS.RECORD_ITEMS_CONFIRM,
    payload: dialogTypes.RECORD_ITEMS_CONFIRM,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HIDE:
      return dropRight(state);
    case ACTIONS.HIDE_ALL:
      return initialState;
    case ACTIONS.RECORD_ITEMS_CONFIRM:
      return [...state, action.payload];
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
