import { connect } from 'react-redux';

import { ORDER_BY, SortBy } from '../../../domain/models/exp/FinanceApproval';
import { BulkError } from '@apps/domain/models/approval/request/Request';

import { actions as overlapActions } from '../../../expenses-pc/modules/ui/expenses/overlap';
import { actions as accountingPeriodActions } from '../../../expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';
import {
  actions as activeDialogActions,
  dialogTypes,
} from '@apps/finance-approval-pc/modules/ui/FinanceApproval/dialog/activeDialog';
import {
  actions as bulkErrorActions,
  actions as selectedIdsActions,
} from '@apps/finance-approval-pc/modules/ui/FinanceApproval/RequestList/selectedIds';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';

import {
  fetchExpRequest,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
  fetchFinanceApprovalPreRequestIdList,
  fetchPreRequestReport,
} from '../../action-dispatchers/FinanceApproval';

import RequestListView from '../../components/FinanceApproval/RequestList';

const getRequestError = (
  bulkErrorList: Array<BulkError>,
  requestIdErrorList: Array<string>,
  requestId: string
) => {
  if (requestIdErrorList.includes(requestId)) {
    const index = requestIdErrorList.indexOf(requestId);
    return bulkErrorList[index];
  }
  return null;
};

const mapStateToProps = (state) => {
  const companyList = state.entities.companyList;
  const selectedCompanyId =
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId;
  const selectedComIndex = companyList.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const { currencySymbol = '', currencyDecimalPlaces = null } =
    selectedComIndex > -1 ? companyList[selectedComIndex] : {};

  const selectedTab = state.ui.FinanceApproval.tabs.selected;
  const isRequestTabSelected = isRequestTab(selectedTab);
  const requestIdListPath = isRequestTabSelected
    ? 'preRequestIdList'
    : 'requestIdList';
  const requestListPath = isRequestTabSelected
    ? 'preRequestList'
    : 'requestList';
  const selectedIds = state.ui.FinanceApproval.RequestList.selectedIds;
  const bulkApprovalErrors = state.ui.FinanceApproval.bulkApproval.error;
  const bulkApprovalErrorIds = bulkApprovalErrors.map(
    ({ requestId }) => requestId
  );
  const requestList = state.entities[requestListPath].map((request) => ({
    ...request,
    error: getRequestError(
      bulkApprovalErrors,
      bulkApprovalErrorIds,
      request.requestId
    ),
  }));

  return {
    selectedCompanyId,
    mode: state.ui.expenses.mode,
    companyId: state.userSetting.companyId,
    currentPage: state.ui.FinanceApproval.RequestList.page,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    requestList,
    requestIdList: state.entities[requestIdListPath].requestIdList,
    requestTotalNum: state.entities[requestIdListPath].totalSize,
    baseCurrencySymbol: currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    orderBy: state.ui.FinanceApproval.RequestList.orderBy,
    sortBy: state.ui.FinanceApproval.RequestList.sortBy,
    advSearchCondition: state.common.exp.ui.reportList.advSearch,
    isRequestTab: isRequestTabSelected,
    selectedIds,
  };
};

const mapDispatchToProps = {
  fetchExpRequest,
  fetchPreRequestReport,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
  fetchFinanceApprovalPreRequestIdList,
  moveToExpensesForm: overlapActions.overlapReport,
  searchAccountPeriod: accountingPeriodActions.search,
  setSelectedIds: selectedIdsActions.set,
  clearSelectedIds: selectedIdsActions.clear,
  openBulkApproveDialog: activeDialogActions.bulkApproveConfirm,
  openBulkRejectDialog: activeDialogActions.bulkRejectConfirm,
  clearBulkError: bulkErrorActions.clear,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickRefreshButton: () => {
    // To search using same condition for last search
    const idListAction = stateProps.isRequestTab
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    idListAction(
      stateProps.selectedCompanyId,
      '',
      '',
      stateProps.advSearchCondition
    );
  },
  onClickRequestItem: async (requestId: string) => {
    const { isRequestTab, selectedCompanyId, reportTypeList, requestList } =
      stateProps;
    if (isRequestTab) {
      await dispatchProps.fetchPreRequestReport(
        requestId,
        selectedCompanyId,
        requestList,
        reportTypeList
      );
    } else {
      await dispatchProps.fetchExpRequest(
        requestId,
        requestList,
        true,
        reportTypeList
      );
    }
    dispatchProps.moveToExpensesForm();
    dispatchProps.searchAccountPeriod(selectedCompanyId);
  },
  onClickPagerLink: (pageNum: number) => {
    const { requestIdList, isRequestTab } = stateProps;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    dispatchProps.fetchFinanceApprovalList(
      requestIdList,
      pageNum,
      isRequestTab
    );
  },
  onClickSortKey: (sortKey: SortBy) => {
    // List is sorted by Desc when sortKey is same last time and current order is asc
    const orderBy =
      stateProps.sortBy === sortKey && stateProps.orderBy === ORDER_BY.Asc
        ? ORDER_BY.Desc
        : ORDER_BY.Asc;
    const idListAction = stateProps.isRequestTab
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    idListAction(
      stateProps.selectedCompanyId,
      sortKey,
      orderBy,
      stateProps.advSearchCondition
    );
  },
  onChangeRowSelection: ({ id, checked }) => {
    const { selectedIds, requestList } = stateProps;
    if (id) {
      const newSelectedIds = checked
        ? [...selectedIds, id]
        : selectedIds.filter((x) => x !== id);
      dispatchProps.setSelectedIds(newSelectedIds);
    } else {
      const newSelectedIds = requestList.map(({ requestId }) => requestId);
      const result = checked ? newSelectedIds : [];
      dispatchProps.setSelectedIds(result);
    }
  },
  onClickBulkReject: () => {
    dispatchProps.openBulkRejectDialog(dialogTypes.BULK_REJECT_CONFIRM);
  },
  onClickBulkApproval: () => {
    dispatchProps.openBulkApproveDialog(dialogTypes.BULK_APPROVE_CONFIRM);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RequestListView) as React.ComponentType<Record<string, any>>;
