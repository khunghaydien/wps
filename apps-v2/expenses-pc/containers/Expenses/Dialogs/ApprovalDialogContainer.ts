import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';

import ApprovalDialogView, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/Approval';
import msg from '../../../../commons/languages';

import { State } from '../../../modules';
import { dialogTypes } from '../../../modules/ui/expenses/dialog/activeDialog';
import { actions as commentActions } from '../../../modules/ui/expenses/dialog/approval/comment';
import { actions as errorActions } from '../../../modules/ui/expenses/dialog/approval/error';
import { actions as viewAction } from '../../../modules/ui/expenses/view';

import {
  cancelExpReportRequest,
  submitExpReport,
} from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State) => {
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const activeDialog = state.ui.expenses.dialog.activeDialog;
  const currentDialog = last(activeDialog);
  let title = msg().Exp_Lbl_Request;
  let mainButtonTitle = msg().Com_Btn_Request;
  if (currentDialog === dialogTypes.CANCEL_REQUEST) {
    title = msg().Exp_Lbl_Recall;
    mainButtonTitle = msg().Exp_Lbl_Recall;
  }

  return {
    title,
    mainButtonTitle,
    currentDialog,
    photoUrl:
      state.ui.expenses.delegateApplicant.originalEmployee.photoUrl ||
      state.userSetting.photoUrl,
    employeeId: state.userSetting.employeeId,
    comment: state.ui.expenses.dialog.approval.comment,
    errors: state.ui.expenses.dialog.approval.error,
    expReport: state.ui.expenses.selectedExpReport,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    subroleIds,
  };
};

const mapDispatchToProps = {
  submitExpReport,
  cancelExpReportRequest,
  onChangeComment: commentActions.set,
  resetApprovalError: errorActions.clear,
  setListView: viewAction.setListView,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickMainButton: () => {
    const { currentDialog, comment, employeeId, reportTypeList, subroleIds } =
      stateProps;
    const {
      expReport: { reportId, requestId, isCostCenterChangedManually },
    } = ownProps;
    dispatchProps.resetApprovalError();
    if (currentDialog === dialogTypes.APPROVAL) {
      dispatchProps
        .submitExpReport(
          reportId || '',
          comment,
          employeeId,
          !isEmpty(subroleIds)
            ? { empHistoryIds: stateProps.subroleIds }
            : undefined,
          isCostCenterChangedManually
        )
        // @ts-ignore
        .then(ownProps.validateForm);
    } else if (currentDialog === dialogTypes.CANCEL_REQUEST) {
      dispatchProps.cancelExpReportRequest(
        requestId || '',
        comment,
        employeeId,
        reportId || '',
        reportTypeList,
        !isEmpty(subroleIds)
          ? { empHistoryIds: stateProps.subroleIds }
          : undefined,
        isCostCenterChangedManually
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApprovalDialogView) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
