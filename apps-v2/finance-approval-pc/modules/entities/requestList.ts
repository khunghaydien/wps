import { Reducer } from 'redux';

import { cloneDeep, find, set } from 'lodash';

import {
  getRequestList,
  RequestIds,
  RequestList,
} from '../../../domain/models/exp/FinanceApproval';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/REQUEST_LIST/LIST_SUCCESS',
  INITIALIZE: 'MODULES/ENTITIES/REQUEST_LIST/INITIALIZE',
  SET_STATUS: 'MODULES/ENTITIES/REQUEST_LIST/SET_STATUS',
};

const listSuccess = (requestList: RequestList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: requestList,
});

const initialize = () => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: [],
});

const setBulkStatus = (requestList, requestIdList, status) => {
  const updatedList = cloneDeep(requestList);
  requestIdList.forEach((requestId) => {
    const request = find(updatedList, { requestId });
    if (request) {
      set(request, 'status', status);
    }
  });
  return { type: ACTIONS.SET_STATUS, payload: updatedList };
};

export const actions = {
  list:
    (requestIds?: RequestIds, companyId?: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: RequestList; type: string }> => {
      return getRequestList(requestIds, companyId).then((res: RequestList) =>
        dispatch(listSuccess(res))
      );
    },
  initialize:
    () =>
    (dispatch: AppDispatch): { payload: any[]; type: string } => {
      return dispatch(initialize());
    },
  setBulkStatus:
    (requestList: RequestList, requestIdList: string[], status: string) =>
    (dispatch: AppDispatch): void => {
      dispatch(setBulkStatus(requestList, requestIdList, status));
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
    case ACTIONS.INITIALIZE:
    case ACTIONS.SET_STATUS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RequestList, any>;
