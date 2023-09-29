import React from 'react';

import { modes } from '../../../../../../requests-pc/modules/ui/expenses/mode';

import ActionButtonsExpense from './Expense';
import ActionButtonsFA from './FinanceApproval';

export type Props = {
  hasItemizeRequiredError?: boolean;
  isDisabled: boolean;
  isExpTypeDisableSave: boolean;
  isExpenseReportDisabled: boolean;
  isFASaveDisabled: boolean;
  isFinanceApproval?: boolean;
  isLoading: boolean;
  isNewReportFromPreRequest: boolean;
  isRecordLoading: boolean;
  isTotalAmountMatch: boolean;
  mode: string;
  needGenerateMapPreview?: boolean;
  onClickBackButton: () => void;
  onClickEditButton: () => void;
  onClickSaveButton: () => void;
};

export default class RecordItemActionButtons extends React.Component<Props> {
  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  render() {
    const {
      hasItemizeRequiredError,
      isFASaveDisabled,
      isFinanceApproval,
      isLoading,
      isRecordLoading,
      isTotalAmountMatch = true,
      needGenerateMapPreview,
    } = this.props;
    const isEditMode =
      this.isMode('REPORT_EDIT') || this.isMode('FINANCE_REPORT_EDITED');
    const isReadMode =
      this.isMode('INITIALIZE') || this.isMode('REPORT_SELECT');
    const isSaveDisabled =
      isReadMode ||
      !!isRecordLoading ||
      isFASaveDisabled ||
      !isTotalAmountMatch;
    const isExpenseSaveDisabled =
      (isReadMode && this.props.isExpTypeDisableSave) ||
      this.props.isNewReportFromPreRequest ||
      this.props.isExpenseReportDisabled ||
      !!isRecordLoading ||
      needGenerateMapPreview ||
      hasItemizeRequiredError ||
      !isTotalAmountMatch;

    return isFinanceApproval ? (
      <ActionButtonsFA
        isEditMode={isEditMode}
        isSaveDisabled={isSaveDisabled}
        isDisabled={this.props.isDisabled}
        onClickEditButton={this.props.onClickEditButton}
        onClickBackButton={this.props.onClickBackButton}
        onClickSaveButton={this.props.onClickSaveButton}
      />
    ) : (
      <ActionButtonsExpense
        isLoading={isLoading}
        isRecordLoading={isRecordLoading}
        isSaveDisabled={isExpenseSaveDisabled}
        onClickSaveButton={this.props.onClickSaveButton}
        onClickBackButton={this.props.onClickBackButton}
      />
    );
  }
}
