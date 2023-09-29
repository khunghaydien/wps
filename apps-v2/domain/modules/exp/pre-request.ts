import { Reducer } from 'redux';

import { findIndex, get } from 'lodash';

import { catchApiError } from '../../../commons/actions/app';

import {
  deletePreRequestRecord,
  Record,
  savePreRequestRecord,
  savePreRrequestRecordList,
} from '../../models/exp/Record';
import {
  cloneRequest,
  deletePreRequest,
  getPreRequest,
  getPreRequestList,
  initialStatePreRequest,
  PreRequestList,
  Report,
  ReportIdList,
  ReportList,
  savePreRequest,
  status,
} from '../../models/exp/Report';

import { actions as openTitleActions } from '../../../requests-pc/modules/ui/expenses/recordListPane/summary/openTitle';
import { PAGE_SIZE } from '../../../requests-pc/modules/ui/expenses/reportList/page';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/PRE_REQUEST/LIST_SUCCESS',
  LIST_UPDATE: 'MODULES/ENTITIES/EXP/PRE_REQUEST/LIST_UPDATE',
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/PRE_REQUEST/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/EXP/PRE_REQUEST/SAVE_SUCCESS',
  LIST_REMOVE: 'MODULES/ENTITIES/EXP/PRE_REQUEST/LIST_REMOVE',
  SAVE: 'MODULES/UI/EXP/PRE_REQUEST/SAVE',
  DELETE: 'MODULES/UI/EXP/PRE_REQUEST/DELETE',
  INIT_SUCCESS: 'MODULES/ENTITIES/EXP/PRE_REQUEST/INIT_SUCCESS',
};

const listSuccess = (reports: PreRequestList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: reports,
  };
};

const updateList = (report: Report, isNewRequest?: boolean) => {
  return {
    type: ACTIONS.LIST_UPDATE,
    payload: { report, isNewRequest },
  };
};

const removeFromList = (report: Report) => {
  return {
    type: ACTIONS.LIST_REMOVE,
    payload: report,
  };
};

const getSuccess = (body: any) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const saveSuccess = (body: Report) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const initialize = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

export const actions = {
  list:
    (
      reportIds?: ReportIdList,
      empId?: string,
      companyId?: string,
      isApproved?: boolean
    ) =>
    (dispatch: AppDispatch, getState): void | any => {
      const getByNumberOfReports = reportIds ? null : PAGE_SIZE;

      return getPreRequestList(reportIds, getByNumberOfReports, empId)
        .then((preRequests: PreRequestList) => {
          const currentState = getState();
          const currentCompanyTab = get(
            currentState,
            'ui.expenses.tab.companyId'
          );
          const currentTabIsApproval = get(
            currentState,
            'ui.expenses.tab.isApproval',
            false
          );
          const isSameCompany = currentCompanyTab === companyId;
          const isSameStatus = currentTabIsApproval === isApproved;
          const updateList = companyId ? isSameCompany && isSameStatus : true;
          if (updateList) {
            dispatch(listSuccess(preRequests));
          }
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        });
    },
  updateList:
    (report: Report, isNewRequest?: boolean) =>
    (dispatch: AppDispatch): void | any => {
      return dispatch(updateList(report, isNewRequest));
    },
  removeFromList: (report: Report) => (dispatch: AppDispatch) => {
    return dispatch(removeFromList(report));
  },
  initialize:
    () =>
    (dispatch: AppDispatch): { payload: any[]; type: string } => {
      return dispatch(initialize());
    },
  get:
    (reportId?: string, usedIn?: string) =>
    (dispatch: AppDispatch): void | any => {
      return getPreRequest(reportId, usedIn).then((res: Report) =>
        dispatch(getSuccess(res))
      );
    },
  save:
    (report: Report, empId: string) =>
    (dispatch: AppDispatch): void | any => {
      return savePreRequest(report, empId).then((res) => {
        const isNew = !report.reportId;
        const preStatus = report.status;
        report.reportId = res.reportId;
        if (preStatus !== status.RECALLED && preStatus !== status.REJECTED) {
          report.status = status.NOT_REQUESTED;
        }
        dispatch(saveSuccess(report));
        if (isNew) {
          dispatch(openTitleActions.close());
        }
      });
    },
  saveRecord:
    (
      record: Record,
      reportId: string,
      reportTypeId: string,
      empId: string,
      empHistoryId?: string
    ) =>
    () => {
      return savePreRequestRecord(
        record,
        reportId,
        reportTypeId,
        empId,
        empHistoryId
      );
    },
  saveMultiRecords:
    (records: Record[], reportId?: string, reportTypeId?: string) => () => {
      return savePreRrequestRecordList(records, reportId, reportTypeId);
    },
  deleteRecord: (recordIds: Array<string>) => () => {
    return deletePreRequestRecord(recordIds);
  },
  delete: (reportId?: string) => () => {
    return deletePreRequest(reportId);
  },
  clone: (reportId: string, empId: string, empHistoryId?: string) => () => {
    return cloneRequest(reportId, empId, empHistoryId);
  },
};

const initialState = {
  expReportList: [],
  expReport: initialStatePreRequest,
};

type State = {
  expReport: Report;
  expReportList: ReportList;
};

export default ((state = initialState, action) => {
  const expReportList = state.expReportList;
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        expReportList: action.payload,
      };
    case ACTIONS.LIST_REMOVE:
      const index = findIndex(expReportList, {
        reportId: action.payload.reportId,
      });
      const expReportListUpdated = Array.from(expReportList);
      if (index > -1) expReportListUpdated.splice(index, 1);
      return {
        ...state,
        expReportList: expReportListUpdated,
      };
    case ACTIONS.LIST_UPDATE:
      const idx = findIndex(expReportList, {
        reportId: action.payload.report.reportId,
      });

      if (action.payload.isNewRequest) {
        // for new created prerequest, update expReportList for pagination
        const endIdx =
          expReportList.length < PAGE_SIZE
            ? expReportList.length
            : expReportList.length - 1;
        return {
          ...state,
          expReportList: [
            action.payload.report,
            ...expReportList.slice(0, endIdx),
          ],
        };
      } // if report is not inside current page list(pagination), list data will update when user clicks 'back to list'

      if (idx !== -1) {
        expReportList[idx] = action.payload.report;
      }

      return {
        ...state,
        expReportList,
      };
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
      return {
        ...state,
        expReport: action.payload,
      };
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        expReportList: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
