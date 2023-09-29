import { Reducer } from 'redux';

import { cloneDeep, find, set } from 'lodash';

import {
  cancelExpRequestReport,
  ExpRequest,
  ExpRequestIdsInfo,
  ExpRequestList,
  fetchExpRequestReportIds,
  fetchExpRequestReportList,
  fixFiles,
  getExpRequestReport,
  initialStateExpRequest,
  initialStateExpRequestList,
  SearchConditions,
  submitExpRequestReport,
} from '../../../models/exp/request/Report';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  CANCEL: 'MODULES/UI/EXP/REQUEST/REPORT/CANCEL',
  SUBMIT: 'MODULES/UI/EXP/REQUEST/REPORT/SUBMIT',
  GET_IDS_SUCCESS: 'MODULES/UI/EXP/REQUEST/REPORT/GET_IDS_SUCCESS',
  LIST_SUCCESS: 'MODULES/UI/EXP/REQUEST/REPORT/LIST_SUCCESS',
  GET_SUCCESS: 'MODULES/UI/EXP/REQUEST/REPORT/GET_SUCCESS',
  SET_STATUS: 'MODULES/UI/EXP/REQUEST/REPORT/SET_STATUS',
  CLEAR: 'MODULES/UI/EXP/REQUEST/REPORT/CLEAR',
};

const getIdsSuccess = (res: ExpRequestIdsInfo) => {
  return {
    type: ACTIONS.GET_IDS_SUCCESS,
    payload: res,
  };
};

const listSuccess = (body: ExpRequestList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: body,
  };
};

const getSuccess = (res: any) => ({
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

const clear = () => ({
  type: ACTIONS.CLEAR,
});

export const actions = {
  submit: (reportId: string, comment: string, empId?: string) => () => {
    return submitExpRequestReport(reportId, comment, empId).catch((err) => {
      throw err;
    });
  },
  fixFiles: (reportId: string) => () => {
    return fixFiles(reportId).catch((err) => {
      throw err;
    });
  },
  cancel: (requestId: string, comment: string) => () => {
    return cancelExpRequestReport(requestId, comment).catch((err) => {
      throw err;
    });
  },
  listIds:
    (searchCondition: SearchConditions, empId?: string, isEmpty?: boolean) =>
    (dispatch: AppDispatch): Promise<string[]> => {
      return fetchExpRequestReportIds(searchCondition, empId).then(
        (res: ExpRequestIdsInfo) => {
          const listIds = isEmpty ? { totalSize: 0, requestIdList: [] } : res;
          return dispatch(getIdsSuccess(listIds));
        }
      );
    },
  list:
    (requestIds: Array<string>, empId?: string, isEmpty?: boolean) =>
    (dispatch: AppDispatch): void | any => {
      return fetchExpRequestReportList(requestIds)
        .then((res: ExpRequestList) => {
          const list = isEmpty ? [] : res;
          return dispatch(listSuccess(list));
        })
        .catch((err) => {
          throw err;
        });
    },
  get:
    (requestId: string, empId: string) =>
    (dispatch: AppDispatch): void | any => {
      return getExpRequestReport(requestId, empId)
        .then((res: any) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
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
