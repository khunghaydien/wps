import { Reducer } from 'redux';

import { dropRight } from 'lodash';

//
// constants
//
export const ACTIONS = {
  HIDE: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE',
  HIDE_ALL: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE_ALL',
  APPROVAL: 'MODULES/DIALOG/ACTIVE_DIALOG/APPROVAL',
  APPROVAL_HISTORY: 'MODULES/DIALOG/ACTIVE_DIALOG/APPROVAL_HISTORY',
  CANCEL_REQUEST: 'MODULES/DIALOG/ACTIVE_DIALOG/CANCEL_REQUEST',
  COST_CENTER: 'MODULES/DIALOG/ACTIVE_DIALOG/COST_CENTER',
  EXPENSE_TYPE: 'MODULES/DIALOG/ACTIVE_DIALOG/EXPENSE_TYPE',
  RECORD_ITEMS_CREATE: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_ITEMS_CREATE',
  RECORD_ITEMS_CONFIRM: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_ITEMS_CONFIRM',
  RECORD_ITEMS_DELETE: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_ITEMS_DELETE',
  EXPENSE_TYPE_CHANGE: 'MODULES/DIALOG/ACTIVE_DIALOG/EXPENSE_TYPE_CHANGE',
  ROUTE_SELECT: 'MODULES/DIALOG/ACTIVE_DIALOG/ROUTE_SELECT',
  JOB: 'MODULES/DIALOG/ACTIVE_DIALOG/JOB',
  RECEIPTS: 'MODULES/DIALOG/ACTIVE_DIALOG/RECEIPTS',
  EI_LOOKUP: 'MODULES/DIALOG/ACTIVE_DIALOG/EI_LOOKUP',
  VENDOR_LOOKUP: 'MODULES/DIALOG/ACTIVE_DIALOG/VENDOR_LOOKUP',
  VENDOR_DETAIL: 'MODULES/DIALOG/ACTIVE_DIALOG/VENDOR_DETAIL',
  VENDOR_CREATE: 'MODULES/DIALOG/ACTIVE_DIALOG/VENDOR_CREATE',
  VENDOR_EDIT: 'MODULES/DIALOG/ACTIVE_DIALOG/VENDOR_EDIT',
  CLEAR: 'MODULES/REQUEST/DIALOG/CLEAR',
  RECORD_CLONE_DATE: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_CLONE_DATE',
  RECORD_UPDATED: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_UPDATED',
  RECORD_CLONE_NUMBER: 'MODULES/DIALOG/ACTIVE_DIALOG/RECORD_CLONE_NUMBER',
  SWITCH_EMPLOYEE: 'MODULES/DIALOG/ACTIVE_DIALOG/SWITCH_EMPLOYEE',
};

export const dialogTypes = {
  HIDE: 'HIDE',
  APPROVAL: 'APPROVAL',
  APPROVAL_HISTORY: 'APPROVAL_HISTORY',
  CANCEL_REQUEST: 'CANCEL',
  COST_CENTER: 'COST_CENTER',
  EXPENSE_TYPE: 'EXPENSE_TYPE',
  EXPENSE_TYPE_CHANGE: 'EXPENSE_TYPE_CHANGE',
  RECORD_ITEMS_CREATE: 'RECORD_ITEMS_CREATE',
  RECORD_ITEMS_CONFIRM: 'RECORD_ITEMS_CONFIRM',
  RECORD_ITEMS_DELETE: 'RECORD_ITEMS_DELETE',
  ROUTE_SELECT: 'ROUTE_SELECT',
  JOB: 'JOB',
  RECEIPTS: 'RECEIPTS',
  EI_LOOKUP: 'EI_LOOKUP',
  VENDOR_LOOKUP: 'VENDOR_LOOKUP',
  VENDOR_DETAIL: 'VENDOR_DETAIL',
  VENDOR_CREATE: 'VENDOR_CREATE',
  VENDOR_EDIT: 'VENDOR_EDIT',
  RECORD_CLONE_DATE: 'RECORD_CLONE_DATE',
  RECORD_UPDATED: 'RECORD_UPDATED',
  RECORD_CLONE_NUMBER: 'RECORD_CLONE_NUMBER',
  SWITCH_EMPLOYEE: 'SWITCH_EMPLOYEE',
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
  approval: () => ({
    type: ACTIONS.APPROVAL,
    payload: dialogTypes.APPROVAL,
  }),
  approvalHistory: () => ({
    type: ACTIONS.APPROVAL_HISTORY,
    payload: dialogTypes.APPROVAL_HISTORY,
  }),
  cancelRequest: () => ({
    type: ACTIONS.CANCEL_REQUEST,
    payload: dialogTypes.CANCEL_REQUEST,
  }),
  costCenter: () => ({
    type: ACTIONS.COST_CENTER,
    payload: dialogTypes.COST_CENTER,
  }),
  expenseType: () => ({
    type: ACTIONS.EXPENSE_TYPE,
    payload: dialogTypes.EXPENSE_TYPE,
  }),
  expenseTypeChange: () => ({
    type: ACTIONS.EXPENSE_TYPE_CHANGE,
    payload: dialogTypes.EXPENSE_TYPE_CHANGE,
  }),
  routeSelect: () => ({
    type: ACTIONS.ROUTE_SELECT,
    payload: dialogTypes.ROUTE_SELECT,
  }),
  job: () => ({
    type: ACTIONS.JOB,
    payload: dialogTypes.JOB,
  }),
  recordItemsCreate: () => ({
    type: ACTIONS.RECORD_ITEMS_CREATE,
    payload: dialogTypes.RECORD_ITEMS_CREATE,
  }),
  recordItemsConfirm: () => ({
    type: ACTIONS.RECORD_ITEMS_CONFIRM,
    payload: dialogTypes.RECORD_ITEMS_CONFIRM,
  }),
  recordItemsDelete: () => ({
    type: ACTIONS.RECORD_ITEMS_DELETE,
    payload: dialogTypes.RECORD_ITEMS_DELETE,
  }),
  receipts: () => ({
    type: ACTIONS.RECEIPTS,
    payload: dialogTypes.RECEIPTS,
  }),
  eiLookup: () => ({
    type: ACTIONS.EI_LOOKUP,
    payload: dialogTypes.EI_LOOKUP,
  }),
  vendorLookup: () => ({
    type: ACTIONS.VENDOR_LOOKUP,
    payload: dialogTypes.VENDOR_LOOKUP,
  }),
  vendorDetail: () => ({
    type: ACTIONS.VENDOR_DETAIL,
    payload: dialogTypes.VENDOR_DETAIL,
  }),
  vendorCreate: () => ({
    type: ACTIONS.VENDOR_CREATE,
    payload: dialogTypes.VENDOR_CREATE,
  }),
  vendorEdit: () => ({
    type: ACTIONS.VENDOR_EDIT,
    payload: dialogTypes.VENDOR_EDIT,
  }),
  recordCloneDate: () => ({
    type: ACTIONS.RECORD_CLONE_DATE,
    payload: dialogTypes.RECORD_CLONE_DATE,
  }),
  recordUpdated: () => ({
    type: ACTIONS.RECORD_UPDATED,
    payload: dialogTypes.RECORD_UPDATED,
  }),
  recordCloneNumber: () => ({
    type: ACTIONS.RECORD_CLONE_NUMBER,
    payload: dialogTypes.RECORD_CLONE_NUMBER,
  }),
  switchEmployee: () => ({
    type: ACTIONS.SWITCH_EMPLOYEE,
    payload: dialogTypes.SWITCH_EMPLOYEE,
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
    case ACTIONS.APPROVAL_HISTORY:
    case ACTIONS.CANCEL_REQUEST:
    case ACTIONS.COST_CENTER:
    case ACTIONS.EXPENSE_TYPE:
    case ACTIONS.EXPENSE_TYPE_CHANGE:
    case ACTIONS.RECORD_ITEMS_CREATE:
    case ACTIONS.RECORD_ITEMS_CONFIRM:
    case ACTIONS.RECORD_ITEMS_DELETE:
    case ACTIONS.ROUTE_SELECT:
    case ACTIONS.RECEIPTS:
    case ACTIONS.JOB:
    case ACTIONS.EI_LOOKUP:
    case ACTIONS.VENDOR_LOOKUP:
    case ACTIONS.VENDOR_DETAIL:
    case ACTIONS.VENDOR_CREATE:
    case ACTIONS.VENDOR_EDIT:
    case ACTIONS.RECORD_CLONE_DATE:
    case ACTIONS.RECORD_UPDATED:
    case ACTIONS.RECORD_CLONE_NUMBER:
    case ACTIONS.SWITCH_EMPLOYEE:
      return [...state, action.payload];
    case ACTIONS.CLEAR:
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
