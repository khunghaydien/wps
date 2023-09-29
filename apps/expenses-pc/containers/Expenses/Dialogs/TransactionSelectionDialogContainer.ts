import { connect } from 'react-redux';

import find from 'lodash/find';

import TransactionSelection, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/TransactionSelection';
import { PROGRESS_STATUS } from '../../../../commons/components/ProgressBar';

import { State } from '../../../modules';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';
import { actions as transactionSelectActions } from '../../../modules/ui/expenses/dialog/transactionSelect/selected';

import { openExpenseTypeDialog } from '../../../action-dispatchers/Dialog';
import { getCreditCardTransactions } from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  baseCurrencySymbol:
    ownProps.currencySymbol || state.userSetting.currencySymbol,
  progressBar: state.ui.expenses.dialog.progressBar,
  selectedTransaction: state.ui.expenses.dialog.transactionSelect.selected,
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
});

const mapDispatchToProps = {
  getCCTransaction: getCreditCardTransactions,
  openExpenseTypeDialog,
  setProgressBar: progressBarActions.set,
  resetProgressBar: progressBarActions.clear,
  setSelectedTransaction: transactionSelectActions.set,
  clearSelectedTransaction: transactionSelectActions.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  getCreditCardTransactions: (from, to, cardNameList) =>
    // @ts-ignore
    dispatchProps.getCCTransaction(
      stateProps.companyId,
      stateProps.employeeId,
      from,
      to,
      cardNameList
    ),
  onClickNextButton: () => {
    const recordDate =
      stateProps.selectedTransaction.transactionDate ||
      ownProps.expReport.accountingDate;

    dispatchProps.openExpenseTypeDialog(
      stateProps.employeeId,
      stateProps.companyId,
      recordDate,
      'General',
      ownProps.expReport.expReportTypeId || '',
      false
    );

    const steps = stateProps.progressBar || [];
    steps[steps.length - 1].status = PROGRESS_STATUS.SELECTED;
    dispatchProps.setProgressBar(steps);
  },
  hideAndReset: () => {
    ownProps.onClickHideDialogButton();
    dispatchProps.clearSelectedTransaction();
  },
  selectedAccountingPeriod: (() => {
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    return selectedAccountingPeriod;
  })(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TransactionSelection) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
