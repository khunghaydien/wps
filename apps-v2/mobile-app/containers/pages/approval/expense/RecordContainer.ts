import { connect } from 'react-redux';
import { compose } from 'redux';

import { get, isEmpty } from 'lodash';

import { pushHistoryWithPrePage } from '@apps/mobile-app/concerns/routingHistory';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

import { actions as formValueAction } from '@mobile/modules/expense/ui/general/formValues';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';

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

const filterPreRecord = (report, recordId, preReport) => {
  if (!report || !report.records || !recordId) {
    return null;
  }
  const selectRecords = report.records.filter(
    (record) => record.recordId === recordId
  );
  if (selectRecords.length > 0 && preReport && preReport.records) {
    const preRecords = preReport.records.filter(
      (record) => record.recordId === selectRecords[0].expPreRequestRecordId
    );
    return preRecords[0];
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
  let isHighlightDiff = state.userSetting.highlightExpReqRepDiff;
  const preRecord = isHighlightDiff
    ? filterPreRecord(report, ownProps.recordId, report.expPreRequest)
    : undefined;
  isHighlightDiff = isHighlightDiff && !isEmpty(preRecord);
  const record = filterRecord(report, ownProps.recordId);
  const fileMetadata = state.expense.entities.fileMetadata;
  const selectedMetadatas = {};
  if (record.receiptId) {
    selectedMetadatas[record.receiptId] = fileMetadata.find(
      (x) => x.contentDocumentId === record.receiptId
    );
  }
  if (record.receiptList) {
    (record.receiptList || []).forEach((receipt) => {
      selectedMetadatas[receipt.receiptId] = fileMetadata.find(
        (x) => x.contentDocumentId === receipt.receiptId
      );
    });
  }
  return {
    ...ownProps,
    currencySymbol: state.userSetting.currencySymbol,
    currencyDecimalPlaces: state.userSetting.currencyDecimalPlaces,
    report,
    record,
    preRecord,
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    fileMetadata,
    expActiveModule,
    isExpenseModule,
    isHighlightDiff,
    mileageUnit: state.userSetting.expMileageUnit,
    selectedMetadatas,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
  };
};

const mapDispatchToProps = {
  setDestinations: mileageActions.setDestinations,
  saveFormValues: formValueAction.save,
};

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
  onClickOpenMap: (destinations: Array<MileageDestinationInfo>) => {
    dispatchProps.setDestinations(destinations);
    const { history } = ownProps;
    const path = `/expense/record/mileage/map`;
    pushHistoryWithPrePage(history, path);
  },
  navigateToItemizationPage: (itemIdx: number) => {
    const { record } = stateProps;

    const path = `/approval/expenses/record/item/${itemIdx}`;
    const state = {
      recordId: ownProps.recordId,
    };
    dispatchProps.saveFormValues(record);
    pushHistoryWithPrePage(ownProps.history, path, state);
  },
  onClickVendorDetail: () => {
    const { history } = ownProps;
    const vendorId = get(stateProps.record, 'items.0.vendorId');
    pushHistoryWithPrePage(history, `/approval/vendor/detail/${vendorId}`);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(RecordPage) as React.ComponentType<{
  [key: string]: any;
}>;
