import { Reducer } from 'redux';

import {
  ExpRequestIdsInfo,
  fetchExpRequestReportIds,
  SearchConditions,
} from '../../../../../domain/models/exp/request/Report';

export const ACTIONS = {
  FETCH_SUCCESS:
    'MODULES/APPROVAL/ENTITIES/EXPENSE/REQUEST_ID_LIST/FETCH_SUCCESS',
  CLEAR_SUCCESS:
    'MODULES/APPROVAL/ENTITIES/EXPENSE/REQUEST_ID_LIST/CLEAR_SUCCESS',
};

type RequestIdList = Array<string>;

const listSuccess = (idList: RequestIdList) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: idList,
});

const clearSuccess = () => ({ type: ACTIONS.CLEAR_SUCCESS });

export const actions = {
  fetchIds:
    (searchCondition: SearchConditions, empId?: string) =>
    (dispatch): Promise<Array<string>> => {
      const _ = undefined;
      return fetchExpRequestReportIds(searchCondition, empId).then(
        ({ requestIdList }: ExpRequestIdsInfo) => {
          dispatch(listSuccess(requestIdList));
          return requestIdList;
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
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<RequestIdList, any>;
