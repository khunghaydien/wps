import React from 'react';

import { ExpenseReportType } from '../../../../../../domain/models/exp/expense-report-type/list';
import { Report, status } from '../../../../../../domain/models/exp/Report';

import { modes } from '../../../../../../expenses-pc/modules/ui/expenses/mode';

import { FormContainerProps } from '../..';
import { CustomRequestProps } from './CustomRequest';
import ActionButtonsExpense from './Expense';
import ActionButtonsFA from './FinanceApproval';
import { ReportAttachmentProps } from './ReportAttachment';

type Props = FormContainerProps &
  CustomRequestProps &
  ReportAttachmentProps & {
    errors?: any;
    expReport: Report;
    isExpenseRequest?: boolean;
    isPartialLoading: boolean;
    isReadOnlyApexPage?: boolean;
    mode: string;
    openTitle: boolean;
    readOnly: boolean;
    reportTypeList: Array<ExpenseReportType>;
    onClickCloneButton: (arg0: boolean) => void;
    onClickDiscardButton: () => void;
    onClickEditButton: (arg0: string) => void;
    onClickPrintPageButton: () => void;
    onClickSaveButton: () => void;
    onClickSubmitButton: () => void;
  };

export default class ReportSummaryActionButtons extends React.Component<Props> {
  render() {
    const { expReport, isFinanceApproval } = this.props;
    const isEdited = this.props.mode === modes.FINANCE_REPORT_EDITED;
    const isEditMode = this.props.mode === modes.REPORT_EDIT || isEdited;
    const isDisabled =
      expReport.status === status.ACCOUNTING_AUTHORIZED ||
      expReport.status === status.ACCOUNTING_REJECTED ||
      expReport.status === status.JOURNAL_CREATED ||
      expReport.status === status.FULLY_PAID;
    return !isFinanceApproval ? (
      // @ts-ignore TODO: use wrapper
      <ActionButtonsExpense {...this.props} />
    ) : (
      <ActionButtonsFA
        isEdited={isEdited}
        isEditMode={isEditMode}
        disabled={isDisabled}
        expReport={expReport}
        onClickApprovalHistoryButton={this.props.onClickApprovalHistoryButton}
        onClickEditHistoryButton={this.props.onClickEditHistoryButton}
        onClickApproveButton={this.props.onClickApproveButton}
        onClickEditButton={this.props.reportEdit}
        onClickRejectButton={this.props.onClickRejectButton}
        onClickBackButton={this.props.onClickBackButton}
        onClickSaveButton={this.props.onClickSaveButton}
        onClickPrintPageButton={this.props.onClickPrintPageButton}
        onClickCloneButton={this.props.onClickCloneButton}
        openCustomRequestPage={this.props.openCustomRequestPage}
        reportTypeList={this.props.reportTypeList}
      />
    );
  }
}
