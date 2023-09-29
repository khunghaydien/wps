import * as React from 'react';
import { connect } from 'react-redux';

import { State } from '../../modules';
import { actions as activeDialogActions } from '../../modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as dialogLoadingActions } from '@apps/expenses-pc/modules/ui/expenses/dialog/isLoading';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';

import { OwnProps } from '../../../expenses-pc/containers/Expenses/DialogContainer';

import FADialog, { Props } from '../../components/FinanceApproval/Dialog';

const mapStateToProps = (state: State) => ({
  activeDialog: state.ui.FinanceApproval.dialog.activeDialog,
  expActiveDialog: state.ui.expenses.dialog.activeDialog,
  selectedCompanyId:
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId,
  isRequestTab: isRequestTab(state.ui.FinanceApproval.tabs.selected),
});

const mapDispatchToProps = {
  hideDialog: activeDialogActions.hide,
  hideAllDialogs: activeDialogActions.hideAll,
  clearDialog: activeDialogActions.clear,
  clearRequestDialog: activeDialogActions.clearRequest,
  clearIsLoading: dialogLoadingActions.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickHideDialogButton: () => {
    dispatchProps.hideDialog();
    stateProps.isRequestTab
      ? dispatchProps.clearRequestDialog()
      : dispatchProps.clearDialog();
    dispatchProps.clearIsLoading();
  },
  hideAllDialogsAndClear: () => {
    dispatchProps.hideAllDialogs();
    stateProps.isRequestTab
      ? dispatchProps.clearRequestDialog()
      : dispatchProps.clearDialog();
    dispatchProps.clearIsLoading();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FADialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
