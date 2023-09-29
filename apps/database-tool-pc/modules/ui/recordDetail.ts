import { Reducer } from 'redux';

import { AppDispatch } from '../AppThunk';

export type State = {
  isDetailPage: boolean;
  record: Record<string, any>;
  objKey: string;
  isEdit: boolean;
};

const ACTIONS = {
  DISPLAY_DETAIL_PAGE: 'MODULES/UI/DB_TOOL/RECORD_DETAIL/DISPLAY_DETAIL_PAGE',
  SET_RECORD: 'MODULES/UI/DB_TOOL/RECORD_DETAIL/SET_RECORD',
  SET_MODE: 'MODULES/UI/DB_TOOL/RECORD_DETAIL/SET_MODE',
  UPDATE_RECORD: 'MODULES/UI/DB_TOOL/RECORD_DETAIL/UPDATE_RECORD',
};

const setRecord = (objKey: string, record: Record<string, any>) => ({
  type: ACTIONS.SET_RECORD,
  payload: { objKey, record },
});

const setDetailPage = (isDisplay: boolean) => ({
  type: ACTIONS.DISPLAY_DETAIL_PAGE,
  payload: isDisplay,
});

const setMode = (isEdit: boolean) => ({
  type: ACTIONS.SET_MODE,
  payload: isEdit,
});

const updateRecord = (record: Record<string, any>) => ({
  type: ACTIONS.UPDATE_RECORD,
  payload: record,
});

export const actions = {
  setDetailRecord:
    (objKey: string, record: Record<string, any>) =>
    (dispatch: AppDispatch): void => {
      dispatch(setRecord(objKey, record));
    },
  setDetailPageDisplay:
    (isDisplay = false) =>
    (dispatch: AppDispatch): void => {
      dispatch(setDetailPage(isDisplay));
    },
  updateDetailRecord:
    (record: Record<string, any>) =>
    (dispatch: AppDispatch): void => {
      dispatch(updateRecord(record));
    },
  setEditMode:
    (isEdit: boolean) =>
    (dispatch: AppDispatch): void => {
      dispatch(setMode(isEdit));
    },
};

const initialState: State = {
  record: [],
  isDetailPage: false,
  objKey: '',
  isEdit: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.DISPLAY_DETAIL_PAGE:
      return { ...state, isDetailPage: action.payload };
    case ACTIONS.SET_RECORD:
      return {
        ...state,
        record: action.payload.record,
        objKey: action.payload.objKey,
      };
    case ACTIONS.SET_MODE:
      return {
        ...state,
        isEdit: action.payload,
      };
    case ACTIONS.UPDATE_RECORD:
      return {
        ...state,
        record: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
