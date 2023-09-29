import { connect } from 'react-redux';

import last from 'lodash/last';

import RecordItems from '../../../commons/components/exp/Form/Dialog/RecordItems';

import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';

import { openRecordItemsConfirmDialog } from '../../action-dispatchers/Expenses';

const mapStateToProps = (state, ownProps) => {
  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const currentDialog = last(activeDialog);
  // Company Switch
  const companyCountOption = state.ui.companyRequestCount.countOptions;
  const selectedCompanyId =
    state.ui.companyRequestCount.selectedComId || state.userSetting.companyId;
  const selectedComIndex = companyCountOption.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const { currencyCode, currencySymbol }: any =
    selectedComIndex > -1 ? companyCountOption[selectedComIndex] : {};

  return {
    currentDialog,
    expReport: ownProps.isPreApproval
      ? state.entities.exp.request.preRequest.expRequest
      : state.entities.exp.request.report.expRequest,
    recordIdx: state.ui.expenses.detail.recordsArea.selectedRecord,
    baseCurrencyCode: currencyCode || state.userSetting.currencyCode,
    baseCurrencySymbol: currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
  };
};

const mapDispatchToProps = {
  hideDialog: activeDialogActions.hide,
  hideAllDialog: activeDialogActions.hideAll,
  openRecordItemsConfirmDialog,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  isApproval: true,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordItems) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
