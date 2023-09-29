import get from 'lodash/get';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg from '../../commons/languages';
import { showToast } from '../../commons/modules/toast';
import {
  actions as costCenterListActions,
  COST_CENTER_LIST,
} from '@commons/modules/exp/entities/costCenterList';
import { actions as departmentListActions } from '@commons/modules/exp/entities/departmentList';
import { actions as employeeListActions } from '@commons/modules/exp/entities/employeeList';
import { actions as reportTypeListActions } from '@commons/modules/exp/entities/reportTypeList';
import { actions as vendorListActions } from '@commons/modules/exp/entities/vendorList';

import { DEPARTMENT_LIST } from '../../domain/models/exp/Department';
import { ExpenseReportType } from '../../domain/models/exp/expense-report-type/list';
import {
  MAX_COST_CENTER_LIMIT,
  OrderBy,
  RequestIdList,
  SearchConditions,
  SortBy, // searchConditionInitValue,
} from '../../domain/models/exp/FinanceApproval';
import { Record } from '../../domain/models/exp/Record';
import { requestDateInitVal } from '../../domain/models/exp/Report';

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

export const OPTION_LIMIT = 100;

const loadHomePageFAReports = () => (dispatch: AppDispatch) => {
  dispatch(requestListActions.list());
};

/* report list */
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
      dispatch(loadHomePageFAReports());
    }
    return dispatch(
      requestIdListActions.list(companyId, sortBy, orderBy, advSearchConditions)
    )
      .then((ret) => {
        if (!isHomePage) {
          if (ret.payload.requestIdList.length > 0) {
            dispatch(loadingStart());
            return dispatch(
              requestListActions.list(
                ret.payload.requestIdList.slice(0, PAGE_SIZE)
              )
            )
              .then(() => {
                dispatch(pageActions.set(1));
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

export const fetchFinanceApprovalList =
  (requestIdList: RequestIdList, pageNum: number) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(
      requestListActions.list(
        requestIdList.slice(PAGE_SIZE * (pageNum - 1), PAGE_SIZE * pageNum)
      )
    )
      .then(() => dispatch(pageActions.set(pageNum)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const backFromDetailToList =
  (requestIdList: RequestIdList, currentRequestIdx: number) =>
  (dispatch: AppDispatch) => {
    const pageNum = Math.ceil((currentRequestIdx + 1) / PAGE_SIZE);

    dispatch(overlapActions.nonOverlapReport());
    dispatch(fetchFinanceApprovalList(requestIdList, pageNum));
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
  (condition: Array<SearchConditions>) => (dispatch: AppDispatch) => {
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
  (searchConditionList: Array<SearchConditions>) => (dispatch: AppDispatch) => {
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

/* Report */

export const fetchExpRequest =
  (
    requestId: string,
    requestTypeList: any,
    reportTypeList: ExpenseReportType[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart({ loadingHint: msg().Exp_Msg_FetchingReport }));
    return dispatch(financeApprovalActions.get(requestId))
      .then(async (result) => {
        // check if cost center is changed manually on report click
        const currentReportType = reportTypeList.find(
          ({ id }) => id === result.payload.expReportTypeId
        );
        const isUseCostCenter =
          get(currentReportType, 'isCostCenterRequired', 'UNUSED') !== 'UNUSED';
        const reportEmpBaseId = get(result.payload, 'employeeBaseId');
        if (reportEmpBaseId && isUseCostCenter) {
          const costCenterCode = get(result.payload, 'costCenterCode');
          const reportDate = get(result.payload, 'accountingDate');
          const defaultCostCenter = await dispatch(
            getDefaultCostCenter(reportEmpBaseId, reportDate)
          );
          result.payload.isCostCenterChangedManually =
            costCenterCode &&
            get(defaultCostCenter, 'costCenterCode') !== costCenterCode;
        }
        dispatch(
          selectedExpReportActions.select(result.payload, requestTypeList)
        );
        dispatch(modeActions.reportSelect());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

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
        dispatch(fetchExpRequest(requestId, requestList, reportTypeListAll))
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

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
        dispatch(fetchExpRequest(requestId, requestList, reportTypeListAll))
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

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
          fetchExpRequest(expReport.requestId, undefined, reportTypeListAll)
        );
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(fetchFinanceApprovalIdList(companyId, sortBy, orderBy, null));
        dispatch(showToast(msg().Exp_Lbl_ReportIsSaved));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

/* Record */

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
        dispatch(fetchExpRequest(requestId, undefined, reportTypeListAll));
        dispatch(overlapActions.nonOverlapRecord());
        dispatch(showToast(msg().Exp_Lbl_ItemIsSaved));
        dispatch(fetchFinanceApprovalIdList(companyId, sortBy, orderBy, null));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const cloneReportInFA =
  (reportId: string, empId: string, isExpense: boolean) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    const clonePromise = isExpense
      ? expReportActions.clone(reportId, empId)
      : preRequestActions.clone(reportId, empId);
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
