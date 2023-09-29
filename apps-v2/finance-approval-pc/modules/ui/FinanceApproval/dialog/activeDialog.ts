import { Reducer } from 'redux';

import { dropRight } from 'lodash';

//
// constants
//
export const ACTIONS = {
  HIDE: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE',
  HIDE_ALL: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE_ALL',
  SEARCH_CONDITION: 'MODULES/DIALOG/ACTIVE_DIALOG/SEARCH_CONDITION',
  DELETE_SEARCH_CONDITION:
    'MODULES/DIALOG/ACTIVE_DIALOG/DELETE_SEARCH_CONDITION',
  CLEAR: 'MODULES/EXPENSES/DIALOG/CLEAR',
  CLEAR_REQUEST: 'MODULES/REQUEST/DIALOG/CLEAR',
  APPROVAL: 'MODULES/DIALOG/ACTIVE_DIALOG/APPROVAL',
  CANCEL_REQUEST: 'MODULES/DIALOG/ACTIVE_DIALOG/CANCEL_REQUEST',
  CONFIRM_APPROVAL: 'MODULES/DIALOG/ACTIVE_DIALOG/CONFIRM_APPROVAL',
  REJECT_FINANCE_APPROVAL:
    'MODULES/DIALOG/ACTIVE_DIALOG/REJECT_FINANCE_APPROVAL',
  CLONE_CONFIRM: 'MODULES/DIALOG/ACTIVE_DIALOG/CLONE_CONFIRM',
  BULK_APPROVE_CONFIRM: 'MODULES/DIALOG/ACTIVE_DIALOG/BULK_APPROVE_CONFIRM',
  BULK_REJECT_CONFIRM: 'MODULES/DIALOG/ACTIVE_DIALOG/BULK_REJECT_CONFIRM',
};

export const dialogTypes = {
  HIDE: 'HIDE',
  SEARCH_CONDITION: 'SEARCH_CONDITION',
  DELETE_SEARCH_CONDITION: 'DELETE_SEARCH_CONDITION',
  APPROVAL: 'APPROVAL',
  CANCEL_REQUEST: 'CANCEL',
  CONFIRM_APPROVAL: 'CONFIRM_APPROVAL',
  REJECT_FINANCE_APPROVAL: 'REJECT_FINANCE_APPROVAL',
  CLONE_CONFIRM: 'CLONE_CONFIRM',
  BULK_APPROVE_CONFIRM: 'BULK_APPROVE_CONFIRM',
  BULK_REJECT_CONFIRM: 'BULK_REJECT_CONFIRM',
};

//
// actions
//
export const actions = {
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  clearRequest: () => ({
    type: ACTIONS.CLEAR_REQUEST,
  }),
  hide: () => ({
    type: ACTIONS.HIDE,
    payload: dialogTypes.HIDE,
  }),
  hideAll: () => ({
    type: ACTIONS.HIDE_ALL,
  }),
  searchCondition: () => ({
    type: ACTIONS.SEARCH_CONDITION,
    payload: dialogTypes.SEARCH_CONDITION,
  }),
  deleteSearchCondition: () => ({
    type: ACTIONS.DELETE_SEARCH_CONDITION,
    payload: dialogTypes.DELETE_SEARCH_CONDITION,
  }),
  approval: () => ({
    type: ACTIONS.APPROVAL,
    payload: dialogTypes.APPROVAL,
  }),
  cancelRequest: () => ({
    type: ACTIONS.CANCEL_REQUEST,
    payload: dialogTypes.CANCEL_REQUEST,
  }),
  confirmApproval: () => ({
    type: ACTIONS.CONFIRM_APPROVAL,
    payload: dialogTypes.CONFIRM_APPROVAL,
  }),
  rejectFADialog: () => ({
    type: ACTIONS.REJECT_FINANCE_APPROVAL,
    payload: dialogTypes.REJECT_FINANCE_APPROVAL,
  }),
  cloneConfirm: () => ({
    type: ACTIONS.CLONE_CONFIRM,
    payload: dialogTypes.CLONE_CONFIRM,
  }),
  bulkRejectConfirm: () => ({
    type: ACTIONS.BULK_REJECT_CONFIRM,
    payload: dialogTypes.BULK_REJECT_CONFIRM,
  }),
  bulkApproveConfirm: () => ({
    type: ACTIONS.BULK_APPROVE_CONFIRM,
    payload: dialogTypes.BULK_APPROVE_CONFIRM,
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
    case ACTIONS.APPROVAL:
    case ACTIONS.CANCEL_REQUEST:
    case ACTIONS.CLONE_CONFIRM:
    case ACTIONS.CONFIRM_APPROVAL:
    case ACTIONS.REJECT_FINANCE_APPROVAL:
    case ACTIONS.SEARCH_CONDITION:
    case ACTIONS.DELETE_SEARCH_CONDITION:
    case ACTIONS.BULK_APPROVE_CONFIRM:
    case ACTIONS.BULK_REJECT_CONFIRM:
      return [...state, action.payload];
    case ACTIONS.CLEAR:
    case ACTIONS.CLEAR_REQUEST:
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
