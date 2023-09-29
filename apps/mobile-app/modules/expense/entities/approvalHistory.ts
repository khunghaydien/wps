import { Reducer } from 'redux';

import {
  ExpApprovalHistory,
  getExpApprovalHistoryLit,
} from '@apps/domain/models/exp/approval/request/History';

import { AppDispatch } from '../AppThunk';

export type State = {
  list: ExpApprovalHistory[];
  isLoading: boolean;
};

export const ACTIONS = {
  SET_LOADING: 'MODULES/EXPENSE/ENTITIES/HISTORY_LIST/SET_LOADING',
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/HISTORY_LIST/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/EXPENSE/ENTITIES/HISTORY_LIST/CLEAR_SUCCESS',
};

const setLoading = (isLoading: boolean) => ({
  type: ACTIONS.SET_LOADING,
  payload: isLoading,
});

const getSuccess = (historyList: ExpApprovalHistory[]) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: historyList,
});

export const actions = {
  get: (requestId: string) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    return getExpApprovalHistoryLit(requestId)
      .then(({ historyList }) => {
        dispatch(getSuccess(historyList));
        dispatch(setLoading(false));
      })
      .catch((err) => {
        throw err;
      });
  },
};

const initialState = {
  list: [],
  isLoading: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.GET_SUCCESS:
      return { ...state, list: action.payload };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
