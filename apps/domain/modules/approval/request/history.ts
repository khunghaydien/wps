import { Dispatch, Reducer } from 'redux';

import {
  ApprovalHistoryList,
  getRequestApprovalHistory,
} from '../../../models/approval/request/History';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/APPROVAL/REQUEST/HISTORY/GET_SUCCESS',
};

const getSuccess = (body: ApprovalHistoryList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (requestId: string) =>
    (dispatch: Dispatch<any>): void | any => {
      return getRequestApprovalHistory(requestId)
        .then((res: ApprovalHistoryList) => dispatch(getSuccess(res)))
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
}) as Reducer<ApprovalHistoryList, any>;
