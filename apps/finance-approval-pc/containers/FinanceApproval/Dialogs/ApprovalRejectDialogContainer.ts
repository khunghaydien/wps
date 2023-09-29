import { connect } from 'react-redux';

import last from 'lodash/last';

import ApprovalReject, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/Approval';
import msg from '../../../../commons/languages';

import { actions as commentActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { actions as errorActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/error';
import { State } from '../../../modules';
import { dialogTypes } from '../../../modules/ui/FinanceApproval/dialog/activeDialog';
import { MAX_SEARCH_RESULT_NUM } from '../../../modules/ui/FinanceApproval/RequestList/page';

import {
  approve as approveFA,
  reject as rejectFA,
} from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const mapStateToProps = (state: State) => {
  const activeDialog = state.ui.FinanceApproval.dialog.activeDialog;
  const currentDialog = last(activeDialog);
  let title = msg().Exp_Lbl_Reject;
  let mainButtonTitle = msg().Exp_Lbl_Reject;
  if (currentDialog === dialogTypes.CONFIRM_APPROVAL) {
    title = msg().Exp_Lbl_Approve;
    mainButtonTitle = msg().Exp_Lbl_Approve;
  }
  return {
    title,
    mainButtonTitle,
    currentDialog,
    photoUrl: state.userSetting.photoUrl,
    requestList: state.entities.requestList,
    requestIdList: state.entities.requestIdList,
    reportTypeListActive: state.entities.exp.expenseReportType.list.active,
    reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
    comment: state.ui.expenses.dialog.approval.comment,
    errors: state.ui.expenses.dialog.approval.error,
    expReport: state.ui.expenses.selectedExpReport,
  };
};

const mapDispatchToProps = {
  rejectFA,
  approveFA,
  onChangeComment: commentActions.set,
  resetComment: commentActions.clear,
  resetApprovalError: errorActions.clear,
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
    dispatchProps.resetComment();
    dispatchProps.resetApprovalError();
    const {
      requestList,
      requestIdList,
      comment,
      reportTypeListActive,
      reportTypeListInactive,
    } = stateProps;
    const requestId = ownProps.expReport.requestId;
    const requestIds = requestIdList && requestIdList.requestIdList;
    const index = requestIds.indexOf(requestId);
    const totalRequests = requestIdList.totalSize;
    const maxIndex =
      totalRequests < MAX_SEARCH_RESULT_NUM
        ? totalRequests - 1
        : MAX_SEARCH_RESULT_NUM - 1;
    const nextIndex = index === maxIndex ? index : index + 1;
    const reqIdList = requestId ? [requestId] : [];
    const reportTypeAll = [...reportTypeListActive, ...reportTypeListInactive];
    if (stateProps.currentDialog === dialogTypes.CONFIRM_APPROVAL) {
      dispatchProps.approveFA(
        reqIdList,
        requestIds[nextIndex],
        requestList,
        comment,
        reportTypeAll
      );
    } else {
      dispatchProps.rejectFA(
        reqIdList,
        requestIds[nextIndex],
        requestList,
        comment,
        reportTypeAll
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApprovalReject) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
