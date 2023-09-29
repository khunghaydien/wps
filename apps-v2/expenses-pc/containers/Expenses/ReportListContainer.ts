import { connect } from 'react-redux';

import { cloneDeep, get, isEmpty } from 'lodash';

import ReportListView from '../../../commons/components/exp/ReportList';
import { selectors as appSelectors } from '../../../commons/modules/app';
import subRoleOptionCreator from '@apps/commons/components/exp/SubRole/subRoleOptionCreator';
import { DateRangeOption } from '@commons/components/fields/DropdownDateRange';
import { actions as advSearchReportTypeActions } from '@commons/modules/exp/entities/reportTypeList';
import { actions as submitDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';

import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
// Pagination
import {
  MAX_PAGE_NUM,
  MAX_SEARCH_RESULT_NUM,
  PAGE_SIZE,
} from '../../modules/ui/expenses/reportList/page';
import { actions as selectedExpReportActions } from '../../modules/ui/expenses/selectedExpReport';
import { actions as viewAction } from '../../modules/ui/expenses/view';
import { actions as accountingPeriodActions } from '@apps/expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';

import {
  fetchExpReport,
  fetchExpReportIdList, // pagination
  fetchExpReportList,
  fetchReportDetail,
  getUserSettings,
  setSelectedSubRole,
} from '../../action-dispatchers/Expenses';

const mapStateToProps = (state, ownProps) => {
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const tabCompanyId = get(state, 'ui.expenses.tab.companyId');
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(selectedDelegator);
  const employeeDetails = state.common.exp.entities.employeeDetails;
  const employHistories = get(employeeDetails, 'details', undefined);
  return {
    // pagination props
    currentPage: state.ui.expenses.reportList.page,
    requestTotalNum: state.entities.reportIdList.totalSize,
    orderBy: state.ui.expenses.reportList.orderBy,
    sortBy: state.ui.expenses.reportList.sortBy,
    pageSize: PAGE_SIZE,
    maxPageNo: MAX_PAGE_NUM,
    maxSearchNo: MAX_SEARCH_RESULT_NUM,
    reportIdList: state.entities.reportIdList.reportIdList,
    companyId: state.userSetting.companyId,

    // default cost center
    employeeId: state.userSetting.employeeId,
    subroleIds,
    tabCompanyId,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,

    // end of pagination props
    expReportList: state.entities.exp.report.expReportList,
    mode: state.ui.expenses.mode,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    reportTypeList: state.entities.exp.expenseReportType.list.active,

    // advanced search
    advSearchCondition: state.common.exp.ui.reportList.advSearch,

    apActive: state.ui.expenses.recordListPane.accountingPeriod.filter(
      (ap) => ap.active
    ),
    // report list loading
    isLoading: appSelectors.loadingSelector(state),
    loadingAreas: state.common.app.loadingAreas,
    isProxyMode,
    employHistories,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  fetchExpReport,
  fetchExpReportList,
  fetchExpReportIdList,
  clearSelectedReport: selectedExpReportActions.clear,
  moveToExpensesForm: overlapActions.overlapReport,
  searchAccountPeriod: accountingPeriodActions.search,
  setDetailView: viewAction.setDetailView,
  onClickInputValueSubmitDate: submitDateActions.set,
  updateReportTypeOption: advSearchReportTypeActions.list,
  fetchReportDetail,
  setSelectedSubRole,
  getUserSettings,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickInputValueSubmitDate: (date: DateRangeOption) => {
    const {
      tabCompanyId,
      employeeId,
      advSearchCondition: { requestDateRange },
      subroleIds,
    } = stateProps;
    dispatchProps.onClickInputValueSubmitDate(date);
    if (
      date.startDate !== requestDateRange.startDate ||
      date.endDate !== requestDateRange.endDate
    ) {
      dispatchProps.updateReportTypeOption(
        tabCompanyId,
        date.startDate,
        date.endDate,
        employeeId,
        undefined,
        subroleIds
      );
    }
  },
  onClickRefreshButton: (isApproved: boolean) => {
    dispatchProps.fetchExpReportIdList(
      isApproved,
      stateProps.employeeId,
      undefined,
      undefined,
      !isEmpty(stateProps.subroleIds)
        ? { empHistoryIds: stateProps.subroleIds }
        : undefined,
      undefined,
      undefined,
      stateProps.subroleIds,
      stateProps.tabCompanyId
    );
    dispatchProps.clearSelectedReport();
  },
  onClickPagerLink: (pageNum: number) => {
    dispatchProps.fetchExpReportList(
      stateProps.reportIdList,
      pageNum,
      stateProps.employeeId,
      stateProps.subroleIds
    );
  },
  onClickReportItem: (status, reportNo, empHistoryId) => {
    const { employeeId, defaultCostCenter, apActive, tabCompanyId } =
      stateProps;
    dispatchProps.clearSelectedReport();
    dispatchProps.setDetailView();
    dispatchProps.moveToExpensesForm();
    dispatchProps.setSelectedSubRole(empHistoryId);
    dispatchProps.searchAccountPeriod(tabCompanyId);
    dispatchProps.fetchReportDetail(
      status,
      reportNo,
      employeeId,
      defaultCostCenter,
      empHistoryId,
      tabCompanyId,
      apActive
    );
  },
  onClickAdvSearchButton: () => {
    const conditions = cloneDeep(stateProps.advSearchCondition);
    delete conditions.detail;
    dispatchProps.fetchExpReportIdList(
      true,
      stateProps.employeeId,
      null,
      null,
      {
        ...conditions,
        ...(!isEmpty(stateProps.subroleIds)
          ? { empHistoryIds: stateProps.subroleIds }
          : {}),
      },
      undefined,
      undefined
    );
  },
  fetchExpReportIdList: async (
    isApproved,
    advSearchCondition,
    init = false
  ) => {
    const {
      employeeId,
      subroleIds,
      isProxyMode,
      tabCompanyId,
      employHistories,
    } = stateProps;
    if (init && !isProxyMode) {
      await dispatchProps.getUserSettings(
        subRoleOptionCreator.getFirstActiveRole(subroleIds, employHistories),
        true
      );
    }
    dispatchProps.fetchExpReportIdList(
      isApproved,
      employeeId,
      null,
      null,
      {
        ...(isApproved ? { ...advSearchCondition } : {}),
        ...(!isEmpty(subroleIds) ? { empHistoryIds: subroleIds } : {}),
      },
      undefined,
      undefined,
      tabCompanyId
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReportListView) as React.ComponentType<Record<string, any>>;
