import React from 'react';

import { Record } from '../../../../../../domain/models/exp/Record';

import './index.scss';

export type Props = {
  // components
  baseCurrency: any;
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  errors: any;
  expRecord: Record;
  fixedAmountMessage?: string;
  foreignCurrency: any;
  hasChildItems?: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isFixedAllowance?: boolean;
  isItemized?: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  selectedCompanyId: string;
  targetRecord: string;
  touched: { recordDate?: string; records?: Array<any> };
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: any) => void;
  removeAllChildItems?: () => void;
};

export default class General extends React.Component<Props> {
  render() {
    const {
      expRecord,
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
      fixedAmountMessage,
      hasChildItems,
      recordItemIdx = 0,
      selectedCompanyId,
      removeAllChildItems,
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
          targetRecord={targetRecord}
          onChangeEditingExpReport={onChangeEditingExpReport}
          baseCurrencyCode={baseCurrencyCode}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          isItemized={isItemized}
          isFixedAllowance={isFixedAllowance}
          fixedAmountMessage={fixedAmountMessage}
          hasChildItems={hasChildItems}
          recordItemIdx={recordItemIdx}
          selectedCompanyId={selectedCompanyId}
        />
      );
    } else {
      return (
        <BaseCurrencyContainer
          readOnly={readOnly}
          touched={touched}
          errors={errors}
          expRecord={expRecord}
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
          removeAllChildItems={removeAllChildItems}
          hasChildItems={hasChildItems}
        />
      );
    }
  }
}
