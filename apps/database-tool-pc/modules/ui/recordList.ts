import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import { AppDispatch } from '../AppThunk';

type State = {
  currentPage: number;
  mode: number;
  records: Array<Record<string, any>>;
  resetCheckbox: boolean;
  isDeletedIncluded: boolean;
  listHeaderColumn: Array<string>;
};

const ACTIONS = {
  SET_CURRENT_PAGE: 'MODULES/UI/DB_TOOL/RECORDLIST/CURRENT_PAGE',
  SET_RECORDS: 'MODULES/UI/DB_TOOL/RECORDLIST/SET_RECORDS',
  CLEAN_RECORDS: 'MODULES/UI/DB_TOOL/RECORDLIST/CLEAN_RECORDS',
  SET_MODE: 'MODULES/UI/DB_TOOL/RECORDLIST/SET_MODE',
  RESET_CHECKBOX: 'MODULES/UI/DB_TOOL/RECORDLIST/RESET_CHECKBOX',
  SET_DELETED_INCLUDED: 'MODULES/UI/DB_TOOL/RECORDLIST/SET_DELETED_INCLUDED',
  SET_LIST_HEADER_COLUMN:
    'MODULES/UI/DB_TOOL/RECORDLIST/SET_LIST_HEADER_COLUMN',
};

const setRecords = (records: Array<Record<string, any>>) => ({
  type: ACTIONS.SET_RECORDS,
  payload: records,
});

const setEditMode = (mode: number) => ({
  type: ACTIONS.SET_MODE,
  payload: mode,
});

const setCheckbox = (isResert: boolean) => ({
  type: ACTIONS.RESET_CHECKBOX,
  payload: isResert,
});

const setDeleted = (isDeletedIncluded: boolean) => ({
  type: ACTIONS.SET_DELETED_INCLUDED,
  payload: isDeletedIncluded,
});

export const actions = {
  setCurrentPage: (num: number) => ({
    type: ACTIONS.SET_CURRENT_PAGE,
    payload: num,
  }),
  setMode:
    (mode: number) =>
    (dispatch: AppDispatch): void => {
      dispatch(setEditMode(mode));
    },
  setCheckboxList:
    (isReset = false) =>
    (dispatch: AppDispatch): void => {
      dispatch(setCheckbox(isReset));
    },
  setFetchedRecords:
    (records: Array<Record<string, any>>) =>
    (dispatch: AppDispatch): void => {
      dispatch(setRecords(records));
    },
  updateRecords:
    (records: Array<Record<string, any>>) =>
    (dispatch: AppDispatch): void => {
      dispatch(setRecords(records));
    },
  setDeletedIncluded:
    (isIncluded: boolean) =>
    (dispatch: AppDispatch): void => {
      dispatch(setDeleted(isIncluded));
    },
  setListHeaderColumn: (sqlList: Array<string>) => ({
    type: ACTIONS.SET_LIST_HEADER_COLUMN,
    payload: sqlList,
  }),
};

const initialState: State = {
  currentPage: 1,
  mode: 0,
  records: [],
  resetCheckbox: false,
  isDeletedIncluded: false,
  listHeaderColumn: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ACTIONS.SET_RECORDS:
      return { ...state, records: cloneDeep(action.payload) };
    case ACTIONS.SET_MODE:
      return { ...state, mode: action.payload };
    case ACTIONS.RESET_CHECKBOX:
      return { ...state, resetCheckbox: action.payload };
    case ACTIONS.SET_DELETED_INCLUDED:
      return { ...state, isDeletedIncluded: action.payload };
    case ACTIONS.SET_LIST_HEADER_COLUMN:
      return { ...state, listHeaderColumn: action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
