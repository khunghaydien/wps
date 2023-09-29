import { connect } from 'react-redux';

import { ORDER_BY, SortBy } from '../../../domain/models/exp/FinanceApproval';

import { actions as overlapActions } from '../../../expenses-pc/modules/ui/expenses/overlap';
import { actions as accountingPeriodActions } from '../../../expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';

import {
  fetchExpRequest,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
} from '../../action-dispatchers/FinanceApproval';

import RequestListView from '../../components/FinanceApproval/RequestList';

const mapStateToProps = (state) => {
  const companyList = state.entities.companyList;
  const selectedCompanyId =
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId;
  const selectedComIndex = companyList.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const { currencySymbol = '', currencyDecimalPlaces = null } =
    selectedComIndex > -1 ? companyList[selectedComIndex] : {};

  return {
    selectedCompanyId,
    mode: state.ui.expenses.mode,
    companyId: state.userSetting.companyId,
    currentPage: state.ui.FinanceApproval.RequestList.page,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    requestList: state.entities.requestList,
    requestIdList: state.entities.requestIdList.requestIdList,
    requestTotalNum: state.entities.requestIdList.totalSize,
    baseCurrencySymbol: currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    orderBy: state.ui.FinanceApproval.RequestList.orderBy,
    sortBy: state.ui.FinanceApproval.RequestList.sortBy,
    advSearchCondition: state.common.exp.ui.reportList.advSearch,
  };
};

const mapDispatchToProps = {
  fetchExpRequest,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
  moveToExpensesForm: overlapActions.overlapReport,
  searchAccountPeriod: accountingPeriodActions.search,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickRefreshButton: () => {
    // To search using same condition for last search
    dispatchProps.fetchFinanceApprovalIdList(
      stateProps.selectedCompanyId,
      '',
      '',
      stateProps.advSearchCondition
    );
  },
  onClickRequestItem: (requestId: string) => {
    const { selectedCompanyId, reportTypeList, requestList } = stateProps;
    dispatchProps.fetchExpRequest(requestId, requestList, reportTypeList);
    dispatchProps.moveToExpensesForm();
    dispatchProps.searchAccountPeriod(selectedCompanyId);
  },
  onClickPagerLink: (pageNum: number) => {
    dispatchProps.fetchFinanceApprovalList(stateProps.requestIdList, pageNum);
  },
  onClickSortKey: (sortKey: SortBy) => {
    // List is sorted by Desc when sortKey is same last time and current order is asc
    const orderBy =
      stateProps.sortBy === sortKey && stateProps.orderBy === ORDER_BY.Asc
        ? ORDER_BY.Desc
        : ORDER_BY.Asc;
    dispatchProps.fetchFinanceApprovalIdList(
      stateProps.selectedCompanyId,
      sortKey,
      orderBy,
      stateProps.advSearchCondition
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RequestListView) as React.ComponentType<Record<string, any>>;
