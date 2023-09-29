import { Reducer } from 'redux';

import {
  approvePreRequest,
  EditHistoryList,
  getPreRequestEditHistory,
  getPreRequestItem,
  initialStateRequestItem,
  rejectPreRequest,
  RequestItem,
  savePreRequest,
} from '@apps/domain/models/exp/FinanceApproval';
import { Record, saveFAPreRequestRecord } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/FINANCE_APPROVAL_PRE_REQUEST/GET_SUCCESS',
  GET_HISTORY_SUCCESS:
    'MODULES/ENTITIES/EXP/FINANCE_APPROVAL_PRE_REQUEST/HISTORY/GET_SUCCESS',
};

const getSuccess = (requestItem: Report) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: requestItem,
});
const getHistorySuccess = (body: EditHistoryList) => ({
  type: ACTIONS.GET_HISTORY_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (requestId?: string) =>
    (dispatch: AppDispatch): Promise<{ payload: Report; type: string }> => {
      return getPreRequestItem(requestId).then((res: Report) =>
        dispatch(getSuccess(res))
      );
    },
  getHistory:
    (requestId: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: EditHistoryList; type: string }> => {
      return getPreRequestEditHistory(requestId).then((res: EditHistoryList) =>
        dispatch(getHistorySuccess(res))
      );
    },
  reject: (requestIds: string[], comment: string) => () =>
    rejectPreRequest(requestIds, comment),
  approve: (requestIds: string[], comment: string) => () =>
    approvePreRequest(requestIds, comment),
  save: (report: Report) => () => {
    return savePreRequest(report);
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
      return saveFAPreRequestRecord(
        record,
        reportId,
        requestId,
        reportTypeId,
        empId
      );
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
