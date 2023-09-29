import { connect } from 'react-redux';

import { confirm } from '../../../commons/actions/app';
import ExpView from '../../../commons/components/exp';
import withLoading from '../../../commons/components/withLoading';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import DateUtil from '@apps/commons/utils/DateUtil';

import { VIEW_MODE } from '../../../domain/models/exp/Report';

import { actions as delegateApplicantActions } from '../../modules/ui/expenses/delegateApplicant/selectedEmployee';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import {
  MAX_PAGE_NUM,
  MAX_SEARCH_RESULT_NUM,
  PAGE_SIZE,
} from '../../modules/ui/expenses/reportList/page';
import { actions as tabAction } from '../../modules/ui/expenses/tab';
import { actions as viewAction } from '../../modules/ui/expenses/view';
import { clearDefaultCostCenter } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

import { initialize } from '../../action-dispatchers/app';
import { openSwitchEmployeeDialog } from '../../action-dispatchers/Dialog';
import {
  backFromDetailToList,
  clearSearchConditions, // pagination
  fetchExpReport,
  fetchExpReportIdList,
  fetchExpReportList,
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

function mapStateToProps(state) {
  const reportIdList = state.entities.reportIdList.reportIdList;
  const selectedRequestId =
    state.ui.expenses.selectedExpReport.reportId ||
    state.ui.expenses.selectedExpReport.preRequestId;
  // The idx of the screen being displayed.
  // if no report is selected, values is -1
  const currentRequestIdx = selectedRequestId
    ? reportIdList.indexOf(selectedRequestId)
    : -1;

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
    selectedTab: state.ui.expenses.tab,
    overlap: state.ui.expenses.overlap,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    userSetting: state.userSetting,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    expReportList: state.entities.exp.preRequest.expReportList,
    selectedView: state.ui.expenses.view,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    delegatorList: state.entities.exp.delegateApplicant,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    isLoading: appSelectors.loadingSelector(state),
    loadingHint: state.common.app.loadingHint,
    loadingAreas: state.common.app.loadingAreas,
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
  listVendor,
  openSwitchEmployeeDialog,
  onChangeTab: tabAction.changeTab,
  setListView: viewAction.setListView,
  clearDelegateApplicant: delegateApplicantActions.clear,
  clearDefaultCostCenter,
  changeModetoSelect: modeActions.reportSelect,
  updateRecordDate,
  hideAllDialogs: activeDialogActions.hideAll,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // Move to next to report. it's either +1 or -1
  onClickNextToRequestButton: (moveNum: number) => {
    const callback = (yes: boolean) => {
      if (yes) {
        dispatchProps.fetchExpReport(
          stateProps.reportIdList[stateProps.currentRequestIdx + moveNum],
          stateProps.reportTypeList,
          stateProps.employeeId,
          undefined,
          stateProps.companyId
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
    dispatchProps.updateRecordDate(DateUtil.getToday());
    if (stateProps.mode === modes.REPORT_EDIT) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.backFromDetailToList(
            stateProps.reportIdList,
            stateProps.currentRequestIdx,
            stateProps.expReportList
          );
          dispatchProps.setListView();
          dispatchProps.changeModetoSelect();
          dispatchProps.hideAllDialogs();
        }
      });
    } else {
      dispatchProps.backFromDetailToList(
        stateProps.reportIdList,
        stateProps.currentRequestIdx,
        stateProps.expReportList
      );
      dispatchProps.setListView();
      dispatchProps.hideAllDialogs();
    }
  },
  onChangeTab: (tabIndex: number) => {
    if (tabIndex) {
      dispatchProps.listVendor(stateProps.companyId);
      dispatchProps.clearSearchConditions();
    }
    dispatchProps.onChangeTab(tabIndex);
  },
  onClickExit: () => {
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
