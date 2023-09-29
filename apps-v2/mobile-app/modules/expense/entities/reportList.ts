import { Reducer } from 'redux';

import {
  deleteReport,
  getPreRequestList,
  getReportListMobile,
  PreRequestList,
  ReportIdList,
  ReportList,
} from '../../../../domain/models/exp/Report';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT/LIST_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT/CLEAR_SUCCESS',
  DELETE_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT/DELETE_SUCCESS',
  UPDATE_SUCCESS: 'MODULES/EXPENSE/ENTITIES/REPORT/UPDATE_SUCCESS',
};

const listSuccess = (reportList: ReportList | PreRequestList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: reportList,
  };
};

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

const deleteSuccess = (reportId: string) => {
  return {
    type: ACTIONS.DELETE_SUCCESS,
    payload: reportId,
  };
};

const update = (reportList: ReportList) => {
  return {
    type: ACTIONS.UPDATE_SUCCESS,
    payload: reportList,
  };
};

export const actions = {
  list:
    (
      empId: string,
      reportIds: ReportIdList,
      noOfReport?: number,
      isUpdate?: boolean,
      isRequest?: boolean,
      empHistoryIds?: Array<string>
    ) =>
    (dispatch: AppDispatch): Promise<ReportList | PreRequestList> => {
      return (
        (
          isRequest
            ? getPreRequestList(reportIds, noOfReport, empId, empHistoryIds)
            : getReportListMobile(empId, reportIds, noOfReport, empHistoryIds)
        )
          // @ts-ignore
          .then((res: ReportList | PreRequestList) => {
            const action = isUpdate ? update : listSuccess;
            dispatch(action(res));
            return res;
          })
      );
    },

  clear: () => (dispatch: AppDispatch) => {
    dispatch(clearSuccess());
  },

  delete:
    (reportId: string) =>
    (dispatch: AppDispatch): Promise<any> => {
      return deleteReport(reportId).then(() =>
        dispatch(deleteSuccess(reportId))
      );
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return [...state, ...action.payload];
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    case ACTIONS.DELETE_SUCCESS:
      return state.filter((report) => report.reportId !== action.payload);
    default:
      return state;
  }
}) as Reducer<ReportList, any>;
