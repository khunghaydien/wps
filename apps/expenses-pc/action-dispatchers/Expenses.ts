import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import appName from '../../commons/constants/appName';
import expModuleType from '@apps/commons/constants/expModuleType';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg, { getMsgByBrowserLang } from '../../commons/languages';
import { showToast } from '../../commons/modules/toast';
import UrlUtil from '../../commons/utils/UrlUtil';
import { actions as reportDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as extraConditionsActions } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as submitDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';
import { actions as subjectActions } from '@commons/modules/exp/ui/reportList/advSearch/subject';
import { actions as vendorIdsActions } from '@commons/modules/exp/ui/reportList/advSearch/vendorIds';
import TextUtil from '@commons/utils/TextUtil';

import {
  EmployeeList,
  getEmployeeList,
} from '../../domain/models/common/Employee';
import { AccountingPeriodList } from '../../domain/models/exp/AccountingPeriod';
import { DefaultCostCenter } from '../../domain/models/exp/CostCenter';
import { getTransactionHistory } from '../../domain/models/exp/CreditCard';
import {
  getRequestTypes,
  SearchCondition,
  searchCustomRequestList,
} from '../../domain/models/exp/CustomRequest';
import { ExpenseReportType } from '../../domain/models/exp/expense-report-type/list';
import {
  CustomEIOptionList,
  getCustomEIOptionList,
} from '../../domain/models/exp/ExtendedItem';
// Pagination
// temporarily import from FA because we haven't start work on Sort, Order and AdvSearch for Expense and Request yet. Remove it when we start
import { OrderBy, SortBy } from '../../domain/models/exp/FinanceApproval';
import {
  expenseListArea,
  expensesArea,
  expFormArea,
  Report,
  ReportIdList,
  ReportListItem,
  SearchConditions,
  status as appStatus,
} from '../../domain/models/exp/Report';
import {
  getIcCardTransactionHistory,
  getTransitCards,
} from '../../domain/models/exp/TransportICCard';
import {
  cloneRecord,
  Record,
  RecordListSaveResponseType,
} from '@apps/domain/models/exp/Record';

import {
  DefaultCostCenterInfo,
  getDefaultCostCenter,
} from '../../domain/modules/exp/cost-center/defaultCostCenter';
import { setAvailableExpType } from '../../domain/modules/exp/expense-type/availableExpType';
import { actions as preRequestActions } from '../../domain/modules/exp/pre-request';
import { actions as expReportActions } from '../../domain/modules/exp/report';
import { actions as requestApprovalActions } from '../../domain/modules/exp/request/pre-request';
import { actions as requestActions } from '../../domain/modules/exp/request/report';
import { AppDispatch } from '../modules/AppThunk';
import { actions as reportIdListActions } from '../modules/entities/reportIdList';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as recordUpdatedActions } from '../modules/ui/expenses/dialog/recordUpdated/dialog';
import { actions as modeActions } from '../modules/ui/expenses/mode';
import { actions as overlapActions } from '../modules/ui/expenses/overlap';
import { actions as openTitleActions } from '../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as orderByActions } from '../modules/ui/expenses/reportList/orderBy';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/expenses/reportList/page';
import { actions as sortByActions } from '../modules/ui/expenses/reportList/sortBy';
import { set as setReportTypeLoading } from '../modules/ui/expenses/reportTypeLoading';
import { actions as selectedExpReportActions } from '../modules/ui/expenses/selectedExpReport';
import { actions as tabActions } from '../modules/ui/expenses/tab';
import { actions as viewAction } from '../modules/ui/expenses/view';
import { actions as reportTypeFetchActions } from '@apps/domain/modules/exp/expense-report-type/list';

import { getReportTypeWithLinkedExpType } from './ReportType';

const getActiveReportTypes = (
  reportTypeList: Array<ExpenseReportType> | null | undefined
) => (reportTypeList ? reportTypeList.filter((rt) => rt.active) || null : null);

const getReport = (
  status?: string,
  reportId?: string,
  empId?: string
): void | any =>
  status === appStatus.APPROVED_PRE_REQUEST
    ? expReportActions.getApprovedRequest(reportId, empId)
    : expReportActions.get(reportId, 'REPORT');

/* Report List */
const loadHomePageReports = (empId?: string) => (dispatch: AppDispatch) => {
  const loadingHint = TextUtil.template(
    getMsgByBrowserLang().Exp_Lbl_LoadingActive,
    getMsgByBrowserLang().Exp_Lbl_Report
  );
  dispatch(
    loadingStart({
      areas: expensesArea,
      loadingHint,
    })
  );
  dispatch(expReportActions.list(null, empId)).then(() => {
    dispatch(loadingEnd(expensesArea));
  });
};

// Pagination
export const fetchExpReportIdList =
  (
    isApproved: boolean,
    empId?: string,
    sortBy?: SortBy,
    orderBy?: OrderBy,
    advSearchConditions?: SearchConditions,
    isHomePage?: boolean,
    withoutLoading?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (isHomePage) {
      dispatch(loadHomePageReports(empId));
    }
    if (!withoutLoading) {
      dispatch(loadingStart({ areas: expenseListArea }));
    }
    return dispatch(
      reportIdListActions.list(
        isApproved,
        sortBy,
        orderBy,
        advSearchConditions,
        empId
      )
    )
      .then((res) => {
        // if there are reports, list up to page size and set page
        if (!isHomePage) {
          if (res.payload.reportIdList.length > 0) {
            dispatch(
              expReportActions.list(
                res.payload.reportIdList.slice(0, PAGE_SIZE),
                empId
              )
            ).then(() => {
              dispatch(pageActions.set(1));
              if (!withoutLoading) {
                dispatch(loadingEnd(expenseListArea));
              }
              if (sortBy && orderBy) {
                dispatch(sortByActions.set(sortBy));
                dispatch(orderByActions.set(orderBy));
              }
            });
          } else if (res.payload.reportIdList.length === 0) {
            dispatch(expReportActions.initialize());
            if (!withoutLoading) {
              dispatch(loadingEnd(expenseListArea));
            }
          }
        } else {
          if (!withoutLoading) {
            dispatch(loadingEnd(expenseListArea));
          }
        }
      })
      .catch((err) => {
        if (!withoutLoading) {
          dispatch(loadingEnd(expenseListArea));
        }
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

export const fetchExpReportList =
  (reportIdList: ReportIdList, pageNum: number, empId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ areas: expenseListArea }));
    return dispatch(
      expReportActions.list(
        reportIdList.slice(PAGE_SIZE * (pageNum - 1), PAGE_SIZE * pageNum),
        empId
      )
    )
      .then(() => dispatch(pageActions.set(pageNum)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd(expenseListArea)));
  };

export const backFromDetailToList =
  (
    reportIdList: ReportIdList,
    currentRequestIdx: number,
    expReportList: Array<ReportListItem>,
    empId: string
  ) =>
  (dispatch: AppDispatch) => {
    const isNewReport = currentRequestIdx === -1;
    const pageNum = Math.ceil((currentRequestIdx + 1) / PAGE_SIZE);

    dispatch(overlapActions.nonOverlapReport());

    if (isNewReport) {
      dispatch(modeActions.reportSelect());
    } else {
      // only fetch id-list API when reportId is not inside expReportList
      const isCurrentReportOnList = expReportList.find(
        (exp) => exp.reportId === reportIdList[currentRequestIdx]
      );
      if (!isCurrentReportOnList) {
        dispatch(fetchExpReportList(reportIdList, pageNum, empId));
      }
    }
  };

/* Pre-Request */

export const searchCustomRequests =
  (searchCondition: SearchCondition) => (dispatch) => {
    return searchCustomRequestList(searchCondition).catch((err) =>
      dispatch(catchApiError(err, { isContinuable: true }))
    );
  };

export const getCustomRequestTypes = () => (dispatch: AppDispatch) => {
  return getRequestTypes().catch((err) =>
    dispatch(catchApiError(err, { isContinuable: true }))
  );
};

/**
 * Discard Approved Pre-Request
 *
 * @param {string} requestId
 * @param {string} empId
 */
export const discardApprovedRequest =
  (requestId: string, empId: string) => (dispatch) => {
    dispatch(loadingStart());
    dispatch(requestApprovalActions.discard(requestId))
      .then(() => {
        Promise.all([
          dispatch(fetchExpReportIdList(false, empId)),
          dispatch(modeActions.initialize()),
          dispatch(selectedExpReportActions.clear()),
          dispatch(overlapActions.nonOverlapReport()),
          dispatch(viewAction.setListView()),
        ]);
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

/*  Report */

export const createNewExpReport =
  (
    reportTypeList?: Array<ExpenseReportType>,
    defaultCostCenter?: DefaultCostCenter
  ) =>
  (dispatch: AppDispatch) => {
    const reportType = reportTypeList
      ? reportTypeList
          .filter((rt) => !rt.requestRequired)
          .find((rt) => rt.active) || null
      : null;
    dispatch(modeActions.reportSelect());
    dispatch(
      selectedExpReportActions.newReport({
        defaultCostCenter,
        reportType,
      })
    );
  };

/**
 * Create Expense Report from Approved Pre-request
 *
 * @param {Report} expReport
 * @param {?Array<ExpenseReportType>} reportTypeList
 * @param {string} empId
 */
export const createReportFromRequest =
  (
    expReport: Report,
    reportTypeList: Array<ExpenseReportType> | null | undefined,
    empId: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(expReportActions.createReport(expReport, empId))
      .then((result) => {
        const { updatedRecords, reportId } = result;
        if (updatedRecords.length > 0) {
          dispatch(recordUpdatedActions.setCloneUpdate(updatedRecords));
        }
        const _ = undefined;
        Promise.all([
          dispatch(fetchExpReportIdList(false, empId, _, _, _, _, true)),
          dispatch(expReportActions.get(reportId, 'REPORT')).then(
            (saveExpReportResult) => {
              saveExpReportResult.payload.isCostCenterChangedManually = true;
              dispatch(
                selectedExpReportActions.select(
                  saveExpReportResult.payload,
                  getActiveReportTypes(reportTypeList)
                )
              );
              dispatch(modeActions.reportSelect());
            }
          ),
        ])
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => {
            dispatch(overlapActions.nonOverlapRecord());
            dispatch(loadingEnd());
            if (!isEmpty(updatedRecords)) {
              dispatch(activeDialogActions.recordUpdated());
            }
          });
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
      });
  };

export const isNotDefaultCostCenter =
  (
    costCenterCode: string,
    date: string,
    defaultCostCenterList: DefaultCostCenterInfo[],
    empId: string
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const defaultCostCenter = find(defaultCostCenterList, {
      date,
    });
    if (!defaultCostCenter && empId) {
      const res = await dispatch(getDefaultCostCenter(empId, date));
      return costCenterCode && get(res, 'costCenterCode') !== costCenterCode;
    } else {
      return (
        costCenterCode &&
        get(defaultCostCenter, 'costCenter.costCenterCode') !== costCenterCode
      );
    }
  };

export const fetchExpReport =
  (
    status: string,
    reportId: string,
    reportTypeList?: Array<ExpenseReportType>,
    empId?: string,
    defaultCostCenterList?: Array<DefaultCostCenterInfo>,
    companyId?: string,
    accountingPeriods?: AccountingPeriodList
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(
      loadingStart({
        areas: expFormArea,
        loadingHint: msg().Exp_Msg_FetchingReport,
      })
    );
    dispatch(setReportTypeLoading(true));
    dispatch(getReport(status, reportId, empId))
      .then((result) => {
        dispatch(loadingEnd(expFormArea));
        dispatch(
          selectedExpReportActions.select(result.payload, reportTypeList)
        );
        dispatch(modeActions.reportSelect());
        // check default cost center
        const { accountingDate, expReportTypeId } = result.payload;
        const targetReportType = find(reportTypeList, ['id', expReportTypeId]);
        const needDefaultCostCenter =
          targetReportType?.isCostCenterRequired !== 'UNUSED';
        // no need to fetch report type for includeLinkedExpenseTypeIds if report type is read only
        dispatch(
          getReportTypeWithLinkedExpType(
            result.payload,
            accountingPeriods,
            companyId
          )
        ).then((res) => {
          dispatch(setAvailableExpType(get(res, 'expTypeIds') || []));
          dispatch(setReportTypeLoading(false));
        });
        if (!targetReportType) {
          // if report type is invalid, fetch report type for cc/vendor/job display
          dispatch(
            reportTypeFetchActions.fetchInvalidReportType(
              expReportTypeId,
              companyId,
              expModuleType.REPORT
            )
          );
        }
        if (needDefaultCostCenter) {
          const currentCC = get(result.payload, 'costCenterCode');
          dispatch(
            isNotDefaultCostCenter(
              currentCC,
              accountingDate,
              defaultCostCenterList,
              empId
            )
          )
            // @ts-ignore
            .then((isCostCenterChangedManually: boolean) => {
              result.payload.isCostCenterChangedManually =
                isCostCenterChangedManually;
              dispatch(
                selectedExpReportActions.select(result.payload, reportTypeList)
              );
            });
        }
      })
      .catch((err) => {
        // if we couldn't get report, try using preApproved instead
        if (!status && err.errorCode === 'EXP_NOT_FOUND_REPORT') {
          dispatch(
            fetchExpReport(
              appStatus.APPROVED_PRE_REQUEST,
              reportId,
              reportTypeList,
              empId,
              defaultCostCenterList,
              companyId,
              accountingPeriods
            )
          );
        } else {
          dispatch(catchApiError(err, { isContinuable: true }));
          dispatch(loadingEnd(expFormArea));
          dispatch(setReportTypeLoading(false));
        }
      });
  };

// 保存
export const saveExpReport =
  (
    expReport: Report,
    reportTypeList: Array<ExpenseReportType> | null | undefined,
    expReportList: Array<ReportListItem>,
    reportIdList: Array<string>,
    empId: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingReport }));
    const isNewReport = !expReport.reportId;
    return dispatch(expReportActions.save(expReport, empId))
      .then(() => {
        // for new created report, it's going to be the first one in the report list
        // for the excisting report, it remains the same place as ordered
        if (isNewReport) {
          // update reportIdList
          dispatch(reportIdListActions.addNewId(expReport.reportId));
          // update expReportList for pagination
          // if current page list is not the first page, fetch the first page list and update
          const isListInFirstPage =
            reportIdList.length === 0 ||
            reportIdList[0] === expReportList[0].reportId;
          if (isListInFirstPage) {
            dispatch(expReportActions.updateList(expReport, true));
          } else {
            dispatch(
              expReportActions.list(reportIdList.slice(0, PAGE_SIZE), empId)
            ).then(() =>
              dispatch(expReportActions.updateList(expReport, true))
            );
          }
          dispatch(pageActions.set(1));
        } else {
          dispatch(expReportActions.updateList(expReport));
        }
        dispatch(
          selectedExpReportActions.select(
            expReport,
            getActiveReportTypes(reportTypeList)
          )
        );
        dispatch(modeActions.reportSelect());
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(showToast(msg().Exp_Lbl_ReportIsSaved));
        dispatch(loadingEnd());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
      });
  };

export const cloneReport =
  (
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    empId: string,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(expReportActions.clone(reportId, empId))
      .then((result) => {
        dispatch(showToast(msg().Exp_Msg_CloneReport));
        return Promise.all([
          dispatch(fetchExpReportIdList(false, empId)),
          dispatch(
            expReportActions.get((result as any).reportId, 'REPORT')
          ).then((saveExpReportResult) => {
            saveExpReportResult.payload.isCostCenterChangedManually =
              !!isCostCenterChangedManually;
            dispatch(
              selectedExpReportActions.select(
                saveExpReportResult.payload,
                getActiveReportTypes(reportTypeList)
              )
            );
            dispatch(modeActions.reportSelect());
            dispatch(openTitleActions.open());
          }),
        ])
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => {
            dispatch(overlapActions.nonOverlapRecord());
            dispatch(loadingEnd());
            dispatch(tabActions.setActive());
          });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

export const cloneReportAsRequest =
  (reportId: string, empId: string, isFromFA: boolean) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(preRequestActions.clone(reportId, empId))
      .then((result) => {
        UrlUtil.openApp(appName.REQUESTS, {
          id: (result as any).reportId,
          isCloned: 'true',
          isFromFA: isFromFA.toString(),
        });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

// 申請削除
export const deleteExpReport =
  (reportId: string, empId?: string) => (dispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingReport }));
    return dispatch(expReportActions.delete(reportId))
      .then(() => {
        Promise.all([
          dispatch(fetchExpReportIdList(false, empId)),
          dispatch(modeActions.initialize()),
          dispatch(selectedExpReportActions.clear()),
          dispatch(overlapActions.nonOverlapReport()),
          dispatch(viewAction.setListView()),
        ]);
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

// 申請
export const submitExpReport =
  (
    reportId: string,
    comment: string,
    empId: string,
    isCostCenterChangedManually: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SubmittingReport }));
    dispatch(activeDialogActions.hide());
    return dispatch(requestActions.submit(reportId, comment, empId))
      .then(() => {
        const _ = undefined;
        return Promise.all([
          dispatch(fetchExpReportIdList(false, empId, _, _, _, _, true)),
          dispatch(expReportActions.get(reportId)).then(
            (submitExpReportResult) => {
              const report = {
                ...submitExpReportResult.payload,
                isCostCenterChangedManually,
              };
              dispatch(selectedExpReportActions.select(report));
              dispatch(modeActions.reportSelect());
            }
          ),
        ])
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()));
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
      });
  };

/**
 * Recall submitted report
 *
 * @param {string} requestId
 * @param {string} comment
 * @param {string} empId
 * @param {string} reportId
 * @param {Array<ExpenseReportType>} reportTypeList
 */
export const cancelExpReportRequest =
  (
    requestId: string,
    comment: string,
    empId: string,
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    isCostCenterChangedManually: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return dispatch(requestActions.cancel(requestId, comment))
      .then(() => {
        const _ = undefined;
        Promise.all([
          dispatch(fetchExpReportIdList(false, empId, _, _, _, _, true)),
          dispatch(expReportActions.get(reportId)).then((res) => {
            const report = { ...res.payload, isCostCenterChangedManually };
            dispatch(selectedExpReportActions.select(report, reportTypeList));
          }),
        ])
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()));
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
      });
  };

/* Record */

export const saveExpRecord =
  (
    recordItem: Record,
    reportTypeList: Array<ExpenseReportType> | null | undefined,
    report: Report,
    empId: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRecord }));
    }

    const reportId = report.reportId || '';
    const expReportTypeId = report.expReportTypeId || '';

    return dispatch(
      expReportActions.saveRecord(recordItem, reportId, expReportTypeId, empId)
    )
      .then((res) => {
        if (res.updatedReportAmount) {
          report.totalAmount = res.updatedReportAmount;
        }
        const idx = report.records.findIndex(
          (x) => x.recordId === res.recordId || x.recordId === null
        );
        // update for record list
        report.records[idx].recordId = res.recordId;
        report.records[idx].items[0].expTypeDescription =
          recordItem.items[0].expTypeDescription;
        report.records[idx].items[0].currencyInfo =
          recordItem.items[0].currencyInfo;
        report.records[idx].items[0].taxTypeName =
          recordItem.items[0].taxTypeName;
        report.records[idx].items[0].taxRate = recordItem.items[0].taxRate;
        report.records[idx].items[0].fixedAllowanceOptionLabel =
          recordItem.items[0].fixedAllowanceOptionLabel;
        report.records[idx].items[0].costCenterHistoryId =
          recordItem.items[0].costCenterHistoryId;
        report.records[idx].items[0].costCenterName =
          recordItem.items[0].costCenterName;
        report.records[idx].items[0].jobId = recordItem.items[0].jobId;
        report.records[idx].items[0].jobName = recordItem.items[0].jobName;
        report.records[idx].items[0].jctRegistrationNumber =
          recordItem.items[0].jctRegistrationNumber;
        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(selectedExpReportActions.select(report, reportTypeList));
        dispatch(expReportActions.updateList(report));
        dispatch(modeActions.reportSelect());
        if (!loadInBackground) {
          dispatch(overlapActions.nonOverlapRecord());
          dispatch(loadingEnd());
        }
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

// save multiple record
export const saveMultiRecord =
  (records: Record[], report: Report) =>
  (dispatch: AppDispatch): Promise<RecordListSaveResponseType | void> => {
    dispatch(loadingStart());

    const { reportId = '', expReportTypeId = '' } = report;
    return dispatch(
      expReportActions.saveMultiRecords(records, reportId, expReportTypeId)
    )
      .then((res) => {
        const updatedReport = { ...report };
        const { recordIds, updatedReportAmount } = res;
        if (updatedReportAmount) {
          updatedReport.totalAmount = updatedReportAmount;
        }
        records.forEach((record, idx) => {
          record.recordId = recordIds[idx];
        });
        // insert newly added records
        const updatedRecords = [...records, ...(updatedReport.records || [])];
        updatedReport.records = updatedRecords;
        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(selectedExpReportActions.select(updatedReport));
        dispatch(expReportActions.updateList(updatedReport));
        dispatch(modeActions.reportSelect());
        dispatch(overlapActions.nonOverlapRecord());
        return res;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const cloneRecords =
  (
    targetDates: Array<string>,
    recordIds: Array<string>,
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    numberOfDays?: number,
    empId?: string,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return cloneRecord(recordIds, targetDates, numberOfDays, empId)
      .then((cloneRes) => {
        if (cloneRes.updatedRecords.length > 0) {
          dispatch(
            recordUpdatedActions.setCloneUpdate(cloneRes.updatedRecords)
          );
        }
        return dispatch(expReportActions.get(reportId, 'REPORT')).then(
          (res) => {
            const report = { ...res.payload, isCostCenterChangedManually };
            dispatch(selectedExpReportActions.select(report, reportTypeList));
            dispatch(expReportActions.updateList(res.payload));
            dispatch(modeActions.reportSelect());
            return cloneRes;
          }
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

export const deleteExpRecord =
  (recordIds: Array<string>, empId: string) => (dispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingRecord }));
    return dispatch(expReportActions.deleteRecord(recordIds, empId))
      .then(() => {
        dispatch(fetchExpReportIdList(false, empId));
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

export const searchEILookup =
  (id: string, query: string, companyId?: string) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return getCustomEIOptionList(id, query, companyId)
      .then((result: CustomEIOptionList) => {
        dispatch(dialogLoadingActions.toggle(false));
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const getCreditCardTransactions =
  (
    companyId: string,
    empId: string,
    from?: string,
    to?: string,
    cardNameList?: Array<string>
  ) =>
  (dispatch: AppDispatch) => {
    return getTransactionHistory(
      companyId,
      empId,
      from,
      to,
      cardNameList
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const getIcCardList =
  (
    salesId: string,
    customerId: string,
    companyId: string,
    employeeCode: string
  ) =>
  (dispatch: AppDispatch) => {
    return getTransitCards(salesId, customerId, companyId, employeeCode).catch(
      (err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      }
    );
  };

export const getICCardTransactions =
  (
    salesId: string,
    customerId: string,
    companyId: string,
    employeeCode: string,
    from?: string,
    to?: string
  ) =>
  (dispatch: AppDispatch) => {
    return getIcCardTransactionHistory(
      salesId,
      customerId,
      companyId,
      employeeCode,
      from,
      to
    ).catch((err) => {
      dispatch(catchApiError(err, { isContinuable: true }));
    });
  };

export const clearSearchConditions = () => (dispatch: AppDispatch) => {
  dispatch(vendorIdsActions.clear());
  dispatch(amountActions.clear());
  dispatch(reportTypeActions.clear());
  dispatch(reportDateActions.clear());
  dispatch(subjectActions.clear());
  dispatch(reportNoActions.clear());
  dispatch(extraConditionsActions.clear());
  dispatch(submitDateActions.clear());
};

export const searchEmployees =
  (
    companyId?: string,
    targetDate?: string,
    limitNumber?: number,
    searchString?: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }
    return getEmployeeList(companyId, targetDate, limitNumber, searchString)
      .then((result: EmployeeList) => {
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };
