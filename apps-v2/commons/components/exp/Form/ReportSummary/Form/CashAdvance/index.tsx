import React, { FunctionComponent } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import { Text } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import AmountField from '@commons/components/fields/AmountField';
import DateField from '@commons/components/fields/DateField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import TextAreaField from '@commons/components/fields/TextAreaField';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { Report } from '@apps/domain/models/exp/Report';

import { Errors } from '../..';

const ROOT = 'ts-expenses__form-report-summary__form__cash-advance';

const requestCashAdvance = {
  amount: {
    hint: 'reportHeaderCARequestAmount',
    key: 'cashAdvanceRequestAmount',
    label: msg().Exp_Clbl_CashAdvanceRequestAmount,
  },
  date: {
    hint: 'reportHeaderCARequestDate',
    key: 'cashAdvanceRequestDate',
    label: msg().Exp_Clbl_CashAdvanceRequestDate,
  },
  purpose: {
    key: 'cashAdvanceRequestPurpose',
  },
};

const getCashAdvance = (isExpenseOrFAExpenseTab: boolean) => ({
  amount: {
    hint: 'reportHeaderCAAmount',
    key: isExpenseOrFAExpenseTab
      ? 'preRequest.cashAdvanceAmount'
      : 'cashAdvanceAmount',
    label: msg().Exp_Clbl_CashAdvanceAmount,
  },
  date: {
    hint: 'reportHeaderCADate',
    key: isExpenseOrFAExpenseTab
      ? 'preRequest.cashAdvanceDate'
      : 'cashAdvanceDate',
    label: msg().Exp_Clbl_CashAdvanceDate,
  },
  purpose: {
    key: isExpenseOrFAExpenseTab
      ? 'preRequest.cashAdvanceRequestPurpose'
      : 'cashAdvanceRequestPurpose',
  },
});

type AmountDatePurposeProperties = {
  hint?: string;
  key: string;
  label?: string;
};

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol?: string;
  customHint: CustomHint;
  errors: Errors;
  expReport: Report;
  isExpense: boolean;
  isFAExpenseTab?: boolean;
  isFinanceApproval?: boolean;
  isReadOnly: boolean;
  onChangeEditingExpReport: (
    key: string,
    value: string | number,
    touched: boolean
  ) => void;
};

const ReportCashAdvance: FunctionComponent<Props> = (props) => {
  const {
    baseCurrencyDecimal,
    baseCurrencySymbol,
    customHint,
    errors,
    expReport,
    isExpense,
    isFAExpenseTab,
    isFinanceApproval,
    isReadOnly,
    onChangeEditingExpReport,
  } = props;

  const isExpenseOrFA = isExpense || isFinanceApproval;

  const isExpenseOrFAExpenseTab = isExpense || isFAExpenseTab;

  const isFieldReadOnly = isReadOnly || isExpenseOrFAExpenseTab;

  const onClickMax = (amountKey: string) => {
    const maxAmount = Math.max(0, expReport.totalAmount);
    onChangeEditingExpReport(`report.${amountKey}`, maxAmount, true);
  };

  const handleRequestAmountBlur = (amount: number) => {
    onChangeEditingExpReport(
      'report.cashAdvanceRequestAmount',
      Number(amount),
      true
    );
  };

  const handleAmountBlur = (amount: number) => {
    onChangeEditingExpReport('report.cashAdvanceAmount', Number(amount), true);
  };

  const handleChangeRequestDate = (date: string) => {
    onChangeEditingExpReport('report.cashAdvanceRequestDate', date, true);
  };

  const handleChangeDate = (date: string) => {
    onChangeEditingExpReport('report.cashAdvanceDate', date, true);
  };

  const handleChangePurpose = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeEditingExpReport(
      'report.cashAdvanceRequestPurpose',
      event.target.value,
      true
    );
  };

  const renderAmountField = (
    { hint, key, label }: AmountDatePurposeProperties,
    handleAmountBlur: (amount: number) => void
  ) => (
    <div>
      <div className={`${ROOT}-amount`}>
        <LabelWithHint
          text={label}
          hintMsg={customHint[hint] || ''}
          isRequired={!isExpenseOrFAExpenseTab}
        />
        <Button
          type="text"
          className={`${ROOT}-btn-max`}
          disabled={isFieldReadOnly}
          onClick={() => onClickMax(key)}
        >
          <Text size="large" color="action">
            {msg().Exp_Lbl_Max}
          </Text>
        </Button>
      </div>
      <AmountField
        disabled={isFieldReadOnly}
        className={`${ROOT}-amount-field`}
        currencySymbol={baseCurrencySymbol}
        fractionDigits={baseCurrencyDecimal}
        value={get(expReport, key) || 0}
        onBlur={handleAmountBlur}
      />
      {errors[key] && (
        <div className="input-feedback">{msg()[errors[key]]}</div>
      )}
    </div>
  );

  const renderDateField = (
    { hint, key, label }: AmountDatePurposeProperties,
    handleChangeDate: (date: string) => void
  ) => (
    <div>
      <LabelWithHint
        text={label}
        hintMsg={customHint[hint] || ''}
        isRequired={!isExpenseOrFAExpenseTab}
      />
      <div className={classNames('ts-text-field-container', `${ROOT}-date`)}>
        <DateField
          disabled={isFieldReadOnly}
          value={get(expReport, key) || ''}
          onChange={handleChangeDate}
        />
      </div>
      {errors[key] && (
        <div className="input-feedback">{msg()[errors[key]]}</div>
      )}
    </div>
  );

  const renderPurposeField = ({ key }: AmountDatePurposeProperties) => (
    <div>
      <LabelWithHint
        text={msg().Exp_Clbl_CashAdvanceRequestPurpose}
        hintMsg={customHint.reportHeaderCAPurpose || ''}
      />
      <TextAreaField
        autosize
        disabled={isFieldReadOnly}
        minRows={1}
        maxRows={2}
        resize="none"
        value={get(expReport, key) || ''}
        onChange={handleChangePurpose}
      />
    </div>
  );

  const renderCARequestArea = () => {
    // render for request/FA request reports
    if (isExpenseOrFAExpenseTab) return null;
    const { amount, date, purpose } = requestCashAdvance;
    return (
      <MultiColumnsGrid sizeList={[4, 4, 4]}>
        {renderAmountField(amount, handleRequestAmountBlur)}
        {renderDateField(date, handleChangeRequestDate)}
        {renderPurposeField(purpose)}
      </MultiColumnsGrid>
    );
  };

  const renderCAArea = () => {
    // render for expense/FA request/FA expense reports
    if (!isExpenseOrFA) return null;
    const { amount, date, purpose } = getCashAdvance(isExpenseOrFAExpenseTab);
    return (
      <>
        <MultiColumnsGrid sizeList={[4, 4, 4]}>
          {renderAmountField(amount, handleAmountBlur)}
          {renderDateField(date, handleChangeDate)}
          {isExpenseOrFAExpenseTab && renderPurposeField(purpose)}
        </MultiColumnsGrid>
      </>
    );
  };

  return (
    <>
      {renderCARequestArea()}
      {renderCAArea()}
    </>
  );
};

export default ReportCashAdvance;
