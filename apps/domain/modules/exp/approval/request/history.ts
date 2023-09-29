import { Reducer } from 'redux';

import {
  ExpApprovalHistoryList,
  getExpApprovalHistoryLit,
} from '../../../../models/exp/approval/request/History';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXP/APPROVAL/REQUEST/HISTORY/GET_SUCCESS',
};

const getSuccess = (body: ExpApprovalHistoryList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (requestId: string) =>
    (dispatch: AppDispatch): void | any => {
      return getExpApprovalHistoryLit(requestId)
        .then((res: ExpApprovalHistoryList) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = { historyList: [] };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpApprovalHistoryList, any>;
