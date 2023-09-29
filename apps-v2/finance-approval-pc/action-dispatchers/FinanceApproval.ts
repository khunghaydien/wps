import get from 'lodash/get';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg from '../../commons/languages';
import {
  actions as costCenterListActions,
  COST_CENTER_LIST,
} from '@commons/modules/exp/entities/costCenterList';
import { actions as departmentListActions } from '@commons/modules/exp/entities/departmentList';
import { actions as employeeListActions } from '@commons/modules/exp/entities/employeeList';
import { actions as paymentMethodListActions } from '@commons/modules/exp/entities/paymentMethodList';
import { actions as reportTypeListActions } from '@commons/modules/exp/entities/reportTypeList';
import { actions as vendorListActions } from '@commons/modules/exp/entities/vendorList';
import { actions as accountingDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as costCenterActions } from '@commons/modules/exp/ui/reportList/advSearch/costCenterBaseIds';
import { actions as departmentActions } from '@commons/modules/exp/ui/reportList/advSearch/departmentBaseIds';
import { actions as detailActions } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as employeeActions } from '@commons/modules/exp/ui/reportList/advSearch/empBaseIds';
import { actions as statusActions } from '@commons/modules/exp/ui/reportList/advSearch/financeStatusList';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as requestDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';
import { actions as titleActions } from '@commons/modules/exp/ui/reportList/advSearch/subject';
import { actions as vendorActions } from '@commons/modules/exp/ui/reportList/advSearch/vendorIds';
import { showToast, showToastWithType } from '@commons/modules/toast';
import TextUtil from '@commons/utils/TextUtil';

import { DEPARTMENT_LIST } from '../../domain/models/exp/Department';
import {
  FAExpSearchConditionList,
  FAReqSearchConditionList,
  MAX_COST_CENTER_LIMIT,
  OrderBy,
  RequestIdList,
  RequestList,
  SearchConditions,
  SortBy, // searchConditionInitValue,
} from '../../domain/models/exp/FinanceApproval';
import { Record } from '../../domain/models/exp/Record';
import {
  Report,
  requestDateInitVal,
  status as STATUS,
} from '../../domain/models/exp/Report';
import {
  BulkApprovalRes,
  BulkError,
} from '@apps/domain/models/approval/request/Request';
import {
  ExpenseReportType,
  ExpenseReportTypeList,
} from '@apps/domain/models/exp/expense-report-type/list';

import { getDefaultCostCenter } from '../../domain/modules/exp/cost-center/defaultCostCenter';
import { actions as financeApprovalActions } from '../../domain/modules/exp/finance-approval';
import { actions as preRequestActions } from '../../domain/modules/exp/pre-request';
import { actions as expReportActions } from '../../domain/modules/exp/report';
import { actions as modeActions } from '../../expenses-pc/modules/ui/expenses/mode';
import { actions as overlapActions } from '../../expenses-pc/modules/ui/expenses/overlap';
import { actions as selectedExpReportActions } from '../../expenses-pc/modules/ui/expenses/selectedExpReport';
import { AppDispatch } from '../modules/AppThunk';
// import { actions as expTypeListActions } from '../modules/entities/expTypeList';
import { actions as advSearchCondition } from '../modules/entities/advSearchConditionList';
import { actions as preRequestIdListActions } from '../modules/entities/preRequestIdList';
import { actions as preRequestListActions } from '../modules/entities/preRequestList';
import { actions as requestIdListActions } from '../modules/entities/requestIdList';
import { actions as requestListActions } from '../modules/entities/requestList';
import { actions as activeDialogActions } from '../modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as reportCloneLinkActions } from '../modules/ui/FinanceApproval/reportCloneLink';
import { actions as orderByActions } from '../modules/ui/FinanceApproval/RequestList/orderBy';
import {
  actions as pageActions,
  PAGE_SIZE,
} from '../modules/ui/FinanceApproval/RequestList/page';
import { actions as selectedSearchConditionActions } from '../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';
import { actions as sortByActions } from '../modules/ui/FinanceApproval/RequestList/sortBy';
import { setAvailableExpType } from '@apps/domain/modules/exp/expense-type/availableExpType';
import { actions as financeApprovalPreRequestActions } from '@apps/domain/modules/exp/financeApprovalPreRequest';
import { actions as reqSubRoleActions } from '@apps/expenses-pc/modules/ui/expenses/subrole';
import { actions as bulkErrorActions } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/bulkApproval/error';
import { actions as jobActions } from '@apps/requests-pc/modules/ui/expenses/dialog/jobSelect/list';
import { set as setReportTypeLoading } from '@apps/requests-pc/modules/ui/expenses/reportTypeLoading';
import { actions as selectedExpRequestReportActions } from '@apps/requests-pc/modules/ui/expenses/selectedExpReport';
import { actions as expenseSubRoleActions } from '@apps/requests-pc/modules/ui/expenses/subrole';

// report type with expense type
import { getReportTypeWithLinkedExpType } from '@apps/requests-pc/action-dispatchers/ReportType';

export const OPTION_LIMIT = 100;

const loadHomePageFAReports =
  (companyId?: string) => (dispatch: AppDispatch) => {
    dispatch(requestListActions.list(undefined, companyId));
  };

const formatBulkErrorList = (res: BulkApprovalRes) => {
  const errorCount = res.errorCount;
  const hasError = errorCount > 0;
  const bulkErrorList: Array<BulkError> = res.financeBulkApprovalResults.filter(
    (process) => !process.isSuccess && process.requestId
  );
  const requestIdSuccessList = res.financeBulkApprovalResults
    .filter((process) => process.isSuccess && process.requestId)
    .map((process) => process.requestId);

  return { errorCount, hasError, bulkErrorList, requestIdSuccessList };
};

const showToastBulkApproval =
  (
    hasError: boolean,
    errorCount: number,
    requestIdList: string[],
    bulkErrorList: Array<BulkError>,
    isApprove?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (hasError) {
      dispatch(
        showToastWithType(
          TextUtil.template(
            isApprove
              ? msg().Appr_Msg_BulkApproveError
              : msg().Appr_Msg_BulkRejectError,
            requestIdList.length,
            errorCount
          ),
          4000,
          'error'
        )
      );
      dispatch(bulkErrorActions.set(bulkErrorList));
    } else {
      dispatch(
        showToast(
          TextUtil.template(
            isApprove
              ? msg().Appr_Msg_BulkApproveSuccess
              : msg().Appr_Msg_BulkRejectSuccess,
            requestIdList.length
          )
        )
      );
    }
  };

/* expense id list */
export const fetchFinanceApprovalIdList =
  (
    companyId?: string, // companyId will be checked in BE if not passed from FE
    sortBy?: SortBy,
    orderBy?: OrderBy,
    advSearchConditions?: SearchConditions,
    isHomePage?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    if (isHomePage) {
      dispatch(loadHomePageFAReports(companyId));
    }
    return dispatch(
      requestIdListActions.list(companyId, sortBy, orderBy, advSearchConditions)
    )
      .then((ret) => {
        if (!isHomePage) {
          if (ret.payload.requestIdList.length > 0) {
            dispatch(loadingStart());
            dispatch(pageActions.set(1));
            return dispatch(
              requestListActions.list(
                ret.payload.requestIdList.slice(0, PAGE_SIZE)
              )
            )
              .then(() => {
                if (sortBy && orderBy) {
                  dispatch(sortByActions.set(sortBy));
                  dispatch(orderByActions.set(orderBy));
                }
              })
              .finally(() => dispatch(loadingEnd()));
          } else {
            dispatch(requestListActions.initialize());
          }
        } else if (ret.payload.requestIdList.length === 0) {
          dispatch(requestListActions.initialize());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* request id list */
export const fetchFinanceApprovalPreRequestIdList =
  (
    companyId?: string,
    sortBy?: SortBy,
    orderBy?: OrderBy,
    advSearchConditions?: SearchConditions,
    isHomePage?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    if (isHomePage) {
      dispatch(loadHomePageFAReports());
    }
    return dispatch(
      preRequestIdListActions.list(
        companyId,
        sortBy,
        orderBy,
        advSearchConditions
      )
    )
      .then((ret) => {
        if (!isHomePage) {
          if (ret.payload.requestIdList.length > 0) {
            dispatch(loadingStart());
            dispatch(pageActions.set(1));
            return dispatch(
              preRequestListActions.list(
                ret.payload.requestIdList.slice(0, PAGE_SIZE)
              )
            )
              .then(() => {
                if (sortBy && orderBy) {
                  dispatch(sortByActions.set(sortBy));
                  dispatch(orderByActions.set(orderBy));
                }
              })
              .finally(() => dispatch(loadingEnd()));
          } else {
            dispatch(preRequestListActions.initialize());
          }
        } else if (ret.payload.requestIdList.length === 0) {
          dispatch(preRequestListActions.initialize());
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const fetchFinanceApprovalList =
  (requestIdList: RequestIdList, pageNum: number, isRequestTab?: boolean) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const listAction = isRequestTab
      ? preRequestListActions.list
      : requestListActions.list;
    dispatch(pageActions.set(pageNum));
    return dispatch(
      listAction(
        requestIdList.slice(PAGE_SIZE * (pageNum - 1), PAGE_SIZE * pageNum)
      )
    )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const backFromDetailToList =
  (
    requestIdList: RequestIdList,
    currentRequestIdx: number,
    isRequestTab: boolean
  ) =>
  (dispatch: AppDispatch) => {
    const pageNum = Math.ceil((currentRequestIdx + 1) / PAGE_SIZE);
    dispatch(expenseSubRoleActions.clear());
    dispatch(reqSubRoleActions.clear());
    dispatch(overlapActions.nonOverlapReport());
    dispatch(fetchFinanceApprovalList(requestIdList, pageNum, isRequestTab));
    if (isRequestTab) dispatch(selectedExpRequestReportActions.clear());
    else dispatch(selectedExpReportActions.clear());
  };

/**
 * list vendor
 *
 * @param {string} companyId
 */
export const listVendor = (companyId: string) => (dispatch: AppDispatch) => {
  return dispatch(vendorListActions.list(companyId)).catch((err) =>
    dispatch(catchApiError(err, { isContinuable: true }))
  );
};

/* Search Condition */

// delete advanced search conditions
export const deteleAdvSearchCondition =
  (condition: FAReqSearchConditionList | FAExpSearchConditionList) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return dispatch(advSearchCondition.save(condition))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
        return dispatch(advSearchCondition.get());
      });
  };

export const saveSearchCondition =
  (searchConditionList: FAReqSearchConditionList | FAExpSearchConditionList) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(activeDialogActions.hide());
    return dispatch(advSearchCondition.save(searchConditionList))
      .then(() =>
        dispatch(advSearchCondition.get())
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()))
      )
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        dispatch(loadingEnd());
        return false;
      });
  };

/* Initializing Advance Search & Personal Setting */
// fetch search items' lists + personal setting
export const fetchInitialSetting =
  (companyId?: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(
      selectedSearchConditionActions.set(
        msg().Exp_Lbl_SearchConditionApprovelreRuestList
      )
    );
    Promise.all([
      dispatch(
        departmentListActions.list(
          companyId,
          requestDateInitVal().startDate,
          OPTION_LIMIT + 1,
          [DEPARTMENT_LIST]
        )
      ),
      dispatch(
        employeeListActions.list(
          companyId,
          requestDateInitVal().startDate,
          OPTION_LIMIT + 1
        )
      ),
      dispatch(advSearchCondition.get()),
    ])
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
    Promise.all([
      dispatch(vendorListActions.list(companyId)),
      dispatch(
        reportTypeListActions.list(companyId, requestDateInitVal().startDate)
      ),
      dispatch(
        costCenterListActions.list(
          companyId,
          requestDateInitVal().startDate,
          [COST_CENTER_LIST],
          MAX_COST_CENTER_LIMIT
        )
      ),
    ]);
  };

/* expense report */
export const fetchExpRequest =
  (
    requestId: string,
    requestTypeList: any,
    isFetchPreRequest?: boolean,
    reportTypeList?: ExpenseReportType[] | null
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_FetchingReport }));
    return dispatch(financeApprovalActions.get(requestId))
      .then(async (result) => {
        const empHistoryIdFromResult = get(result, 'payload.empHistoryId');
        const currentReportType = (reportTypeList || []).find(
          ({ id }) => id === result.payload.expReportTypeId
        );

        if (currentReportType) {
          const isCostCenterChangedManually = await dispatch(
            isNotDefaultCostCenter(
              currentReportType,
              result.payload,
              empHistoryIdFromResult
            )
          );
          result.payload.isCostCenterChangedManually =
            isCostCenterChangedManually;
          dispatch(paymentMethodListActions.get(currentReportType.id));
        }
        dispatch(
          selectedExpReportActions.select(result.payload, requestTypeList)
        );
        dispatch(
          expenseSubRoleActions.setSelectedSubRole(empHistoryIdFromResult)
        );
        dispatch(modeActions.reportSelect());

        if (isFetchPreRequest && result.payload.preRequestId) {
          return dispatch(
            preRequestActions.get(result.payload.preRequestId, 'REPORT')
          );
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/* request report */
export const fetchPreRequestReport =
  (
    requestId: string,
    companyId?: string,
    requestTypeList?: ExpenseReportTypeList,
    reportTypeList?: ExpenseReportType[] | null
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_FetchingReport }));
    return dispatch(financeApprovalPreRequestActions.get(requestId))
      .then(async (result) => {
        const empHistoryIdFromResult = get(result, 'payload.empHistoryId');
        dispatch(reqSubRoleActions.setSelectedSubRole(empHistoryIdFromResult));
        const currentReportType = (reportTypeList || []).find(
          ({ id }) => id === result.payload.expReportTypeId
        );
        // cost center
        if (currentReportType) {
          const isCostCenterChangedManually = await dispatch(
            isNotDefaultCostCenter(
              currentReportType,
              result.payload,
              empHistoryIdFromResult,
              true
            )
          );
          result.payload.isCostCenterChangedManually =
            isCostCenterChangedManually;
          dispatch(paymentMethodListActions.get(currentReportType.id));
        }
        dispatch(
          selectedExpRequestReportActions.select(
            result.payload,
            requestTypeList
          )
        );
        dispatch(modeActions.reportSelect());
        if (companyId) {
          dispatch(setReportTypeLoading(true));
          dispatch(
            getReportTypeWithLinkedExpType(
              result.payload,
              companyId,
              empHistoryIdFromResult
            )
          ).then((res: ExpenseReportType) => {
            dispatch(setAvailableExpType(res.expTypeIds || []));
            dispatch(setReportTypeLoading(false));
          });
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/* check cost center changed manually on report click */
const isNotDefaultCostCenter =
  (
    currentReportType: ExpenseReportType,
    report,
    employeeHistoryId?: string,
    isRequest?: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    const employeeId = get(report, 'employeeBaseId', '');
    const isUseCostCenter =
      get(currentReportType, 'isCostCenterRequired', 'UNUSED') !== 'UNUSED';
    if (employeeId && isUseCostCenter) {
      const costCenterCode = get(report, 'costCenterCode');
      const reportDate = get(
        report,
        isRequest ? 'scheduledDate' : 'accountingDate'
      );
      const defaultCostCenter = await dispatch(
        getDefaultCostCenter(employeeId, reportDate, employeeHistoryId)
      );
      return (
        costCenterCode &&
        get(defaultCostCenter, 'costCenterCode') !== costCenterCode
      );
    }
  };

/* reject expense report */
export const reject =
  (
    requestIds: string[],
    requestId: string,
    requestList: any,
    comment: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(financeApprovalActions.reject(requestIds, comment))
      .then(() =>
        dispatch(
          fetchExpRequest(requestId, requestList, true, reportTypeListAll)
        )
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* reject request report */
export const rejectPreRequest =
  (
    requestIds: string[],
    requestId: string,
    requestList: ExpenseReportTypeList,
    comment: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(
      financeApprovalPreRequestActions.reject(requestIds, comment)
    )
      .then(() =>
        dispatch(
          fetchPreRequestReport(requestId, '', requestList, reportTypeListAll)
        )
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* approve expense report */
export const approve =
  (
    requestIds: string[],
    requestId: string,
    requestList: any,
    comment: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(financeApprovalActions.approve(requestIds, comment))
      .then(() =>
        dispatch(
          fetchExpRequest(requestId, requestList, true, reportTypeListAll)
        )
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* approve request report */
export const approvePreRequest =
  (
    requestIds: string[],
    requestId: string,
    requestList: ExpenseReportTypeList,
    comment: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(
      financeApprovalPreRequestActions.approve(requestIds, comment)
    )
      .then(() =>
        dispatch(
          fetchPreRequestReport(requestId, '', requestList, reportTypeListAll)
        )
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
const bulkApprove =
  (requestIds: string[], requestList: RequestList, isPreRequest?: boolean) =>
  (dispatch: AppDispatch) => {
    const FAActions = isPreRequest
      ? financeApprovalPreRequestActions
      : financeApprovalActions;
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(FAActions.approve(requestIds, ''))
      .then((res: BulkApprovalRes) => {
        const {
          errorCount,
          hasError,
          bulkErrorList,
          requestIdSuccessList: updateRequestIdList,
        } = formatBulkErrorList(res);
        const listActions = isPreRequest
          ? preRequestListActions
          : requestListActions;
        dispatch(
          listActions.setBulkStatus(
            requestList,
            updateRequestIdList,
            STATUS.ACCOUNTING_AUTHORIZED
          )
        );
        dispatch(loadingEnd());
        showToastBulkApproval(
          hasError,
          errorCount,
          requestIds,
          bulkErrorList,
          true
        )(dispatch);
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const bulkApproveForRequest = (
  requestIds: string[],
  requestList: RequestList
) => bulkApprove(requestIds, requestList);

export const bulkApproveForPreRequest = (
  requestIds: string[],
  requestList: RequestList
) => bulkApprove(requestIds, requestList, true);

export const bulkReject =
  (requestIds: string[], requestList: RequestList, isPreRequest?: boolean) =>
  (dispatch: AppDispatch) => {
    const FAActions = isPreRequest
      ? financeApprovalPreRequestActions
      : financeApprovalActions;
    dispatch(activeDialogActions.hide());
    dispatch(loadingStart());
    return dispatch(FAActions.reject(requestIds, ''))
      .then((res: BulkApprovalRes) => {
        const {
          errorCount,
          hasError,
          bulkErrorList,
          requestIdSuccessList: updateRequestIdList,
        } = formatBulkErrorList(res);
        const listActions = isPreRequest
          ? preRequestListActions
          : requestListActions;
        dispatch(
          listActions.setBulkStatus(
            requestList,
            updateRequestIdList,
            STATUS.ACCOUNTING_REJECTED
          )
        );
        dispatch(loadingEnd());
        showToastBulkApproval(
          hasError,
          errorCount,
          requestIds,
          bulkErrorList
        )(dispatch);
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const bulkRejectForRequest = (
  requestIds: string[],
  requestList: RequestList
) => bulkReject(requestIds, requestList);

export const bulkRejectForPreRequest = (
  requestIds: string[],
  requestList: RequestList
) => bulkReject(requestIds, requestList, true);
/* save expense report */
export const saveExpReport =
  (
    expReport: any,
    sortBy: SortBy,
    orderBy: OrderBy,
    companyId: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingReport }));
    return dispatch(financeApprovalActions.save(expReport))
      .then(() => {
        dispatch(
          fetchExpRequest(
            expReport.requestId,
            undefined,
            undefined,
            reportTypeListAll
          )
        );
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(fetchFinanceApprovalIdList(companyId, sortBy, orderBy, null));
        dispatch(showToast(msg().Exp_Lbl_ReportIsSaved));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* save request report */
export const savePreRequestReport =
  (
    expReport: Report,
    sortBy: SortBy,
    orderBy: OrderBy,
    companyId: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingReport }));
    return dispatch(financeApprovalPreRequestActions.save(expReport))
      .then(() => {
        dispatch(
          fetchPreRequestReport(
            expReport.requestId,
            null,
            null,
            reportTypeListAll
          )
        );
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(
          fetchFinanceApprovalPreRequestIdList(companyId, sortBy, orderBy, null)
        );
        dispatch(showToast(msg().Exp_Lbl_ReportIsSaved));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* save expense record */
export const saveExpRecord =
  (
    recordItem: Record,
    sortBy: SortBy,
    orderBy: OrderBy,
    reportId: string,
    requestId: string,
    reportTypeId: string,
    companyId: string,
    empId: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRecord }));
    return dispatch(
      financeApprovalActions.saveRecord(
        recordItem,
        reportId,
        requestId,
        reportTypeId,
        empId
      )
    )
      .then(() => {
        dispatch(
          fetchExpRequest(requestId, undefined, undefined, reportTypeListAll)
        );
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(fetchFinanceApprovalIdList(companyId, sortBy, orderBy, null));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* save request record */
export const savePreRequestRecord =
  (
    recordItem: Record,
    sortBy: SortBy,
    orderBy: OrderBy,
    reportId: string,
    requestId: string,
    reportTypeId: string,
    companyId: string,
    empId: string,
    reportTypeListAll: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_SavingRecord }));
    return dispatch(
      financeApprovalPreRequestActions.saveRecord(
        recordItem,
        reportId,
        requestId,
        reportTypeId,
        empId
      )
    )
      .then(() => {
        dispatch(
          fetchPreRequestReport(requestId, null, null, reportTypeListAll)
        );
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(
          fetchFinanceApprovalPreRequestIdList(companyId, sortBy, orderBy, null)
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const cloneReportInFA =
  (
    reportId: string,
    empId: string,
    isExpense: boolean,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const clonePromise = isExpense
      ? expReportActions.clone(reportId, empId, empHistoryId)
      : preRequestActions.clone(reportId, empId, empHistoryId);
    return dispatch(clonePromise)
      .then((result) => {
        dispatch(
          reportCloneLinkActions.setReportCloneLink(
            (result as any).reportId,
            isExpense
          )
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const resetFilters = () => (dispatch: AppDispatch) => {
  dispatch(departmentActions.clear());
  dispatch(employeeActions.clear());
  dispatch(statusActions.reset());
  dispatch(requestDateActions.clear());
  dispatch(accountingDateActions.clear());
  dispatch(reportNoActions.clear());
  dispatch(amountActions.clear());
  dispatch(titleActions.clear());
  dispatch(vendorActions.clear());
  dispatch(reportTypeActions.clear());
  dispatch(costCenterActions.clear());
  dispatch(detailActions.clear());
  dispatch(jobActions.clear());
};

export const setDefaultSearchCondition =
  (companyId: string, isRequestTab: boolean) => (dispatch: AppDispatch) => {
    dispatch(fetchInitialSetting(companyId));
    // set search condition to default
    const searchCondition = isRequestTab
      ? msg().Exp_Lbl_SearchConditionApprovedRequestList
      : msg().Exp_Lbl_SearchConditionApprovelreRuestList;
    dispatch(selectedSearchConditionActions.set(searchCondition));
  };
