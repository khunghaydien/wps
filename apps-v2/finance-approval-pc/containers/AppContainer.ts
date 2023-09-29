import { connect } from 'react-redux';

import expModuleType from '@apps/commons/constants/expModuleType';

import { actions as customHintActions } from '../../domain/modules/exp/customHint';
import { actions as expenseReportTypeActions } from '../../domain/modules/exp/expense-report-type/list';
import { actions as companyListActions } from '../modules/entities/companyList';
import { actions as preRequestListActions } from '../modules/entities/preRequestList';
import { actions as requestListActions } from '../modules/entities/requestList';
import { actions as bulkErrorActions } from '../modules/ui/FinanceApproval/bulkApproval/error';
import { setCompanyId } from '../modules/ui/FinanceApproval/companySwitch';
import { actions as selectedIdsActions } from '../modules/ui/FinanceApproval/RequestList/selectedIds';
import {
  isRequestTab,
  selectTab,
  Tab,
  TABS,
} from '../modules/ui/FinanceApproval/tabs';

import { initialize } from '../action-dispatchers/app';
import {
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalPreRequestIdList,
  fetchInitialSetting,
  resetFilters,
  setDefaultSearchCondition,
} from '../action-dispatchers/FinanceApproval';

import App from '../components';

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
  companyCountOption: state.entities.companyList,
  companyCount: state.ui.FinanceApproval.companyCount,
  overlap: state.ui.expenses.overlap,
  selectedCompanyId:
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId,
  selectedTab: state.ui.FinanceApproval.tabs.selected,
});

const mapDispatchToProps = {
  initialize,
  clearExpenseList: requestListActions.initialize,
  clearRequestList: preRequestListActions.initialize,
  fetchCompanyList: companyListActions.fetchCompanyList,
  setCompanyId,
  fetchInitialSetting,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalPreRequestIdList,
  fetchCustomHint: customHintActions.get,
  fetchReportTypeList: expenseReportTypeActions.list,
  resetFilters,
  selectTab,
  setDefaultSearchCondition,
  clearBulkError: bulkErrorActions.clear,
  clearSelectedIds: selectedIdsActions.clear,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeCompany: (companyId: string) => {
    const isRequestTabSelected = isRequestTab(stateProps.selectedTab);
    // Reset filters on company change
    dispatchProps.resetFilters();
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    dispatchProps.setDefaultSearchCondition(companyId, isRequestTabSelected);

    const dispatchFetchIdList = isRequestTabSelected
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchFetchIdList(companyId).then(() => {
      dispatchProps.setCompanyId(companyId);
    });
    dispatchProps.fetchReportTypeList(companyId, 'REPORT');
    dispatchProps.fetchCustomHint(companyId, 'Expense');
  },
  fetchCompanyList: () => {
    const { employeeId, companyId } = stateProps.userSetting;
    dispatchProps.fetchCompanyList(employeeId, companyId);
  },
  selectTab: (tab: Tab) => {
    const { selectedCompanyId } = stateProps;
    const isRequestTabSelected = isRequestTab(tab);

    dispatchProps.selectTab(tab);
    dispatchProps.resetFilters();
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    dispatchProps.setDefaultSearchCondition(
      selectedCompanyId,
      isRequestTabSelected
    );
    // refetch report type based on tab selected
    const usedIn =
      tab === TABS.REQUESTS ? expModuleType.REQUEST : expModuleType.REPORT;
    dispatchProps.fetchReportTypeList(selectedCompanyId, usedIn);
    // clear list and fetch report data based on tab selected
    if (isRequestTabSelected) {
      dispatchProps.clearRequestList();
      dispatchProps.fetchFinanceApprovalPreRequestIdList(selectedCompanyId);
    } else {
      dispatchProps.clearExpenseList();
      dispatchProps.fetchFinanceApprovalIdList(selectedCompanyId);
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(App) as React.ComponentType<Record<string, any>>;
