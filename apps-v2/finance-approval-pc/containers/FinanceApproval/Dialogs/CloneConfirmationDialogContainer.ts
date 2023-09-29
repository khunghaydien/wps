import { connect } from 'react-redux';

import CloneConfirmation, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CloneConfirmation';

import { State } from '../../../modules';
import { actions as activeDialogActions } from '../../../modules/ui/FinanceApproval/dialog/activeDialog';

import { cloneReportInFA } from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  selectedExpReport: state.ui.expenses.selectedExpReport,
  employeeId: state.userSetting.employeeId,
  isExpense: ownProps.isExpense,
});

const mapDispatchToProps = {
  cloneReportInFA,
  hideDialog: activeDialogActions.hide,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickCloneRequest: () => {
    const { selectedExpReport, employeeId } = stateProps;
    dispatchProps.hideDialog();
    dispatchProps.cloneReportInFA(
      selectedExpReport.preRequestId,
      employeeId,
      false
    );
  },
  onClickCloneReport: () => {
    const {
      selectedExpReport: { reportId },
      employeeId,
    } = stateProps;
    dispatchProps.hideDialog();
    dispatchProps.cloneReportInFA(reportId, employeeId, true);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CloneConfirmation) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
