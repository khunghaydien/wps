import { Reducer } from 'redux';

import { dropRight } from 'lodash';

import { dialogTypes } from '@apps/custom-request-pc/consts';
import { Mode as Dialog } from '@apps/custom-request-pc/types';

//
// constants
//
export const ACTIONS = {
  HIDE: 'MODULES/UI/DIALOG/ACTIVE_DIALOG/HIDE',
  HIDE_ALL: 'MODULES/UI/DIALOG/ACTIVE_DIALOG/HIDE_ALL',
  CLEAR: 'MODULES/UI/DIALOG/CLEAR',
  NEW: 'MODULES/UI/DIALOG/NEW',
  EDIT: 'MODULES/UI/DIALOG/EDIT',
  RECORD_TYPE_SELECT: 'MODULES/UI/DIALOG/RECORD_TYPE_SELECT',
  APPROVAL: 'MODULES/UI/DIALOG/ACTIVE_DIALOG/APPROVAL',
  RECALL: 'MODULES/UI/DIALOG/ACTIVE_DIALOG/RECALL',
};

//
// actions
//
export const actions = {
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  hide: () => ({
    type: ACTIONS.HIDE,
    payload: dialogTypes.HIDE,
  }),
  hideAll: () => ({
    type: ACTIONS.HIDE_ALL,
  }),
  new: () => ({
    type: ACTIONS.NEW,
    payload: dialogTypes.NEW,
  }),
  edit: () => ({
    type: ACTIONS.EDIT,
    payload: dialogTypes.EDIT,
  }),
  recordTypeSelect: () => ({
    type: ACTIONS.RECORD_TYPE_SELECT,
    payload: dialogTypes.RECORD_TYPE_SELECT,
  }),
  approval: () => ({
    type: ACTIONS.APPROVAL,
    payload: dialogTypes.APPROVAL,
  }),
  recall: () => ({
    type: ACTIONS.RECALL,
    payload: dialogTypes.RECALL,
  }),
};

//
// Reducer
//
const initialState = [] as Array<Dialog>;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HIDE:
      return dropRight(state);
    case ACTIONS.HIDE_ALL:
      return initialState;
    case ACTIONS.NEW:
    case ACTIONS.EDIT:
    case ACTIONS.RECORD_TYPE_SELECT:
    case ACTIONS.RECALL:
    case ACTIONS.APPROVAL:
      return [...state, action.payload];
    case ACTIONS.CLEAR:
    default:
      return state;
  }
}) as Reducer<Array<Dialog>, any>;
