import React from 'react';

import { Record } from '../../../../../../domain/models/exp/Record';
import { CustomHint } from '@apps/domain/models/exp/CustomHint';

import './index.scss';

export type Props = {
  // components
  baseCurrency: any;
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint?: CustomHint;
  errors: any;
  expPreRecord?: Record;
  expRecord: Record;
  fixedAmountMessage?: string;
  foreignCurrency: any;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isFixedAllowance?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isItemized?: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  selectedCompanyId: string;
  targetRecord: string;
  touched: { recordDate?: string; records?: Array<any> };
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: any) => void;
  updateRecord: (
    updateObj: {
      [key: string]: any;
    },
    recalc?: boolean
  ) => void;
};

export default class General extends React.Component<Props> {
  render() {
    const {
      customHint,
      expRecord,
      expPreRecord,
      isHighlightDiff,
      targetRecord,
      readOnly,
      touched,
      onChangeEditingExpReport,
      baseCurrencyCode,
      baseCurrencySymbol,
      baseCurrencyDecimal,
      errors,
      isItemized,
      isExpenseRequest,
      isFixedAllowance,
      isFinanceApproval,
      isHighlightNewRecord,
      fixedAmountMessage,
      recordItemIdx = 0,
      selectedCompanyId,
      updateRecord,
    } = this.props;

    const ForeignCurrencyContainer = this.props.foreignCurrency;
    const BaseCurrencyContainer = this.props.baseCurrency;

    if (expRecord.items[0].useForeignCurrency) {
      return (
        <ForeignCurrencyContainer
          readOnly={readOnly}
          touched={touched}
          formikErrors={errors}
          expRecord={expRecord}
          expPreRecord={expPreRecord}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewRecord}
          targetRecord={targetRecord}
          onChangeEditingExpReport={onChangeEditingExpReport}
          baseCurrencyCode={baseCurrencyCode}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          isFixedAllowance={isFixedAllowance}
          fixedAmountMessage={fixedAmountMessage}
          recordItemIdx={recordItemIdx}
          selectedCompanyId={selectedCompanyId}
          customHint={customHint}
        />
      );
    } else {
      return (
        <BaseCurrencyContainer
          customHint={customHint}
          readOnly={readOnly}
          touched={touched}
          errors={errors}
          expRecord={expRecord}
          expPreRecord={expPreRecord}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewRecord}
          recordItemIdx={recordItemIdx}
          targetRecord={targetRecord}
          onChangeEditingExpReport={onChangeEditingExpReport}
          baseCurrencyCode={baseCurrencyCode}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          isItemized={isItemized}
          isFixedAllowance={isFixedAllowance}
          isFinanceApproval={isFinanceApproval}
          fixedAmountMessage={fixedAmountMessage}
          isExpenseRequest={isExpenseRequest}
          updateRecord={updateRecord}
        />
      );
    }
  }
}
