import React, { FunctionComponent } from 'react';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import AmountInput from '@mobile/components/molecules/commons/Fields/AmountInput';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { Report } from '@apps/domain/models/exp/Report';

import Errors from '@mobile/components/atoms/Errors';
import LabelWithHint from '@mobile/components/atoms/LabelWithHint';
import TextButton from '@mobile/components/atoms/TextButton';

import './CashAdvanceArea.scss';

const ROOT = 'mobile-app-molecules-expense-cash-advance-area';

type GetCustomHint = {
  hintMsg: string;
  isShowHint: boolean;
  onClickHint: () => void;
};

export type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  isRequest: boolean;
  report: Report;
  getCustomHint: (fieldName: string, disabled?: boolean) => GetCustomHint;
  onChangeValue: (updateObj: Record<string, string | number | Date>) => void;
  setError: (field: string) => string[];
};

const CashAdvanceArea: FunctionComponent<Props> = (props) => {
  const {
    baseCurrencyDecimal,
    baseCurrencySymbol,
    isRequest,
    report,
    getCustomHint,
    onChangeValue,
    setError,
  } = props;

  const isReadOnly = !isRequest;
  const expReport = isRequest ? report : report.preRequest;

  const handleClickMax = () => {
    const maxAmount = Math.max(0, expReport.totalAmount);
    onChangeValue({
      cashAdvanceRequestAmount: maxAmount,
    });
  };

  const handleChangeRequestAmount = (amount: number | string) => {
    onChangeValue({
      cashAdvanceRequestAmount: Number(amount),
    });
  };

  const handleChangeRequestDate = (
    _: React.ChangeEvent<HTMLSelectElement>,
    { date }: { date: Date }
  ) => {
    onChangeValue({
      cashAdvanceRequestDate: DateUtil.fromDate(date),
    });
  };

  const handleChangePurpose = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue({
      cashAdvanceRequestPurpose: event.target.value,
    });
  };

  const formatAmount = (amount: number) => {
    return FormatUtil.formatNumber(amount, baseCurrencyDecimal);
  };

  const renderRequestCashAdvance = () => {
    const {
      cashAdvanceRequestAmount,
      cashAdvanceRequestDate,
      cashAdvanceRequestPurpose,
    } = expReport;

    const requestAmountErrors = setError('report.cashAdvanceRequestAmount');
    const isRequestAmountError = requestAmountErrors.length > 0;

    return (
      <>
        <div className={`${ROOT}__field`}>
          <LabelWithHint
            marked={isRequest}
            text={msg().Exp_Clbl_CashAdvanceRequestAmount}
            {...getCustomHint('reportHeaderCARequestAmount', isReadOnly)}
          />
          <div className={`${ROOT}__request-amount-area`}>
            <AmountInput
              error={isRequestAmountError}
              decimalPlaces={baseCurrencyDecimal}
              value={cashAdvanceRequestAmount || 0}
              onBlur={handleChangeRequestAmount}
            />
            <TextButton
              className={`${ROOT}__max`}
              type="button"
              onClick={handleClickMax}
            >
              {msg().Exp_Lbl_Max}
            </TextButton>
          </div>
          {isRequestAmountError && <Errors messages={requestAmountErrors} />}
        </div>
        <div className={`${ROOT}__field`}>
          <SFDateField
            errors={setError('report.cashAdvanceRequestDate')}
            label={msg().Exp_Clbl_CashAdvanceRequestDate}
            required={isRequest}
            value={cashAdvanceRequestDate || ''}
            onChange={handleChangeRequestDate}
            {...getCustomHint('reportHeaderCARequestDate', isReadOnly)}
          />
        </div>
        <div className={`${ROOT}__field`}>
          <TextField
            label={msg().Exp_Clbl_CashAdvanceRequestPurpose}
            onChange={handleChangePurpose}
            value={cashAdvanceRequestPurpose || ''}
            {...getCustomHint('reportHeaderCAPurpose')}
          />
        </div>
      </>
    );
  };

  const renderExpenseCashAdvance = () => {
    const { cashAdvanceAmount, cashAdvanceDate, cashAdvanceRequestPurpose } =
      expReport;

    const formattedAmount = formatAmount(cashAdvanceAmount);

    return (
      <>
        <ViewItem
          className={`${ROOT}__field`}
          label={msg().Exp_Clbl_CashAdvanceAmount}
        >
          <p className={`${ROOT}__amount-text`}>
            {`${baseCurrencySymbol} ${formattedAmount}`}
          </p>
        </ViewItem>
        <ViewItem
          className={`${ROOT}__field`}
          label={msg().Exp_Clbl_CashAdvanceDate}
        >
          {DateUtil.formatYMD(cashAdvanceDate)}
        </ViewItem>
        <ViewItem
          className={`${ROOT}__field`}
          label={msg().Exp_Clbl_CashAdvanceRequestPurpose}
        >
          {cashAdvanceRequestPurpose}
        </ViewItem>
      </>
    );
  };

  return (
    <div className={ROOT}>
      {isRequest ? renderRequestCashAdvance() : renderExpenseCashAdvance()}
    </div>
  );
};

export default CashAdvanceArea;
