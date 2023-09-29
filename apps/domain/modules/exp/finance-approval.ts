import { Reducer } from 'redux';

import {
  approve,
  EditHistoryList,
  getEditHistory,
  getRequestItem,
  initialStateRequestItem,
  reject,
  RequestItem,
  save,
} from '../../models/exp/FinanceApproval';
import { Record, saveFARecord } from '../../models/exp/Record';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/FINANCE_APPROVAL/GET_SUCCESS',
  APPROVE_SUCCESS: 'MODULES/ENTITIES/EXP/FINANCE_APPROVAL/APPROVE_SUCCESS',
  REJECT_SUCCESS: 'MODULES/ENTITIES/EXP/FINANCE_APPROVAL/REJECT_SUCCESS',
  GET_HISTORY_SUCCESS:
    'MODULES/ENTITIES/EXP/FINANCE_APPROVAL/HISTORY/GET_SUCCESS',
};

const getSuccess = (requestItem: RequestItem) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: requestItem,
});

const getHistorySuccess = (body: EditHistoryList) => ({
  type: ACTIONS.GET_HISTORY_SUCCESS,
  payload: body,
});

const rejectSuccess = () => ({
  type: ACTIONS.REJECT_SUCCESS,
});

const approveSuccess = () => ({
  type: ACTIONS.APPROVE_SUCCESS,
});

export const actions = {
  get:
    (requestId?: string) =>
    (dispatch: AppDispatch): void | any => {
      return getRequestItem(requestId).then((res: RequestItem) =>
        dispatch(getSuccess(res))
      );
    },

  getHistory:
    (requestId: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: EditHistoryList; type: string }> => {
      return getEditHistory(requestId).then((res: EditHistoryList) =>
        dispatch(getHistorySuccess(res))
      );
    },

  reject:
    (requestIds: string[], comment: string) =>
    (dispatch: AppDispatch): void | any => {
      return reject(requestIds, comment).then(() => dispatch(rejectSuccess()));
    },

  approve:
    (requestIds: string[], comment: string) =>
    (dispatch: AppDispatch): void | any => {
      return approve(requestIds, comment).then(() =>
        dispatch(approveSuccess())
      );
    },

  save: (report: any) => () => {
    return save(report);
  },

  saveRecord:
    (
      record: Record,
      reportId: string,
      requestId: string,
      reportTypeId: string,
      empId: string
    ) =>
    () => {
      return saveFARecord(record, reportId, requestId, reportTypeId, empId);
    },
};

const initialState = {
  requestItem: initialStateRequestItem,
  modificationList: [],
};

type State = {
  modificationList: EditHistoryList;
  requestItem: RequestItem;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return {
        ...state,
        requestItem: action.payload,
      };
    case ACTIONS.GET_HISTORY_SUCCESS:
      return {
        ...state,
        modificationList: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
