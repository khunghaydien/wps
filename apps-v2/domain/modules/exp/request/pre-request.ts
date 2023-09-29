import { Reducer } from 'redux';

import { cloneDeep, find, set } from 'lodash';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';

import {
  canExpRequestApproval,
  discardExpPreRequest,
  ExpRequest,
  ExpRequestIdsInfo,
  ExpRequestList,
  fetchExpPreRequestReportIds,
  fetchExpPreRequestReportList,
  getExpPreRequestReport,
  initialStateExpRequest,
  initialStateExpRequestList,
  preProcess,
  SearchConditions,
  submitExpPreRequestReport,
} from '../../../models/exp/request/Report';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SUBMIT: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/SUBMIT',
  GET_IDS_SUCCESS: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/GET_IDS_SUCCESS',
  LIST_SUCCESS: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/LIST_SUCCESS',
  GET_SUCCESS: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/GET_SUCCESS',
  SET_STATUS: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/SET_STATUS',
  CLEAR: 'MODULES/UI/EXP/REQUEST/PRE_REQUEST/CLEAR',
};

const getIdsSuccess = (res: ExpRequestIdsInfo) => {
  return {
    type: ACTIONS.GET_IDS_SUCCESS,
    payload: res,
  };
};

const listSuccess = (body: ExpRequestList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const getSuccess = (res: ExpRequest) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: res,
});

const setStatus = (requestList, requestId, status) => {
  const updatedList = cloneDeep(requestList);
  const request = find(updatedList, { requestId });
  if (request) {
    set(request, 'status', status);
  }
  return { type: ACTIONS.SET_STATUS, payload: updatedList };
};

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

const clear = () => ({
  type: ACTIONS.CLEAR,
});

export const actions = {
  preProcess: (reportId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return preProcess(reportId, true)
      .catch((err) => err)
      .finally(() => {
        dispatch(loadingEnd());
      });
  },
  submit: (reportId: string, comment: string, empId: string) => () => {
    return submitExpPreRequestReport(reportId, comment, empId);
  },
  cancel: (requestId: string, comment: string) => () => {
    return canExpRequestApproval(requestId, comment);
  },
  listIds:
    (searchCondition: SearchConditions, empId?: string, isEmpty?: boolean) =>
    (dispatch: AppDispatch): void | any => {
      return fetchExpPreRequestReportIds(searchCondition, empId).then(
        (res: ExpRequestIdsInfo) => {
          const list = isEmpty ? { totalSize: 0, requestIdList: [] } : res;
          return dispatch(getIdsSuccess(list));
        }
      );
    },
  list:
    (requestIds: Array<string>, empId?: string, isEmpty?: boolean) =>
    (dispatch: AppDispatch): void | any => {
      return fetchExpPreRequestReportList(requestIds).then(
        (requestList: ExpRequestList) => {
          const list = isEmpty ? [] : requestList;
          return dispatch(listSuccess(list));
        }
      );
    },
  get:
    (requestId: string, empId: string) =>
    (dispatch: AppDispatch): void | any => {
      return getExpPreRequestReport(requestId, empId).then((res: any) =>
        dispatch(getSuccess(res))
      );
    },
  discard: (requestId: string) => () => {
    return discardExpPreRequest(requestId);
  },
  clear:
    () =>
    (dispatch: AppDispatch): void | any => {
      dispatch(clear());
    },
  setStatus:
    (requestList: ExpRequestList, requestId: string, status: string) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(setStatus(requestList, requestId, status));
    },
  setBulkStatus:
    (requestList: ExpRequestList, requestIdList: string[], status: string) =>
    (dispatch: AppDispatch): void => {
      dispatch(setBulkStatus(requestList, requestIdList, status));
    },
};

const initialState = {
  expRequestList: initialStateExpRequestList,
  expRequest: initialStateExpRequest,
};

type State = {
  expRequest: ExpRequest;
  expRequestList: ExpRequestList;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_IDS_SUCCESS:
      return {
        ...state,
        expIdsInfo: action.payload,
      };
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        expRequestList: action.payload,
      };
    case ACTIONS.GET_SUCCESS:
      return {
        ...state,
        expRequest: action.payload,
      };
    case ACTIONS.SET_STATUS:
      return {
        ...state,
        expRequestList: action.payload,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
