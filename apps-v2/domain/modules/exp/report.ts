import { Reducer } from 'redux';

import { findIndex, get } from 'lodash';

import { catchApiError } from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import { ApprovalStatus } from '../../models/approval/request/Status';
import {
  deleteRecord,
  Record,
  saveRecord,
  saveRecordList,
} from '../../models/exp/Record';
import {
  cloneReport,
  createReportFromRequest,
  deleteReport,
  getApprovedRequestReport,
  getReport,
  getReportList,
  initialStateReport,
  Report,
  ReportIdList,
  ReportList,
  ReportListItem,
  saveReport,
  status,
} from '../../models/exp/Report';

import { actions as openTitleActions } from '../../../expenses-pc/modules/ui/expenses/recordListPane/summary/openTitle';
import { PAGE_SIZE } from '../../../expenses-pc/modules/ui/expenses/reportList/page';
import {
  actions as selectedExpReportActions,
  SelectedReportUpdateValues,
} from '@apps/expenses-pc/modules/ui/expenses/selectedExpReport';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/REPORT/LIST_SUCCESS',
  LIST_UPDATE: 'MODULES/ENTITIES/EXP/REPORT/LIST_UPDATE',
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/REPORT/GET_SUCCESS',
  GET_SETTLEMENT_DETAIL_SUCCESS:
    'MODULES/ENTITIES/EXP/REPORT/GET_SETTLEMENT_DETAIL_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/EXP/REPORT/SAVE_SUCCESS',
  LIST_REMOVE: 'MODULES/ENTITIES/EXP/PRE_REQUEST/LIST_REMOVE',
  SAVE: 'MODULES/UI/EXP/REPORT/SAVE',
  DELETE: 'MODULES/UI/EXP/REPORT/DELETE',
  INIT_SUCCESS: 'MODULES/ENTITIES/EXP/PRE_REQUEST/INIT_SUCCESS',
};

export const getStatusText = (sts: string | ApprovalStatus) => {
  switch (sts) {
    case status.NOT_REQUESTED:
      return msg().Com_Status_NotRequested;
    case status.PENDING:
      return msg().Com_Status_Pending;
    case status.APPROVED:
      return msg().Com_Status_Approved;
    case status.REJECTED:
      return msg().Com_Status_Rejected;
    case status.CANCELED:
      return msg().Com_Status_Rejected;
    case status.RECALLED:
      return msg().Com_Status_Recalled;
    case status.CLAIMED:
      return msg().Exp_Status_Claimed;
    case status.DISCARDED:
      return msg().Exp_Status_Discarded;
    case status.APPROVED_PRE_REQUEST:
      return msg().Exp_Status_ApprovedPreRequest;
    case status.ACCOUNTING_AUTHORIZED:
      return msg().Exp_Status_AccountingAuthorized;
    case status.ACCOUNTING_REJECTED:
      return msg().Exp_Status_AccountingRejected;
    case status.JOURNAL_CREATED:
      return msg().Exp_Status_JournalCreated;
    case status.FULLY_PAID:
      return msg().Exp_Status_FullyPaid;
    default:
      return '';
  }
};

const listSuccess = (body: ReportList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: body,
  };
};

const updateList = (report: Report, isNewReport?: boolean) => {
  return {
    type: ACTIONS.LIST_UPDATE,
    payload: { report, isNewReport },
  };
};

const removeFromList = (report: Report) => {
  return {
    type: ACTIONS.LIST_REMOVE,
    payload: report,
  };
};

const getSuccess = (body: Report) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const getSettlementDetailSuccess = (report: ReportListItem) => ({
  type: ACTIONS.GET_SETTLEMENT_DETAIL_SUCCESS,
  payload: { report },
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
      empHistoryId?: string,
      companyId?: string,
      isApproved?: boolean
    ) =>
    (dispatch: AppDispatch, getState): void | any => {
      const getByNumberOfReports = reportIds ? null : PAGE_SIZE;
      return getReportList(reportIds, getByNumberOfReports, empId, empHistoryId)
        .then((res: ReportList) => {
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
            dispatch(listSuccess(res));
          }
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        });
    },
  updateList:
    (report: Report, isNewReport?: boolean) =>
    (dispatch: AppDispatch): void | any => {
      return dispatch(updateList(report, isNewReport));
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
      return getReport(reportId, usedIn)
        .then((res: Report) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  getSettlementDetail:
    (reportIds: ReportIdList) =>
    (dispatch: AppDispatch): Promise<void | SelectedReportUpdateValues> => {
      return getReportList(reportIds)
        .then((res: ReportList) => {
          if (res.length) {
            const { settAmount, settResult } = res[0];
            dispatch(getSettlementDetailSuccess(res[0]));
            return dispatch(
              selectedExpReportActions.updateValues({
                settAmount,
                settResult,
              })
            );
          }
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        });
    },
  save:
    (report: Report, empId: string) =>
    (dispatch: AppDispatch): void | any => {
      return saveReport(report, empId)
        .then((res) => {
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
        })
        .catch((err) => {
          throw err;
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
      return saveRecord(record, reportId, reportTypeId, empId, empHistoryId);
    },
  saveMultiRecords:
    (records: Record[], reportId?: string, reportTypeId?: string) => () => {
      return saveRecordList(records, reportId, reportTypeId);
    },
  deleteRecord:
    (recordIds: Array<string>, empId: string, isUseCashAdvance?: boolean) =>
    () => {
      return deleteRecord(recordIds, empId, isUseCashAdvance);
    },
  createReport:
    (report: Report, empId: string, empHistoryId?: string) => () => {
      return createReportFromRequest(
        report.preRequestId || '',
        empId,
        empHistoryId
      );
    },
  delete: (reportId: string) => () => {
    return deleteReport(reportId).catch((err) => {
      throw err;
    });
  },
  clone: (reportId: string, empId: string, empHistoryId?: string) => () => {
    return cloneReport(reportId, empId, empHistoryId);
  },
  getApprovedRequest:
    (reportId?: string, empId?: string) =>
    (dispatch: AppDispatch): void | any => {
      return getApprovedRequestReport(reportId, empId).then((res: Report) =>
        dispatch(getSuccess(res))
      );
    },
};

export const initialState = {
  expReportList: [],
  expReport: initialStateReport,
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
    case ACTIONS.GET_SETTLEMENT_DETAIL_SUCCESS:
    case ACTIONS.LIST_UPDATE:
      const idx = findIndex(expReportList, {
        reportId: action.payload.report.reportId,
      });

      if (action.payload.isNewReport) {
        // for new created report, update expReportList for pagination
        // when report list number exceeds page size, insert new report on the first and remove the last
        // otherwise only insert new report
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
