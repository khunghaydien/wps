import { Reducer } from 'redux';

import {
  getRequestList,
  RequestIds,
  RequestList,
} from '../../../domain/models/exp/FinanceApproval';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/REQUEST_LIST/LIST_SUCCESS',
  INITIALIZE: 'MODULES/ENTITIES/REQUEST_LIST/INITIALIZE',
};

const listSuccess = (requestList: RequestList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: requestList,
});

const initialize = () => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: [],
});

export const actions = {
  list:
    (requestIds?: RequestIds) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: RequestList; type: string }> => {
      return getRequestList(requestIds).then((res: RequestList) =>
        dispatch(listSuccess(res))
      );
    },
  initialize:
    () =>
    (dispatch: AppDispatch): { payload: any[]; type: string } => {
      return dispatch(initialize());
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    case ACTIONS.INITIALIZE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RequestList, any>;
