import find from 'lodash/find';
import get from 'lodash/get';

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

import { DefaultCostCenter } from '../../domain/models/exp/CostCenter';
import { ExpenseReportType } from '../../domain/models/exp/expense-report-type/list';
import {
  CustomEIOptionList,
  getCustomEIOptionList,
} from '../../domain/models/exp/ExtendedItem';
import { clonePreRequestRecord, Record } from '../../domain/models/exp/Record';
import {
  expenseListArea,
  expensesArea,
  expFormArea,
  Report,
  ReportIdList,
  ReportListItem,
  SearchConditions,
} from '../../domain/models/exp/Report';

// default cost center
import {
  DefaultCostCenterInfo,
  getDefaultCostCenter,
} from '../../domain/modules/exp/cost-center/defaultCostCenter';
import { setAvailableExpType } from '../../domain/modules/exp/expense-type/availableExpType';
import { actions as expPreRequestActions } from '../../domain/modules/exp/pre-request';
import { actions as preRequestActions } from '../../domain/modules/exp/request/pre-request';
import { AppDispatch } from '../modules/AppThunk';
// Pagination
import { actions as reportIdListActions } from '../modules/entities/reportIdList';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as recordUpdatedActions } from '../modules/ui/expenses/dialog/recordUpdated/dialog';
import { actions as modeActions } from '../modules/ui/expenses/mode';
import { actions as overlapActions } from '../modules/ui/expenses/overlap';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/expenses/reportList/page';
import { set as setReportTypeLoading } from '../modules/ui/expenses/reportTypeLoading';
import { actions as selectedExpReportActions } from '../modules/ui/expenses/selectedExpReport';
import { actions as tabActions } from '../modules/ui/expenses/tab';
import { actions as viewAction } from '../modules/ui/expenses/view';
import { actions as reportTypeFetchActions } from '@apps/domain/modules/exp/expense-report-type/list';

// report type with expense type
import { getReportTypeWithLinkedExpType } from './ReportType';

const getActiveReportTypes = (reportTypeList?: Array<ExpenseReportType>) =>
  reportTypeList ? reportTypeList.filter((rt) => rt.active) || null : null;

export const createNewExpReport =
  (
    reportTypeList: Array<ExpenseReportType>,
    defaultCostCenter: DefaultCostCenter
  ) =>
  (dispatch: AppDispatch) => {
    const reportType = reportTypeList
      ? reportTypeList.find((rt) => rt.active) || null
      : null;

    dispatch(modeActions.reportSelect());
    dispatch(
      selectedExpReportActions.newReport({
        defaultCostCenter,
        reportType,
      })
    );
  };

const loadHomePageReports = (empId?: string) => (dispatch: AppDispatch) => {
  const loadingHint = TextUtil.template(
    getMsgByBrowserLang().Exp_Lbl_LoadingActive,
    getMsgByBrowserLang().Exp_Lbl_RequestTarget
  );
  dispatch(loadingStart({ areas: expensesArea, loadingHint }));
  dispatch(expPreRequestActions.list(null, empId)).then(() => {
    dispatch(loadingEnd(expensesArea));
  });
};

// Pagination
export const fetchExpReportIdList =
  (
    isApproved: boolean,
    empId?: string,
    advSearchConditions?: SearchConditions,
    isHomePage?: boolean,
    isWithoutLoading?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (isHomePage) {
      dispatch(loadHomePageReports(empId));
    }
    if (!isWithoutLoading) dispatch(loadingStart({ areas: expenseListArea }));
    return dispatch(
      reportIdListActions.list(
        isApproved,
        (isApproved && advSearchConditions) || null,
        empId
      )
    )
      .then((res) => {
        if (!isHomePage) {
          // if there are reports, list up to page size and set page
          if (res.payload.reportIdList.length > 0) {
            dispatch(
              expPreRequestActions.list(
                res.payload.reportIdList.slice(0, PAGE_SIZE),
                empId
              )
            ).then(() => {
              dispatch(pageActions.set(1));
              if (!isWithoutLoading) dispatch(loadingEnd(expenseListArea));
            });
          } else if (res.payload.reportIdList.length === 0) {
            dispatch(expPreRequestActions.initialize());
            if (!isWithoutLoading) dispatch(loadingEnd(expenseListArea));
          }
        } else {
          if (!isWithoutLoading) dispatch(loadingEnd(expenseListArea));
        }
      })
      .catch((err) => {
        if (!isWithoutLoading) dispatch(loadingEnd(expenseListArea));
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

export const fetchExpReportList =
  (reportIdList: ReportIdList, pageNum: number, empId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ areas: expenseListArea }));
    return dispatch(
      expPreRequestActions.list(
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

export const cloneReport =
  (
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    empId: string,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(expPreRequestActions.clone(reportId, empId))
      .then((result) => {
        dispatch(showToast(msg().Exp_Msg_CloneReport));
        return Promise.all([
          dispatch(fetchExpReportIdList(false, empId)),
          dispatch(
            expPreRequestActions.get((result as any).reportId, 'REQUEST')
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
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    employeeId: string,
    defaultCostCenterList: Array<DefaultCostCenterInfo>,
    companyId: string,
    isCloned: boolean,
    isFromFA?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(
      loadingStart({
        areas: expFormArea,
        loadingHint: msg().Exp_Msg_FetchingRequest,
      })
    );
    dispatch(setReportTypeLoading(true));
    dispatch(expPreRequestActions.get(reportId, 'REQUEST'))
      .then((result) => {
        const { scheduledDate, expReportTypeId } = result.payload;
        dispatch(loadingEnd(expFormArea));
        dispatch(
          selectedExpReportActions.select(result.payload, reportTypeList)
        );
        dispatch(modeActions.reportSelect());
        const targetReportType = find(reportTypeList, ['id', expReportTypeId]);
        dispatch(
          getReportTypeWithLinkedExpType(result.payload, companyId)
        ).then((res) => {
          dispatch(setAvailableExpType(get(res, 'expTypeIds') || []));
          dispatch(setReportTypeLoading(false));
        });
        if (!targetReportType) {
          dispatch(
            reportTypeFetchActions.fetchInvalidReportType(
              expReportTypeId,
              companyId,
              expModuleType.REQUEST
            )
          );
        }
        const needDefaultCostCenter =
          scheduledDate && targetReportType?.isCostCenterRequired !== 'UNUSED';
        if (needDefaultCostCenter) {
          const currentCC = get(result.payload, 'costCenterCode');
          dispatch(
            isNotDefaultCostCenter(
              currentCC,
              scheduledDate,
              defaultCostCenterList,
              employeeId
            )
          )
            // @ts-ignore
            .then((isCostCenterChangedManually: boolean) => {
              result.payload.isCostCenterChangedManually =
                isCostCenterChangedManually;
              dispatch(
                selectedExpReportActions.select(result.payload, reportTypeList)
              );
              dispatch(modeActions.reportSelect());
            });
        }
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd(expFormArea));
        dispatch(setReportTypeLoading(false));
      })
      .finally(() => {
        if (isCloned && !isFromFA) {
          dispatch(showToast(msg().Exp_Msg_CloneReport));
        }
      });
  };

// 保存
export const saveExpReport =
  (
    expReport: Report,
    reportTypeList: Array<ExpenseReportType>,
    expReportList: Array<ReportListItem>,
    reportIdList: Array<string>,
    empId: string
  ) =>
  (dispatch: AppDispatch) => {
    const isNewReport = expReport.reportId;
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRequest }));
    return dispatch(expPreRequestActions.save(expReport, empId))
      .then(() => {
        // for new created report, it's going to be the first one in the report list
        // for the excisting report, it remains the same place as ordered
        if (!isNewReport) {
          // update pagination reportIdList
          dispatch(reportIdListActions.addNewId(expReport.reportId));
          // update expReportList for pagination
          // if current list is not the first page, fetch the first page list and update
          const isListInFirstPage =
            reportIdList.length === 0 ||
            reportIdList[0] === expReportList[0].reportId;
          if (isListInFirstPage) {
            dispatch(expPreRequestActions.updateList(expReport, true));
          } else {
            dispatch(
              expPreRequestActions.list(reportIdList.slice(0, PAGE_SIZE), empId)
            ).then(() =>
              dispatch(expPreRequestActions.updateList(expReport, true))
            );
          }
          dispatch(pageActions.set(1));
        } else {
          dispatch(expPreRequestActions.updateList(expReport));
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

export const saveExpRecord =
  (
    recordItem: Record,
    reportTypeList: Array<ExpenseReportType>,
    report: Report,
    empId: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRecord }));
    const reportId = report.reportId || '';
    const expReportTypeId = report.expReportTypeId || '';
    return dispatch(
      expPreRequestActions.saveRecord(
        recordItem,
        reportId,
        expReportTypeId,
        empId
      )
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
        dispatch(expPreRequestActions.updateList(report));
        dispatch(modeActions.reportSelect());
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(loadingEnd());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
      });
  };

// 申請削除
export const deleteExpReport =
  (reportId: string, empId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingRequest }));
    return dispatch(expPreRequestActions.delete(reportId))
      .then(() => {
        const queries = UrlUtil.getUrlQuery();
        const isClonedFromReport = get(queries, 'isCloned') === 'true';
        if (isClonedFromReport) {
          // if the request is cloned from report, the page is ApexPage
          // so better to close the browser window
          window.close();
        } else {
          Promise.all([
            dispatch(fetchExpReportIdList(false, empId)),
            dispatch(modeActions.initialize()),
            dispatch(selectedExpReportActions.clear()),
            dispatch(overlapActions.nonOverlapReport()),
            dispatch(viewAction.setListView()),
          ]);
        }
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

export const deleteExpRecord =
  (recordIds: Array<string>, empId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingRecord }));
    return dispatch(expPreRequestActions.deleteRecord(recordIds))
      .then(() => {
        dispatch(fetchExpReportIdList(false, empId));
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
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SubmittingRequest }));
    dispatch(activeDialogActions.hide());
    return dispatch(preRequestActions.submit(reportId, comment, empId))
      .then(() => {
        const _ = undefined;
        return Promise.all([
          dispatch(fetchExpReportIdList(false, empId, _, _, true)),
          dispatch(expPreRequestActions.get(reportId)).then(
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
 * Recall submitted request
 *
 * @param {string} requestId
 * @param {string} comment
 * @param {string} empId
 * @param {string} reportId
 * @param {Array<ExpenseReportType>} reportTypeList
 */
export const cancelExpRequestApproval =
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
    return dispatch(preRequestActions.cancel(requestId, comment))
      .then(() => {
        const _ = undefined;
        Promise.all([
          dispatch(fetchExpReportIdList(false, empId, _, _, true)),
          dispatch(expPreRequestActions.get(reportId)).then((res) => {
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

export const searchEILookup =
  (id: string, query: string) => (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return getCustomEIOptionList(id, query)
      .then((result: CustomEIOptionList) => {
        dispatch(dialogLoadingActions.toggle(false));
        return result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
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
    return clonePreRequestRecord(recordIds, targetDates, numberOfDays, empId)
      .then((cloneRes) => {
        if (cloneRes.updatedRecords.length > 0) {
          dispatch(
            recordUpdatedActions.setCloneUpdate(cloneRes.updatedRecords)
          );
        }
        return dispatch(expPreRequestActions.get(reportId, 'REQUEST')).then(
          (res) => {
            const report = { ...res.payload, isCostCenterChangedManually };
            dispatch(selectedExpReportActions.select(report, reportTypeList));
            dispatch(expPreRequestActions.updateList(res.payload));
            dispatch(modeActions.reportSelect());
            return cloneRes;
          }
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then((cloneRes) => {
        dispatch(loadingEnd());
        return cloneRes;
      });
  };
