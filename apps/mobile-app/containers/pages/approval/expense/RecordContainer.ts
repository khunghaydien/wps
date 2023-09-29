import { connect } from 'react-redux';
import { compose } from 'redux';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import RecordPage from '../../../../components/pages/approval/expense/Report/Record';

const filterRecord = (report, recordId) => {
  if (!report || !report.records || !recordId) {
    return null;
  }
  const selectRecords = report.records.filter(
    (record) => record.recordId === recordId
  );
  if (selectRecords.length > 0) {
    return selectRecords[0];
  }
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const isExpenseModule = state.approval.ui.isExpenseModule; // is Expense Approval or Approval module
  const expActiveModule = state.approval.ui.requestModule; // is request from expense Report or Request
  const report =
    isExpenseModule && expActiveModule === EXPENSE_APPROVAL_REQUEST.request
      ? state.approval.entities.expense.preRequest
      : state.approval.entities.expense.report;
  return {
    ...ownProps,
    currencySymbol: state.userSetting.currencySymbol,
    currencyDecimalPlaces: state.userSetting.currencyDecimalPlaces,
    report,
    record: filterRecord(report, ownProps.recordId),
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    fileMetadata: state.expense.entities.fileMetadata,
    expActiveModule,
    isExpenseModule,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
  };
};

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickBack: () => {
    const { isExpenseModule, expActiveModule } = stateProps;
    const { requestId, history } = ownProps;
    const requestPathname = isExpenseModule
      ? `/approval/${expActiveModule}/list/select/${requestId}`
      : `/approval/list/select/expense/${requestId}`;
    history.push(requestPathname);
  },
  selectedMetadata: stateProps.fileMetadata.find(
    (x) => x.contentDocumentId === stateProps.record.receiptId
  ),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(RecordPage) as React.ComponentType<{
  [key: string]: any;
}>;
