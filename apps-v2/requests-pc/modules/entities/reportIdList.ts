import { Reducer } from 'redux';

import findIndex from 'lodash/findIndex';

import {
  ExpReportIds,
  getPreRequestIdList,
  SearchConditions,
} from '../../../domain/models/exp/Report';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PREREQUEST_ID_LIST/LIST_SUCCESS',
  ADD_NEW_ID: 'MODULES/ENTITIES/PREREQUEST_ID_LIST/ADD_NEW_ID',
  REMOVE_ID: 'MODULES/ENTITIES/PREREQUEST_ID_LIST/REMOVE_ID',
};

const listSuccess = (reportIds: ExpReportIds) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: reportIds,
});

export const actions = {
  list:
    (
      isApproved: boolean,
      advSearchConditions?: SearchConditions,
      empId?: string
    ) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: ExpReportIds; type: string }> => {
      return getPreRequestIdList(isApproved, advSearchConditions, empId).then(
        (res: ExpReportIds) => dispatch(listSuccess(res))
      );
    },
  addNewId: (reportId?: string) => ({
    type: ACTIONS.ADD_NEW_ID,
    payload: reportId,
  }),
  removeId: (reportId?: string) => ({
    type: ACTIONS.REMOVE_ID,
    payload: reportId,
  }),
};

// NOTE: it's not really good to a employee has multiple value.
// Since the API returns multiple values at the same time, we are daringly doing this.
const initialState = {
  totalSize: 0,
  reportIdList: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    case ACTIONS.ADD_NEW_ID:
      return {
        reportIdList: [action.payload, ...state.reportIdList],
        totalSize: state.totalSize + 1,
      };
    case ACTIONS.REMOVE_ID:
      const idx = findIndex(state.reportIdList, action.payload);
      const reportIdListUpdated = Array.from(state.reportIdList);
      if (idx > -1) reportIdListUpdated.splice(idx, 1);
      return {
        totalSize: reportIdListUpdated.length,
        reportIdList: reportIdListUpdated,
      };
    default:
      return state;
  }
}) as Reducer<ExpReportIds, any>;
