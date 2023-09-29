import { Reducer } from 'redux';

import {
  ExpReportIds,
  getPreRequestIdList,
  getReportIdList,
  ReportIdList,
} from '../../../../domain/models/exp/Report';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT_ID_LIST/LIST_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT_ID_LIST/CLEAR_SUCCESS',
};

const listSuccess = (idList: ReportIdList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: idList,
});

const clearSuccess = () => ({ type: ACTIONS.CLEAR_SUCCESS });

export const actions = {
  listIds:
    (isApproved: boolean, empId?: string, isRequest?: boolean) =>
    (dispatch: AppDispatch): Promise<ReportIdList> => {
      const _ = undefined;
      return (
        isRequest
          ? getPreRequestIdList(isApproved, _, empId)
          : getReportIdList(isApproved, _, _, _, empId)
      ).then(({ reportIdList }: ExpReportIds) => {
        dispatch(listSuccess(reportIdList));
        return reportIdList;
      });
    },
  clear: () => (dispatch: AppDispatch) => {
    dispatch(clearSuccess());
  },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ReportIdList, any>;
