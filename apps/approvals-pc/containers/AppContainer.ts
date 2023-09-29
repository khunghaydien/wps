import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isEmpty from 'lodash/isEmpty';

import { actions as proxyEmployeeInfoActions } from '../../commons/modules/proxyEmployeeInfo';
import { actions as uiActionsPopoverMenu } from '../../commons/modules/widgets/PersonalMenuPopover/ui';

import { actions as switchApproverActions } from '../../../widgets/dialogs/SwitchApporverDialog/modules/entities';
import { actions as delegateApproverActions } from '../modules/entities/delegateApprover/assignment';
import { actions as proxyEmpAccessActions } from '../modules/entities/expenses/proxyEmpAccess';
import { actions as companyRequestCountActions } from '../modules/ui/companyRequestCount';

import { selectRequestType } from '../action-dispatchers/App';

import App from '../components/App';

const refreshNotification = (stateProps, listSwitchEmployee) => {
  if (['EXPENSES', 'EXP_PRE_APPROVAL'].includes(stateProps.selectedTab)) {
    listSwitchEmployee(stateProps.userSetting.employeeId);
  }
};

const mapStateToProps = (state) => ({
  empInfo: state.common.empInfo,
  requestCounts: state.ui.requestCounts,
  selectedTab: state.ui.tabs.selected,
  language: state.common.userSetting.language,
  userSetting: state.userSetting,
  isShowDADialog: state.common.delegateApprovalDialog.isNewAssignment,
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  isShowSwitchApproverDialog: state.widgets.SwitchApproverDialog.ui.isVisible,
  isDefaultCompany:
    !state.ui.companyRequestCount.selectedComId ||
    state.userSetting.companyId === state.ui.companyRequestCount.selectedComId,
  isShowSidePanel: !isEmpty(state.ui.expenses.detail.sideFilePreview),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      selectTab: selectRequestType,
      listDA: delegateApproverActions.list,
      listSwitchEmployee: switchApproverActions.list,
      unsetProxy: proxyEmployeeInfoActions.unset,
      hidePopover: uiActionsPopoverMenu.hide,
      clearProxyEmpAccess: proxyEmpAccessActions.clear,
      resetCompanyOption: companyRequestCountActions.resetOption,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  selectTab: (newSelectedTab) => {
    dispatchProps.selectTab(newSelectedTab, stateProps.selectedTab);
    if (!stateProps.isProxyMode) {
      refreshNotification(stateProps, dispatchProps.listSwitchEmployee);
    }
    if (!['EXPENSES', 'EXP_PRE_APPROVAL'].includes(newSelectedTab)) {
      dispatchProps.hidePopover();
    }
  },
  onExitProxyMode: () => {
    dispatchProps.unsetProxy();
    dispatchProps.clearProxyEmpAccess();
    dispatchProps.resetCompanyOption();
    refreshNotification(stateProps, dispatchProps.listSwitchEmployee);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
