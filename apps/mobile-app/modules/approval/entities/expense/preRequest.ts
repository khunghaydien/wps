import { Dispatch, Reducer } from 'redux';

import {
  ExpRequest,
  getExpPreRequestReport,
} from '@apps/domain/models/exp/request/Report';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/APPROVAL/ENTITIES/EXPENSE/PRE_REQUEST/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/APPROVAL/ENTITIES/EXPENSE/PRE_REQUEST/CLEAR_SUCCESS',
};

const getSuccess = (expRequest: ExpRequest) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: expRequest,
});

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

export const actions = {
  get:
    (requestId: string) =>
    (dispatch: Dispatch<any>): Promise<ExpRequest> => {
      return getExpPreRequestReport(requestId).then((res: ExpRequest) => {
        dispatch(getSuccess(res));
        return res;
      });
    },
  clear: () => (dispatch: Dispatch<any>) => {
    dispatch(clearSuccess());
  },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ExpRequest | null | undefined, any>;
