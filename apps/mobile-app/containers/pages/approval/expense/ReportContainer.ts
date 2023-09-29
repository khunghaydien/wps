import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { get, isEmpty } from 'lodash';

import lifecycle from '../../../../concerns/lifecycle';
import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import { actions as DetailActions } from '../../../../modules/approval/ui/detail';
import { actions as fileMetadataActions } from '@mobile/modules/expense/entities/fileMetadata';

import { approve } from '../../../../action-dispatchers/approval/Approve';
import {
  clearReportState,
  getExpRequest,
} from '../../../../action-dispatchers/approval/ExpenseReport';
import { reject } from '../../../../action-dispatchers/approval/Reject';

import ReportPage from '../../../../components/pages/approval/expense/Report';

const mapStateToProps = (state, ownProps) => {
  const isExpenseModule = state.approval.ui.isExpenseModule; // is Expense Approval or Approval module
  const expActiveModule = state.approval.ui.requestModule;
  const isExpenseApproval =
    isExpenseModule && expActiveModule === EXPENSE_APPROVAL_REQUEST.expense; // is request from expense Report or Request
  const report =
    isExpenseApproval || !isExpenseModule
      ? state.approval.entities.expense.report
      : state.approval.entities.expense.preRequest;
  const useJctRegistrationNumber = state.userSetting.jctInvoiceManagement;
  const expDisplayTaxDetailsSetting =
    state.userSetting.expDisplayTaxDetailsSetting;

  return {
    ...ownProps,
    isExpenseModule,
    expActiveModule,
    isExpenseApproval,
    currencySymbol: state.userSetting.currencySymbol,
    currencyDecimalPlaces: state.userSetting.currencyDecimalPlaces,
    report,
    comment: state.approval.ui.detail.comment,
    selection: state.approval.entities.list.select,
    useJctRegistrationNumber,
    expDisplayTaxDetailsSetting,
  };
};

const mapDispatchToProps = {
  onChangeComment: DetailActions.setComment,
  approveHandler: approve,
  rejectHandler: reject,
  clearReportState,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickRecord: (recordId: string) => {
    const recordPathname = stateProps.isExpenseModule
      ? `/approval/${stateProps.expActiveModule}/list/select/${ownProps.requestId}/detail/${recordId}`
      : `/approval/list/select/expense/${ownProps.requestId}/detail/${recordId}`;
    ownProps.history.push(recordPathname);
  },
  onClickBack: () => {
    const { isExpenseModule, expActiveModule, isExpenseApproval } = stateProps;
    const isReportStore = isExpenseApproval || !isExpenseModule;
    dispatchProps.clearReportState(isReportStore);
    if (isExpenseModule) {
      ownProps.history.push(`/approval/${expActiveModule}/list`);
      return;
    }
    ownProps.history.push(`/approval/list/type/${stateProps.selection}`);
  },
  onClickVendorDetail: () => {
    pushHistoryWithPrePage(
      ownProps.history,
      `/approval/vendor/detail/${stateProps.report.vendorId}`
    );
  },
  onClickApproveButton: () => {
    dispatchProps
      .approveHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        const { isExpenseModule, expActiveModule, isExpenseApproval } =
          stateProps;
        dispatchProps.clearReportState(isExpenseApproval);
        if (isExpenseModule) {
          ownProps.history.push(`/approval/${expActiveModule}/list`);
          return;
        }
        ownProps.history.push('/approval/list');
      });
  },
  onClickRejectButton: () => {
    dispatchProps
      .rejectHandler([stateProps.requestId], stateProps.comment)
      .then(() => {
        const { isExpenseModule, expActiveModule, isExpenseApproval } =
          stateProps;
        dispatchProps.clearReportState(isExpenseApproval);
        if (isExpenseModule) {
          ownProps.history.push(`/approval/${expActiveModule}/list`);
          return;
        }
        ownProps.history.push('/approval/list');
      });
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: Dispatch<any>, props) => {
      dispatch(DetailActions.initialize());
      if (!props.report) {
        // If from approvel entry, fetch expense only
        // If from expense approval entry, depends on active module to fetch request type
        const isExpense = props.isExpenseModule
          ? props.expActiveModule === EXPENSE_APPROVAL_REQUEST.expense
          : true;

        // @ts-ignore
        dispatch(getExpRequest(props.requestId, isExpense)).then((report) => {
          const records = get(report, 'records', []);
          const receiptIds = records
            .filter(({ receiptId }) => receiptId)
            .map(({ receiptId }) => receiptId);
          if (!isEmpty(receiptIds)) {
            dispatch(fileMetadataActions.fetch(receiptIds));
          }
        });
      }
    },
  })
)(ReportPage) as React.ComponentType<{
  [key: string]: any;
}>;
