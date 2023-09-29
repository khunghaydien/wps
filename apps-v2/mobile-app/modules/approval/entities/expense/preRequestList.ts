import { Reducer } from 'redux';

import {
  ExpRequestList,
  fetchExpPreRequestReportList,
} from '../../../../../domain/models/exp/request/Report';

export const ACTIONS = {
  FETCH_SUCCESS:
    'MODULES/APPROVAL/ENTITIES/EXPENSE/PRE_REQUEST_LIST/FETCH_SUCCESS',
  CLEAR_SUCCESS:
    'MODULES/APPROVAL/ENTITIES/EXPENSE/PRE_REQUEST_LIST/CLEAR_SUCCESS',
  UPDATE_SUCCESS:
    'MODULES/APPROVAL/ENTITIES/EXPENSE/PRE_REQUEST_LIST/UPDATE_SUCCESS',
};

const listSuccess = (requestList: ExpRequestList) => {
  return {
    type: ACTIONS.FETCH_SUCCESS,
    payload: requestList,
  };
};

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

const update = (requestList: ExpRequestList) => {
  return {
    type: ACTIONS.UPDATE_SUCCESS,
    payload: requestList,
  };
};

export const actions = {
  fetch:
    (idList: Array<string>, empId: string, isUpdate?: boolean) =>
    (dispatch): Promise<ExpRequestList> => {
      return fetchExpPreRequestReportList(idList, empId).then(
        (res: ExpRequestList) => {
          const action = isUpdate ? update : listSuccess;
          dispatch(action(res));
          return res;
        }
      );
    },

  clear: () => (dispatch) => {
    dispatch(clearSuccess());
  },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return [...state, ...action.payload];
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpRequestList, any>;
