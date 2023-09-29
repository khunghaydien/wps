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

import { initialize } from '../../action-dispatchers/app';
import {
  openSubRoleInfoDialog,
  openSwitchEmployeeDialog,
} from '../../action-dispatchers/Dialog';
import {
  backFromDetailToList,
  changeListTab,
  clearSearchConditions, // pagination
  fetchExpReport,
  fetchExpReportIdList,
  fetchExpReportList,
  fetchHistories,
  fetchReportDetail,
  getUserSettings,
  setSelectedSubRole,
  setSelectedTabCompanyId,
  setSubroleIds,
} from '../../action-dispatchers/Requests';
import { listVendor } from '../../action-dispatchers/Vendor';

import withRequestsHOC from '../../components/Requests';

function labelObject() {
  return {
    reports: msg().Exp_Lbl_ReportsRequest,
    newReport: msg().Exp_Lbl_NewReportCreateReq,
    report: msg().Exp_Lbl_ExpRequest,
  };
}

const _ = undefined;

/**
 * Resets the subrole states to set primary role as selected role
 * @param dispatchProps
 * @param companySubroleId First Active Company Subrole Id: Used to set list page settings
 */
async function resetSubroleStates(dispatchProps, companySubroleId) {
  dispatchProps.setSelectedExpenseSubRole(companySubroleId);
  await dispatchProps.getUserSettings(companySubroleId, true);
}

function mapStateToProps(state) {
  const isLoading = appSelectors.loadingSelector(state);
  const isPartialLoading = appSelectors.loadingAreaSelector(state);
  const reportLoading = isLoading || isPartialLoading;
  const reportIdList = state.entities.reportIdList.reportIdList;
  const selectedRequestId =
    state.ui.expenses.selectedExpReport.reportId ||
    state.ui.expenses.selectedExpReport.preRequestId;
  // The idx of the screen being displayed.
  // if no report is selected, values is -1
  const currentRequestIdx = selectedRequestId
    ? reportIdList.indexOf(selectedRequestId)
    : -1;

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
    selectedTab: state.ui.expenses.tab.tabIdx,
    overlap: state.ui.expenses.overlap,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    userSetting: state.userSetting,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    expReportList: state.entities.exp.preRequest.expReportList,
    selectedView: state.ui.expenses.view,
    selectedDelegator,
    delegatorList: state.entities.exp.delegateApplicant,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    isLoading: appSelectors.loadingSelector(state),
    loadingHint: state.common.app.loadingHint,
    loadingAreas,
    subrolesMap,
    reportLoading,
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
  clearSearchConditions,
  // pagination
  backFromDetailToList,
  fetchExpReportIdList,
  fetchExpReport,
  fetchReportDetail,
  listVendor,
  openSwitchEmployeeDialog,
  changeListTab,
  setListView: viewAction.setListView,
  clearDelegateApplicant: delegateApplicantActions.clear,
  clearDefaultCostCenter,
  changeModetoSelect: modeActions.reportSelect,
  updateRecordDate,
  openSubRoleInfoDialog,
  fetchHistories,
  searchCompany: CompanyActions.fetchCompanies,
  setSubroleIds,
  setSelectedTabCompanyId,
  setSelectedExpenseSubRole: setSelectedSubRole,
  clearList: reportActions.clearList,
  hideAllDialogs: activeDialogActions.hideAll,
  getUserSettings,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Move to next to report. it's either +1 or -1
  onClickNextToRequestButton: (moveNum: number) => {
    const callback = (yes: boolean) => {
      if (yes) {
        const nextReportIndex = stateProps.currentRequestIdx + moveNum;
        const nextReportId = stateProps.reportIdList[nextReportIndex];
        const nextReport = stateProps.expReportList.find(
          (i) => i.reportId === nextReportId
        );
        const empHistoryId = get(nextReport, 'empHistoryId');
        const { employeeId, tabCompanyId } = stateProps;
        dispatchProps.fetchReportDetail(
          nextReportId,
          employeeId,
          undefined,
          empHistoryId,
          tabCompanyId
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
      companyId,
      tabCompanyId,
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
            undefined,
            tabCompanyId === companyId || isProxyMode
          );
          dispatchProps.setListView();
          dispatchProps.changeModetoSelect();
          if (!isProxyMode)
            resetSubroleStates(
              dispatchProps,
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
  onClickExit: () => {
    dispatchProps.setSelectedExpenseSubRole(undefined);
    dispatchProps.initialize(null, null, !!stateProps.selectedTab);
    dispatchProps.clearDelegateApplicant();
    dispatchProps.clearDefaultCostCenter();
    if (stateProps.selectedView === VIEW_MODE.REPORT_DETAIL) {
      dispatchProps.setListView();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(withRequestsHOC(withLoading(ExpView))) as React.ComponentType<
  Record<string, any>
>;
