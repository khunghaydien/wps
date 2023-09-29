import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import appName from '../../commons/constants/appName';
import expModuleType from '@commons/constants/expModuleType';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../commons/actions/app';
import msg from '../../commons/languages';
import { showToast } from '../../commons/modules/toast';
import UrlUtil from '../../commons/utils/UrlUtil';
import {
  getUserSetting,
  getUserSettingSuccess,
} from '@commons/actions/userSetting';
import subRoleOptionHelper, {
  filterDate,
} from '@commons/components/exp/SubRole/subRoleOptionCreator';
import { actions as employeeDetailActions } from '@commons/modules/exp/entities/employeeDetail';
import { actions as paymentMethodListActions } from '@commons/modules/exp/entities/paymentMethodList';
import { actions as bulkEditRecordActions } from '@commons/modules/exp/ui/bulkEditRecord';
import { actions as reportDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as extraConditionsActions } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as submitDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';
import { actions as subjectActions } from '@commons/modules/exp/ui/reportList/advSearch/subject';
import { actions as vendorIdsActions } from '@commons/modules/exp/ui/reportList/advSearch/vendorIds';
import DateUtil from '@commons/utils/DateUtil';

import EmployeeRepository from '@apps/repositories/organization/employee/EmployeeDetailRepository';

import {
  EmployeeList,
  getEmployeeList,
} from '../../domain/models/common/Employee';
import { AccountingPeriodList } from '../../domain/models/exp/AccountingPeriod';
import { DefaultCostCenter } from '../../domain/models/exp/CostCenter';
import {
  getTransactionHistory,
  toggleHideCCTransaction,
} from '../../domain/models/exp/CreditCard';
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
  calcTotalAmount,
  expenseListArea,
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
  hideIcCardTransaction,
} from '../../domain/models/exp/TransportICCard';
import {
  BULK_EDIT_GRID_BODY_LOADING_AREA,
  cloneRecord,
  Record,
  RecordListSaveResponseType,
} from '@apps/domain/models/exp/Record';
import { UserSetting } from '@apps/domain/models/UserSetting';

import {
  DefaultCostCenterInfo,
  getDefaultCostCenter,
} from '../../domain/modules/exp/cost-center/defaultCostCenter';
import { setAvailableExpType } from '../../domain/modules/exp/expense-type/availableExpType';
import { actions as preRequestActions } from '../../domain/modules/exp/pre-request';
import { actions as expReportActions } from '../../domain/modules/exp/report';
import { actions as requestApprovalActions } from '../../domain/modules/exp/request/pre-request';
import { actions as requestActions } from '../../domain/modules/exp/request/report';
import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { actions as reportIdListActions } from '../modules/entities/reportIdList';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as recordUpdatedActions } from '../modules/ui/expenses/dialog/recordUpdated/dialog';
import { actions as modeActions } from '../modules/ui/expenses/mode';
import { actions as overlapActions } from '../modules/ui/expenses/overlap';
import { actions as accountingPeriodActions } from '../modules/ui/expenses/recordListPane/accountingPeriod';
import { actions as openTitleActions } from '../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as orderByActions } from '../modules/ui/expenses/reportList/orderBy';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/expenses/reportList/page';
import { actions as sortByActions } from '../modules/ui/expenses/reportList/sortBy';
import { set as setReportTypeLoading } from '../modules/ui/expenses/reportTypeLoading';
import {
  actions as selectedExpReportActions,
  SelectedReportUpdateValues,
} from '../modules/ui/expenses/selectedExpReport';
import { actions as subRoleActions } from '../modules/ui/expenses/subrole';
import { actions as tabActions } from '../modules/ui/expenses/tab';
import { actions as viewAction } from '../modules/ui/expenses/view';
import { actions as reportTypeFetchActions } from '@apps/domain/modules/exp/expense-report-type/list';
import { setUserSettingInMap } from '@apps/domain/modules/exp/userSettingMap';
import { setNeedGenerateMapPreview } from '@apps/expenses-pc/modules/ui/expenses/recordItemPane/mileage';

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
// const loadHomePageReports = (empId?: string, empHistoryId?: string) => (
//   dispatch: AppDispatch
// ) => {
//   const loadingHint = TextUtil.template(
//     getMsgByBrowserLang().Exp_Lbl_LoadingActive,
//     getMsgByBrowserLang().Exp_Lbl_Report
//   );
//   dispatch(
//     loadingStart({
//       areas: expensesArea,
//       loadingHint,
//     })
//   );
//   dispatch(expReportActions.list(null, empId, empHistoryId)).then(() => {
//     dispatch(loadingEnd(expensesArea));
//   });
// };

export const fetchHistories = (empId: string) => (dispatch: AppDispatch) => {
  return dispatch(
    withLoading(
      () => EmployeeRepository.fetchHistories(empId, true),
      (result) => {
        dispatch(employeeDetailActions.setDetails(result));
        if (!isEmpty(result)) {
          const primaryHistories = result.filter(
            (h) =>
              !h.isRemoved && h.primary && filterDate(h, DateUtil.getToday())
          );
          const historyRecord = primaryHistories[0];
          dispatch(
            subRoleActions.setSelectedSubRole(historyRecord.id || undefined)
          );
        }
        return result;
      }
    )
  ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
};

export const clearHistories = () => (dispatch: AppDispatch) => {
  return dispatch(employeeDetailActions.clear());
};

export const setSelectedSubRole =
  (roleId: string) => (dispatch: AppDispatch) => {
    return dispatch(subRoleActions.setSelectedSubRole(roleId));
  };

export const setSubroleIds =
  (ids: Array<string>) => (dispatch: AppDispatch) => {
    return dispatch(subRoleActions.setSubroleIds(ids));
  };

export const setSelectedTabCompanyId =
  (companyId: string, isApproval?: boolean) => (dispatch: AppDispatch) => {
    return dispatch(tabActions.setCompanyId(companyId, isApproval));
  };

export const getUserSettings =
  (empHistoryId?: string, isListPageLoading = false) =>
  (dispatch: AppDispatch, getState) => {
    dispatch(
      loadingStart(isListPageLoading ? { areas: expenseListArea } : undefined)
    );
    const state = getState();
    const userSettingMap = get(state, 'entities.exp.userSettingMap');
    const userSetting = get(userSettingMap, `${empHistoryId}`);
    const delegateEmp = get(
      state,
      'ui.expenses.delegateApplicant.selectedEmployee'
    );
    const isProxyMode = !isEmpty(delegateEmp);
    let action = () =>
      dispatch(getUserSetting({ detailSelectors: [], empHistoryId }));
    if (!isProxyMode && userSetting)
      action = () => {
        dispatch(getUserSettingSuccess(userSetting));
        return Promise.resolve(userSetting);
      };
    return action()
      .then((result: UserSetting) => {
        if (result) {
          dispatch(accountingPeriodActions.search(result.companyId));
          if (!isProxyMode) dispatch(setUserSettingInMap(empHistoryId, result));
        }
        return result;
      })
      .finally(() => {
        dispatch(loadingEnd(isListPageLoading ? expenseListArea : undefined));
      });
  };

export const changeListTab =
  (
    tabIdx: number,
    companyId?: string,
    fetchList = false,
    isApproval = false,
    isUpdateFirstActiveRole?: boolean
  ) =>
  (dispatch: AppDispatch, getState) => {
    dispatch(setSelectedTabCompanyId(companyId, isApproval));
    const state = getState();
    const employeeDetails = state.common.exp.entities.employeeDetails;
    const companies = state.common.exp.entities.companyDetails;
    const subrolesMap = subRoleOptionHelper.getSubRoleOptionsCompanyMap(
      employeeDetails.details,
      companies
    );
    let companyTabIdx = tabIdx;
    let empHistoryIds;
    if (!isEmpty(subrolesMap) && !isEmpty(companyId)) {
      if (tabIdx === undefined) {
        // Get Company Tab Id from subrolesMap. Active Tab is always 0, 2, 4, 6...
        companyTabIdx = Object.keys(subrolesMap).indexOf(companyId) * 2;
      }
      const subroles = subrolesMap[companyId];
      if (!isEmpty(subroles)) {
        empHistoryIds = subroles
          .filter((s) => s !== undefined && s.value)
          .map((s) => s.value);
        dispatch(setSubroleIds(empHistoryIds));
      }
      if (isUpdateFirstActiveRole) {
        const isPrimaryCompany = companyTabIdx === 0 || companyTabIdx === 1;
        dispatch(
          setSelectedSubRole(
            subRoleOptionHelper.getFirstActiveRole(
              empHistoryIds,
              employeeDetails?.details,
              isPrimaryCompany
            )
          )
        );
      }
    }
    dispatch(tabActions.changeTab(companyTabIdx));
    if (fetchList) {
      const empId = state.userSetting.employeeId;
      const _ = undefined;
      if (empId)
        dispatch(
          fetchExpReportIdList(
            isApproval,
            empId,
            _,
            _,
            !isEmpty(empHistoryIds) ? { empHistoryIds } : undefined,
            _,
            _,
            companyId
          )
        );
    }
  };

// Pagination
export const fetchExpReportIdList =
  (
    isApproved: boolean,
    empId?: string,
    sortBy?: SortBy,
    orderBy?: OrderBy,
    advSearchConditions?: SearchConditions,
    withoutLoading?: boolean,
    empHistoryId?: string,
    companyId?: string
  ) =>
  (dispatch: AppDispatch) => {
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
        if (res.payload.reportIdList.length > 0) {
          dispatch(
            expReportActions.list(
              res.payload.reportIdList.slice(0, PAGE_SIZE),
              empId,
              empHistoryId,
              companyId,
              isApproved
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
      })
      .catch((err) => {
        if (!withoutLoading) {
          dispatch(loadingEnd(expenseListArea));
        }
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

export const fetchExpReportList =
  (
    reportIdList: ReportIdList,
    pageNum: number,
    empId: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ areas: expenseListArea }));
    return dispatch(
      expReportActions.list(
        reportIdList.slice(PAGE_SIZE * (pageNum - 1), PAGE_SIZE * pageNum),
        empId,
        empHistoryId
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
    empId: string,
    isFetchReportList = true
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
      if (!isCurrentReportOnList && isFetchReportList) {
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
    empId: string,
    advSearchConditions?: SearchConditions,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(
      expReportActions.createReport(expReport, empId, empHistoryId)
    )
      .then((result) => {
        const { updatedRecords, reportId } = result;
        if (updatedRecords.length > 0) {
          dispatch(recordUpdatedActions.setCloneUpdate(updatedRecords));
        }
        const _ = undefined;
        Promise.all([
          dispatch(
            fetchExpReportIdList(false, empId, _, _, advSearchConditions, _)
          ),
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

export const fetchReportDetail =
  (
    status: string,
    reportNo: string,
    employeeId: string,
    defaultCostCenter: Array<DefaultCostCenterInfo>,
    empHistoryId?: string,
    tabCompanyId?: string,
    accountingPeriods?: AccountingPeriodList
  ) =>
  (dispatch: AppDispatch, getState: any) => {
    let state = getState();
    if (isEmpty(empHistoryId)) {
      const reportTypeList = state.entities.exp.expenseReportType.list.active;
      // For existing customers
      dispatch(
        fetchExpReport(
          status,
          reportNo,
          reportTypeList,
          employeeId,
          defaultCostCenter,
          tabCompanyId,
          accountingPeriods
        )
      );
    } else {
      const _ = undefined;
      dispatch(
        loadingStart({
          areas: expFormArea,
          loadingHint: msg().Exp_Msg_FetchingRequest,
        })
      );
      dispatch(
        reportTypeFetchActions.list(
          tabCompanyId,
          'REPORT',
          _,
          employeeId,
          _,
          _,
          true,
          empHistoryId
        )
      )
        .then(() => {
          state = getState();
          const reportTypeList =
            state.entities.exp.expenseReportType.list.active;
          dispatch(
            fetchExpReport(
              status,
              reportNo,
              reportTypeList,
              employeeId,
              defaultCostCenter,
              tabCompanyId,
              accountingPeriods
            )
          );
        })
        .finally(() => dispatch(loadingEnd(expFormArea)));
    }
  };

export const isNotDefaultCostCenter =
  (
    costCenterCode: string,
    date: string,
    defaultCostCenterList: DefaultCostCenterInfo[],
    empHistoryId: string,
    empId: string
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const defaultCostCenter = find(defaultCostCenterList, {
      date,
    });
    if (!defaultCostCenter && empId) {
      const res = await dispatch(
        getDefaultCostCenter(empId, date, empHistoryId)
      );
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
  (dispatch: AppDispatch, getState) => {
    dispatch(
      loadingStart({
        areas: expFormArea,
        loadingHint: msg().Exp_Msg_FetchingReport,
      })
    );
    dispatch(setReportTypeLoading(true));
    dispatch(getReport(status, reportId, empId))
      .then((result) => {
        const currentState = getState();
        const isNewReport = get(
          currentState,
          'ui.expenses.selectedExpReport.isNewReport'
        );
        dispatch(loadingEnd(expFormArea));
        if (isNewReport) {
          dispatch(setReportTypeLoading(false));
          return;
        }
        dispatch(
          selectedExpReportActions.select(result.payload, reportTypeList)
        );
        dispatch(modeActions.reportSelect());
        const empHistoryIdFromResult = get(result.payload, 'empHistoryId');
        dispatch(subRoleActions.setSelectedSubRole(empHistoryIdFromResult));
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
            companyId,
            empHistoryIdFromResult,
            empId
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
              expModuleType.REPORT,
              empHistoryIdFromResult
            )
          );
        } else {
          dispatch(
            paymentMethodListActions.search(
              targetReportType.paymentMethodIds || [],
              companyId,
              true
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
              empHistoryIdFromResult,
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
    empId: string,
    isAddOrUpdate: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingReport }));
    const isNewReport = !expReport.reportId;
    return dispatch(expReportActions.save(expReport, empId))
      .then(() => {
        // for new created report, it's going to be the first one in the report list
        // for the excisting report, it remains the same place as ordered
        if (isAddOrUpdate) {
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
        }
        const expReportCopy = cloneDeep(expReport);
        delete expReportCopy?.isNewReport;
        dispatch(
          selectedExpReportActions.select(
            expReportCopy,
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
    isCostCenterChangedManually?: boolean,
    empHistoryId?: string,
    advSearchConditions?: SearchCondition
  ) =>
  (dispatch: AppDispatch, getState) => {
    dispatch(loadingStart());
    const currentState = getState();
    return dispatch(expReportActions.clone(reportId, empId, empHistoryId))
      .then((result) => {
        dispatch(showToast(msg().Exp_Msg_CloneReport));
        return Promise.all([
          dispatch(
            loadingStart({
              areas: expFormArea,
              loadingHint: msg().Exp_Msg_FetchingRequest,
            })
          ),
          dispatch(
            fetchExpReportIdList(
              false,
              empId,
              undefined,
              undefined,
              advSearchConditions
            )
          ),
          dispatch(
            expReportActions.get((result as any).reportId, 'REPORT')
          ).then((saveExpReportResult) => {
            saveExpReportResult.payload.isCostCenterChangedManually =
              !!isCostCenterChangedManually;
            dispatch(
              paymentMethodListActions.get(
                saveExpReportResult.payload.expReportTypeId
              )
            );
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
            dispatch(loadingEnd(expFormArea));
            const currentTabIdx = get(
              currentState,
              'ui.expenses.tab.tabIdx',
              0
            );
            if (currentTabIdx % 2 === 1)
              dispatch(tabActions.changeTab(currentTabIdx - 1));
          });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

export const cloneReportAsRequest =
  (reportId: string, empId: string, isFromFA: boolean, empHistoryId?: string) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(preRequestActions.clone(reportId, empId, empHistoryId))
      .then((result) => {
        UrlUtil.openApp(appName.REQUESTS, {
          id: (result as any).reportId,
          isCloned: 'true',
          isFromFA: isFromFA.toString(),
          empHistoryId,
        });
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

// 申請削除
export const deleteExpReport =
  (reportId: string, empId?: string, empHistoryIds?: Array<string>) =>
  (dispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingReport }));
    return dispatch(expReportActions.delete(reportId))
      .then(() => {
        const _ = undefined;
        Promise.all([
          dispatch(
            fetchExpReportIdList(
              false,
              empId,
              _,
              _,
              !isEmpty(empHistoryIds) ? { empHistoryIds } : undefined
            )
          ),
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
    empId?: string,
    advSearchCondition?: SearchConditions,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SubmittingReport }));
    dispatch(activeDialogActions.hide());
    const _ = undefined;
    return dispatch(requestActions.submit(reportId, comment, empId))
      .then(() =>
        Promise.all([
          dispatch(
            fetchExpReportIdList(false, empId, _, _, advSearchCondition, true)
          ),
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
          .then(() => dispatch(loadingEnd()))
      )
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
    advSearchConditions?: any,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return dispatch(requestActions.cancel(requestId, comment))
      .then(() => {
        const _ = undefined;
        Promise.all([
          dispatch(
            fetchExpReportIdList(false, empId, _, _, advSearchConditions, true)
          ),
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

/**
 * Navigate to report print page
 *
 * @param {String} periodStartDate The start date of target month
 */
export const openPrintWindow = (reportId: string) => () =>
  UrlUtil.openApp('expenses-pc-print', {
    reportId,
  });

/* Record */

export const saveExpRecord =
  (
    recordItem: Record,
    reportTypeList: Array<ExpenseReportType> | null | undefined,
    report: Report,
    empId: string,
    loadInBackground?: boolean,
    empHistoryId?: string,
    shouldUpdateSettlement?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRecord }));
    }

    const reportId = report.reportId || '';
    const expReportTypeId = report.expReportTypeId || '';

    return dispatch(
      expReportActions.saveRecord(
        recordItem,
        reportId,
        expReportTypeId,
        empId,
        empHistoryId
      )
    )
      .then((res) => {
        if (res.updatedReportAmount) {
          report.totalAmount = res.updatedReportAmount;
        }
        const idx = report.records.findIndex(
          (x) => x.recordId === res.recordId || x.recordId === null
        );
        // update for record & item list
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
        report.records[idx].items[0].jctRegistrationNumber =
          recordItem.items[0].jctRegistrationNumber;

        recordItem.items.forEach((item, itemIdx) => {
          report.records[idx].items[itemIdx].costCenterHistoryId =
            item.costCenterHistoryId;
          report.records[idx].items[itemIdx].costCenterName =
            item.costCenterName;
          report.records[idx].items[itemIdx].costCenterCode =
            item.costCenterCode;
          report.records[idx].items[itemIdx].jobId = item.jobId;
          report.records[idx].items[itemIdx].jobName = item.jobName;
          report.records[idx].items[itemIdx].jobCode = item.jobCode;
        });

        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(selectedExpReportActions.select(report, reportTypeList));
        dispatch(expReportActions.updateList(report));
        dispatch(modeActions.reportSelect());
        if (!loadInBackground) {
          dispatch(overlapActions.nonOverlapRecord());
        }
        if (recordItem.useCashAdvance || shouldUpdateSettlement) {
          return dispatch(getReportSettlementDetail(reportId)).then(() => res);
        } else {
          return res;
        }
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

// save multiple record
export const saveMultiRecord =
  (records: Record[], report: Report, shouldUpdateSettlement?: boolean) =>
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

        if (shouldUpdateSettlement) {
          return dispatch(getReportSettlementDetail(reportId)).then(() => res);
        } else {
          return res;
        }
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  };

// save record in bulk edit
export const saveBulkRecord =
  (
    bulkEditRemoveIds: string[],
    originalRecords: Record[],
    report: Report,
    shouldUpdateSettlement: boolean
  ) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    dispatch(loadingStart());
    try {
      const state = getState();
      const { employeeId } = state.userSetting;
      const { expReportTypeId, records, reportId } = report;
      const clonedReport = cloneDeep(report);
      const originalRecordCloned = cloneDeep(originalRecords);
      let originalRecordList = originalRecordCloned;

      if (bulkEditRemoveIds.length > 0) {
        const _ = undefined;
        await dispatch(
          expReportActions.deleteRecord(
            bulkEditRemoveIds,
            employeeId,
            shouldUpdateSettlement
          )
        );
        dispatch(bulkEditRecordActions.clearRemove());
        originalRecordList = originalRecordCloned.filter(
          ({ recordId }) => !bulkEditRemoveIds.includes(recordId)
        );
      }

      if (!isEqual(originalRecordList, records) && records.length > 0) {
        const recordList = records.map((record: Record) => ({
          ...record,
          empId: employeeId,
          reportId,
          useCashAdvance: shouldUpdateSettlement,
        }));
        const { recordIds = [] } = await dispatch(
          expReportActions.saveMultiRecords(
            recordList,
            reportId || '',
            expReportTypeId || ''
          )
        );
        clonedReport.records.forEach((record, idx) => {
          record.recordId = recordIds[idx];
        });
      }

      dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
      if (shouldUpdateSettlement) {
        dispatch(getReportSettlementDetail(reportId));
      }
      clonedReport.totalAmount = calcTotalAmount(clonedReport);
      dispatch(selectedExpReportActions.select(clonedReport));
      dispatch(expReportActions.updateList(clonedReport));
      dispatch(modeActions.reportSelect());
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const cloneRecords =
  (
    targetDates: Array<string>,
    recordIds: Array<string>,
    reportId: string,
    reportTypeList: Array<ExpenseReportType>,
    numberOfDays?: number,
    empId?: string,
    shouldUpdateSettlement?: boolean,
    isCostCenterChangedManually?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return cloneRecord(
      recordIds,
      targetDates,
      numberOfDays,
      empId,
      shouldUpdateSettlement
    )
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
  (
    recordIds: Array<string>,
    empId: string,
    reportId?: string,
    shouldUpdateSettlement?: boolean,
    advSearchCondition?: SearchConditions
  ) =>
  (dispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_DeletingRecord }));
    return dispatch(
      expReportActions.deleteRecord(recordIds, empId, shouldUpdateSettlement)
    )
      .then(() => {
        const _ = undefined;
        return dispatch(
          fetchExpReportIdList(false, empId, _, _, advSearchCondition, true)
        ).then(() => {
          if (shouldUpdateSettlement)
            return dispatch(getReportSettlementDetail(reportId));
        });
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
    isReimbursement?: boolean,
    cardNameList?: Array<string>,
    description?: string,
    includeHidden?: boolean,
    includeClaimed?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    return getTransactionHistory(
      companyId,
      empId,
      from,
      to,
      isReimbursement,
      cardNameList,
      description,
      includeHidden,
      includeClaimed
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const toggleHideCC =
  (id: string, isHidden: boolean) => (dispatch: AppDispatch) => {
    return toggleHideCCTransaction(id, isHidden)
      .then(() => {
        return true;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return false;
      });
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
    to?: string,
    includeHidden?: boolean,
    includeUsed?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    return getIcCardTransactionHistory(
      salesId,
      customerId,
      companyId,
      employeeCode,
      from,
      to,
      includeHidden,
      includeUsed
    ).catch((err) => {
      dispatch(catchApiError(err, { isContinuable: true }));
    });
  };

export const hideICCardTransaction =
  (
    salesId: string,
    customerId: string,
    employeeCode: string,
    companyId: string,
    userCardNo: string,
    icRecordId: string,
    isHidden: boolean
  ) =>
  (dispatch: AppDispatch) =>
    hideIcCardTransaction(
      salesId,
      customerId,
      employeeCode,
      companyId,
      userCardNo,
      icRecordId,
      isHidden
    )
      .then(() => true)
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return false;
      });

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

// re-calculated settlement amount
export const getReportSettlementDetail =
  (reportId: string) =>
  (dispatch: AppDispatch): Promise<void | SelectedReportUpdateValues> =>
    dispatch(expReportActions.getSettlementDetail([reportId]));

export const setIsNeedGenerateMapPreview =
  (isNeedGenerateMapPreview?: boolean) => (dispatch: AppDispatch) => {
    return dispatch(setNeedGenerateMapPreview(isNeedGenerateMapPreview));
  };

export const startBulkEditLoading =
  (showHint?: boolean) => (dispatch: AppDispatch) => {
    const loadingHint = showHint ? msg().Exp_Msg_CreatingNewRecords : undefined;
    dispatch(
      loadingStart({ areas: BULK_EDIT_GRID_BODY_LOADING_AREA, loadingHint })
    );
  };

export const endBulkEditLoading = () => (dispatch: AppDispatch) => {
  dispatch(loadingEnd(BULK_EDIT_GRID_BODY_LOADING_AREA));
};
