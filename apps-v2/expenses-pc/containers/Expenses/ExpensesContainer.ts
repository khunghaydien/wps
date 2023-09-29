import { connect } from 'react-redux';

import { get, isEmpty } from 'lodash';

import { confirm } from '../../../commons/actions/app';
import ExpView from '../../../commons/components/exp';
import withLoading from '../../../commons/components/withLoading';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import subRoleOptionHelper from '@apps/commons/components/exp/SubRole/subRoleOptionCreator';
import DateUtil from '@apps/commons/utils/DateUtil';
import CompanyActions from '@commons/action-dispatchers/Company';

import { expenseListArea, VIEW_MODE } from '@apps/domain/models/exp/Report';

import { actions as delegateApplicantActions } from '../../modules/ui/expenses/delegateApplicant/selectedEmployee';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import {
  MAX_PAGE_NUM,
  MAX_SEARCH_RESULT_NUM,
  PAGE_SIZE,
} from '../../modules/ui/expenses/reportList/page';
import { actions as viewAction } from '../../modules/ui/expenses/view';
import { clearDefaultCostCenter } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { actions as reportActions } from '@apps/domain/modules/exp/expense-report-type/list';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';
import { actions as accountingPeriodActions } from '@apps/expenses-pc/modules/ui/expenses/recordListPane/accountingPeriod';

import { initialize } from '../../action-dispatchers/app';
import {
  openSubRoleInfoDialog,
  openSwitchEmployeeDialog,
} from '../../action-dispatchers/Dialog';
import {
  backFromDetailToList,
  changeListTab,
  clearSearchConditions,
  fetchExpReport,
  fetchExpReportIdList,
  fetchExpReportList,
  fetchHistories,
  fetchReportDetail,
  getUserSettings,
  setSelectedSubRole,
  setSelectedTabCompanyId,
  setSubroleIds,
} from '../../action-dispatchers/Expenses';
import { listVendor } from '../../action-dispatchers/Vendor';

import withExpensesHOC from '../../components/Expenses';

// this function contains labels which are different in Expense and Request. if this label edited, change same object in Request
// 経費申請と事前申請で表示するラベルが異なるものを格納。この関数を編集したら、事前申請の同じ関数も編集してください

function labelObject() {
  return {
    reports: msg().Exp_Lbl_Reports,
    newReport: msg().Exp_Lbl_NewReportCreateExp,
    report: msg().Exp_Lbl_Report,
  };
}

const _ = undefined;
/**
 * Resets the subrole states to set first active role of tab company as selected role
 * @param dispatchProps
 * @param companyId
 * @param companySubroleId First Active Company Subrole Id: Used to set list page settings
 */
async function resetSubroleStates(dispatchProps, companyId, companySubroleId) {
  dispatchProps.setSelectedExpenseSubRole(companySubroleId);
  await dispatchProps.getUserSettings(companySubroleId, true);
  dispatchProps.getAccountingPeriod(companyId);
}

function mapStateToProps(state) {
  const isLoading = appSelectors.loadingSelector(state);
  const isPartialLoading = appSelectors.loadingAreaSelector(state);
  const reportLoading = isLoading || isPartialLoading;
  const reportIdList = state.entities.reportIdList.reportIdList;
  const isFromPreRequest = !!state.ui.expenses.selectedExpReport.preRequestId;
  const selectedRequestId =
    state.ui.expenses.selectedExpReport.reportId ||
    state.ui.expenses.selectedExpReport.preRequestId;
  // The idx of the screen being displayed.
  // if no report is selected, values is -1
  const currentRequestIdx = selectedRequestId
    ? reportIdList.indexOf(selectedRequestId)
    : -1;
  const apActive = state.ui.expenses.recordListPane.accountingPeriod.filter(
    (ap) => ap.active
  );

  const employeeDetails = state.common.exp.entities.employeeDetails;
  const companies = state.common.exp.entities.companyDetails;

  const subrolesMap = subRoleOptionHelper.getSubRoleOptionsCompanyMap(
    employeeDetails.details,
    companies
  );

  const employHistories = get(employeeDetails, 'details', undefined);
  const tabCompanyId = get(state, 'ui.expenses.tab.companyId');
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const selectedDelegator = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(selectedDelegator);
  const primaryRole = subRoleOptionHelper.getPrimaryRole(employHistories);
  const isPrimaryCompany =
    isEmpty(employHistories) || primaryRole?.companyId === tabCompanyId;
  const loadingAreas = get(state, 'common.app.loadingAreas', []);
  const isListLoading = loadingAreas.includes(expenseListArea);

  return {
    // pagination props
    currentRequestIdx,
    currentPage: state.ui.expenses.reportList.page,
    requestTotalNum: state.entities.reportIdList.totalSize,
    orderBy: state.ui.expenses.reportList.orderBy,
    sortBy: state.ui.expenses.reportList.sortBy,
    pageSize: PAGE_SIZE,
    maxPageNo: MAX_PAGE_NUM,
    maxSearchNo: MAX_SEARCH_RESULT_NUM,
    reportIdList,
    // end of pagination props
    labelObject,
    mode: state.ui.expenses.mode,
    selectedView: state.ui.expenses.view,
    overlap: state.ui.expenses.overlap,
    selectedTab: state.ui.expenses.tab.tabIdx,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    userSetting: state.userSetting,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    expReportList: state.entities.exp.report.expReportList,
    selectedDelegator,
    delegatorList: state.entities.exp.delegateApplicant,
    employeeId: state.userSetting.employeeId,
    apActive,
    companyId: state.userSetting.companyId,
    isLoading: appSelectors.loadingSelector(state),
    loadingHint: state.common.app.loadingHint,
    loadingAreas,
    subrolesMap,
    reportLoading,
    isFromPreRequest,
    employHistories,
    tabCompanyId,
    subroleIds,
    isProxyMode,
    primaryRole,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    isPartialLoading,
    isPrimaryCompany,
    isListLoading,
  };
}

const mapDispatchToProps = {
  initialize,
  confirm,
  fetchExpReportList,
  fetchReportDetail,
  // pagination
  backFromDetailToList,
  fetchExpReportIdList,
  clearSearchConditions,
  fetchExpReport,
  listVendor,
  changeListTab,
  setListView: viewAction.setListView,
  openSwitchEmployeeDialog,
  clearDelegateApplicant: delegateApplicantActions.clear,
  changeModetoSelect: modeActions.reportSelect,
  updateRecordDate,
  openSubRoleInfoDialog,
  fetchHistories,
  searchCompany: CompanyActions.fetchCompanies,
  setSubroleIds,
  clearDefaultCostCenter,
  setSelectedTabCompanyId,
  setSelectedExpenseSubRole: setSelectedSubRole,
  getAccountingPeriod: accountingPeriodActions.search,
  clearList: reportActions.clearList,
  hideAllDialogs: activeDialogActions.hideAll,
  getUserSettings,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Exit Delegator Applicant mode
  onClickExit: () => {
    dispatchProps.setSelectedExpenseSubRole(undefined);
    dispatchProps.initialize(null, null, !!stateProps.selectedTab);
    dispatchProps.clearDelegateApplicant();
    dispatchProps.clearDefaultCostCenter();
    if (stateProps.selectedView === VIEW_MODE.REPORT_DETAIL) {
      dispatchProps.setListView();
    }
  },
  // Move to next to report. it's either +1 or -1
  onClickNextToRequestButton: (moveNum: number) => {
    const nextReportIndex = stateProps.currentRequestIdx + moveNum;
    const nextReportId = stateProps.reportIdList[nextReportIndex];
    const nextReport = stateProps.expReportList.find(
      (i) => i.reportId === nextReportId
    );
    const reportStatus = nextReport ? get(nextReport, 'status', null) : null;
    const empHistoryId = get(nextReport, 'empHistoryId');
    const callback = (yes: boolean) => {
      const { employeeId, tabCompanyId, apActive } = stateProps;
      if (yes) {
        dispatchProps.fetchReportDetail(
          reportStatus,
          nextReportId,
          employeeId,
          undefined,
          empHistoryId,
          tabCompanyId,
          apActive
        );
      }
    };
    if (stateProps.mode === modes.REPORT_EDIT) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, callback);
    } else {
      callback(true);
    }
  },
  // selects the correct index when going back to list view.
  onClickBackButton: () => {
    const {
      tabCompanyId,
      companyId,
      isProxyMode,
      subroleIds,
      employHistories,
      subrolesMap,
      isPrimaryCompany,
    } = stateProps;
    let toUseSubroleIds = subroleIds;
    if (isEmpty(toUseSubroleIds)) {
      if (!isEmpty(subrolesMap) && !isEmpty(companyId)) {
        const subroles = subrolesMap[companyId];
        if (!isEmpty(subroles))
          toUseSubroleIds = subroles
            .filter((s) => s !== undefined && s.value)
            .map((s) => s.value);
      }
    }
    if ([modes.REPORT_EDIT, modes.BULK_RECORD_EDIT].includes(stateProps.mode)) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.backFromDetailToList(
            stateProps.reportIdList,
            stateProps.currentRequestIdx,
            stateProps.expReportList,
            stateProps.employeeId,
            tabCompanyId === companyId || isProxyMode
          );
          dispatchProps.setListView();
          dispatchProps.changeModetoSelect();
          if (!isProxyMode)
            resetSubroleStates(
              dispatchProps,
              companyId,
              subRoleOptionHelper.getFirstActiveRole(
                toUseSubroleIds,
                employHistories,
                isPrimaryCompany
              )
            );
          dispatchProps.hideAllDialogs();
        }
      });
    } else {
      dispatchProps.backFromDetailToList(
        stateProps.reportIdList,
        stateProps.currentRequestIdx,
        stateProps.expReportList,
        undefined,
        tabCompanyId === companyId || isProxyMode
      );
      dispatchProps.setListView();
      if (!isProxyMode)
        resetSubroleStates(
          dispatchProps,
          companyId,
          subRoleOptionHelper.getFirstActiveRole(
            toUseSubroleIds,
            employHistories,
            isPrimaryCompany
          )
        );
      dispatchProps.hideAllDialogs();
    }
    dispatchProps.updateRecordDate(DateUtil.getToday());
  },
  onChangeTab: (tabIndex: number, companyId?: string, isApproval?: boolean) => {
    if (tabIndex % 2 === 1) {
      dispatchProps.listVendor(companyId);
    }
    dispatchProps.clearSearchConditions();
    dispatchProps.changeListTab(tabIndex, companyId, true, isApproval, true);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(withExpensesHOC(withLoading(ExpView))) as React.ComponentType<
  Record<string, any>
>;
