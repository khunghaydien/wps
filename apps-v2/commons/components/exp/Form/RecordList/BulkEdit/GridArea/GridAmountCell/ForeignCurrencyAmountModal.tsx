import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';

import isNil from 'lodash/isNil';
import { number } from 'yup';

import { Text } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import SelectField from '@commons/components/fields/SelectField';
import TextField from '@commons/components/fields/TextField';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';
import CurrencyUtil from '@commons/utils/CurrencyUtil';
import { CalculateForeignCurrencyAmount } from '@commons/utils/exp/BulkEditUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import StringUtil from '@commons/utils/StringUtil';

import { AmountOption } from '@apps/domain/models/exp/ExpenseType';
import { Currency } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  currencyInfo,
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isItemizedRecord,
  Record,
} from '@apps/domain/models/exp/Record';

import FixedAllowanceModalContent from './FixedAllowanceModalContent';

import './ForeignCurrencyAmountModal.scss';

const ROOT = 'ts-expenses__modal-bulk-edit-foreign-currency-amount';

type CurrencyOptionList = {
  text: string;
  value: string;
}[];
// props from parent component
export type ParentProps = {
  currencyDecimalPlaces: number;
  currencyList: Currency[];
  currencySymbol: string;
  multiFixedList: AmountOption[];
  record: Record;
  calculateAmountFromRate: (localAmount: number, rate: number) => number;
  calculateForeignCurrencyAmounts: (
    localAmount: number,
    selectedCurrencyId: string,
    isShowSummaryView: boolean
  ) => Promise<CalculateForeignCurrencyAmount>;
  searchInitialSetting: () => void;
  updateRecord: (updateObj: {
    [key: string]: boolean | number | string | currencyInfo;
  }) => void;
};

type Props = ParentProps & {
  onCloseSummaryView: () => void;
};

type LocalState = {
  amountInput: number;
  currencyIdInput: string;
  currencyInfoInput: currencyInfo;
  exchangeRateInput: number;
  fixedAllowanceOptionIdInput: string;
  isExchangeRateManualInput: boolean;
  localAmountInput: number;
  originalExchangeRateInput: number;
};

type ErrorLabelState = {
  amountError: string;
};

const _ = undefined;

const renderDisabledCurrencyField = (
  currencyId: string,
  currencyOptionList: CurrencyOptionList
) => {
  const selectedOption = currencyOptionList.find(
    (option) => option.value === currencyId
  );
  const disableElement = (
    <div>
      <TextField disabled value={selectedOption ? selectedOption.text : ''} />
    </div>
  );
  return (
    <Tooltip align="top" content={msg().Exp_Hint_FixedCurrency}>
      {disableElement}
    </Tooltip>
  );
};

const renderDisabledLocalAmountField = (
  isMultiFixedType: boolean,
  isSingleFixedType: boolean,
  localAmount: number,
  decimalPlaces: number
) => {
  const tooltip = isMultiFixedType
    ? msg().Exp_Hint_FixedAllowanceMulti
    : isSingleFixedType
    ? msg().Exp_Hint_FixedAllownceSingle
    : '';
  return (
    <Tooltip align="top" content={tooltip}>
      <div>
        <TextField
          disabled
          className={`${ROOT}__field-amount`}
          value={FormatUtil.formatNumber(localAmount, decimalPlaces)}
        />
      </div>
    </Tooltip>
  );
};

const ForeignCurrencyAmountModal = ({
  currencyList,
  currencyDecimalPlaces,
  currencySymbol,
  multiFixedList,
  record,
  calculateAmountFromRate,
  calculateForeignCurrencyAmounts,
  onCloseSummaryView,
  searchInitialSetting,
  updateRecord,
}: Props): ReactElement => {
  const { items, recordType } = record;
  const {
    amount,
    currencyId,
    currencyInfo,
    exchangeRate,
    exchangeRateManual,
    fixedAllowanceOptionId,
    localAmount,
    originalExchangeRate,
    useFixedForeignCurrency,
    allowNegativeAmount,
  } = record.items[0];
  const [errorLabel, setErrorLabel] = useState<ErrorLabelState>({
    amountError: '',
  });
  const { amountError } = errorLabel;
  const [fieldInput, setFieldInput] = useState<LocalState>({
    amountInput: amount,
    currencyIdInput: currencyId,
    currencyInfoInput: currencyInfo,
    fixedAllowanceOptionIdInput: fixedAllowanceOptionId,
    exchangeRateInput: exchangeRate,
    isExchangeRateManualInput: exchangeRateManual,
    localAmountInput: localAmount,
    originalExchangeRateInput: originalExchangeRate,
  });
  const {
    amountInput,
    currencyIdInput,
    currencyInfoInput,
    fixedAllowanceOptionIdInput,
    exchangeRateInput,
    isExchangeRateManualInput,
    localAmountInput,
    originalExchangeRateInput,
  } = fieldInput;
  const isMultiFixedType = isFixedAllowanceMulti(recordType);
  const isSingleFixedType = isFixedAllowanceSingle(recordType);
  const currencyOptionList = currencyList.map(({ id, isoCurrencyCode }) => ({
    text: isoCurrencyCode,
    value: id,
  }));

  useEffect(() => {
    searchInitialSetting();
  }, []);

  // update amount on field change
  useEffect(() => {
    if (isMultiFixedType) {
      updateAmountFromRate(_, _, localAmountInput);
    }
  }, [fixedAllowanceOptionIdInput]);

  // validate on field change
  useEffect(() => {
    const isAmountValid = number()
      .nullable()
      .max(999999999999)
      .isValidSync(amountInput);
    updateErrorLabel({ amountError: isAmountValid ? '' : 'Common_Err_Max' });
  }, [localAmountInput, exchangeRateInput, currencyIdInput]);

  const onChangeCurrency = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const {
      amount,
      currencyId,
      currencyInfo,
      exchangeRate,
      exchangeRateManual: isNewExchangeRateManual,
      localAmount: newLocalAmount,
    } = await calculateForeignCurrencyAmounts(localAmountInput, value, true);
    updateFieldInput({
      amountInput: amount,
      currencyIdInput: currencyId,
      currencyInfoInput: currencyInfo,
      localAmountInput: newLocalAmount,
      exchangeRateInput: exchangeRate,
      isExchangeRateManualInput: useFixedForeignCurrency
        ? exchangeRateManual
        : isNewExchangeRateManual,
      originalExchangeRateInput: exchangeRate,
    });
  };

  const onChangeLocalAmount = (value: number) => {
    updateAmountFromRate(exchangeRateInput, _, value);
  };

  const onBlurExchangeRate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const inputValue = StringUtil.convertToHankaku(
      StringUtil.removeComma(value.toString())
    );
    const exchangeRate =
      inputValue === ''
        ? 0
        : Number(StringUtil.removeLeadingZeroes(inputValue));
    updateAmountFromRate(exchangeRate, true);
  };

  const onChangeExchangeRate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (CurrencyUtil.validateExchangeRate(value)) {
      updateFieldInput({
        exchangeRateInput: value || '',
      });
    }
  };

  const onFocusExchangeRate = () => {
    updateFieldInput({
      exchangeRateInput: exchangeRateInput || '',
    });
  };

  const onToggleExchangeRateEditMode = () => {
    const isNewExchangeRateManual = !isExchangeRateManualInput;
    if (isExchangeRateManualInput) {
      updateAmountFromRate(
        originalExchangeRateInput || exchangeRate,
        isNewExchangeRateManual
      );
    } else {
      updateFieldInput({
        isExchangeRateManualInput: isNewExchangeRateManual,
      });
    }
  };

  const onClickSaveButton = async () => {
    const hasError = Object.values(errorLabel).some((label) => label !== '');
    if (hasError) return;
    const {
      amountInput,
      currencyIdInput,
      currencyInfoInput,
      fixedAllowanceOptionIdInput,
      exchangeRateInput,
      isExchangeRateManualInput,
      originalExchangeRateInput,
      localAmountInput,
    } = fieldInput;
    await updateRecord({
      amount: amountInput,
      'items.0.amount': amountInput,
      'items.0.currencyId': currencyIdInput,
      'items.0.currencyInfo': currencyInfoInput,
      'items.0.localAmount': localAmountInput,
      'items.0.exchangeRate': exchangeRateInput,
      'items.0.exchangeRateManual': isExchangeRateManualInput,
      'items.0.originalExchangeRate': originalExchangeRateInput,
      'items.0.fixedAllowanceOptionId': fixedAllowanceOptionIdInput,
    });
    onCloseSummaryView();
  };

  const updateAmountFromRate = (
    exchangeRateParam?: number,
    exchangeRateManualParam?: boolean,
    localAmountParam?: number
  ) => {
    const exchangeRate = isNil(exchangeRateParam)
      ? exchangeRateInput
      : exchangeRateParam;
    const localAmount = isNil(localAmountParam)
      ? localAmountInput
      : localAmountParam;
    const isNewExchangeRateManual = isNil(exchangeRateManualParam)
      ? isExchangeRateManualInput
      : exchangeRateManualParam;
    const amount = calculateAmountFromRate(localAmount, exchangeRate);
    updateFieldInput({
      amountInput: Number(amount),
      localAmountInput: localAmount,
      exchangeRateInput: exchangeRate,
      isExchangeRateManualInput: isNewExchangeRateManual,
    });
  };

  const updateFieldInput = (updateObj: {
    [key: string]: string | number | boolean | currencyInfo;
  }) => {
    setFieldInput({ ...fieldInput, ...updateObj });
  };

  const updateErrorLabel = (updateObj: { [key: string]: string }) => {
    setErrorLabel({ ...errorLabel, ...updateObj });
  };

  const isItemized = isItemizedRecord(items.length);
  const isDisableCurrency = useFixedForeignCurrency || isItemized;
  const isDisableLocalAmount =
    useFixedForeignCurrency && (isMultiFixedType || isSingleFixedType);
  const selectedDecimalPlaces = currencyInfoInput.decimalPlaces || 0;
  const selectedCurrencySymbol = currencyInfoInput.symbol || '';
  return (
    <>
      <div className={`${ROOT}__field`}>
        {isMultiFixedType && (
          <FixedAllowanceModalContent
            currencySymbol={selectedCurrencySymbol}
            decimalPlaces={selectedDecimalPlaces}
            isForeignCurrency
            multiFixedList={multiFixedList}
            optionId={fixedAllowanceOptionIdInput}
            updateFieldInput={updateFieldInput}
          />
        )}
        <div>
          <LabelWithHint text={msg().Exp_Clbl_Currency} />
          {isDisableCurrency ? (
            renderDisabledCurrencyField(currencyIdInput, currencyOptionList)
          ) : (
            <SelectField
              className={`${ROOT}__field-select`}
              onChange={onChangeCurrency}
              options={currencyOptionList}
              value={currencyIdInput}
            />
          )}
        </div>
        <div>
          <LabelWithHint
            text={`${msg().Exp_Clbl_LocalAmount} ${
              selectedCurrencySymbol ? `(${selectedCurrencySymbol})` : ''
            }`}
          />
          {isDisableLocalAmount ? (
            renderDisabledLocalAmountField(
              isMultiFixedType,
              isSingleFixedType,
              localAmountInput,
              selectedDecimalPlaces
            )
          ) : (
            <AmountField
              className={`${ROOT}__field-amount`}
              fractionDigits={selectedDecimalPlaces}
              onBlur={onChangeLocalAmount}
              value={localAmountInput}
              allowNegative={allowNegativeAmount}
            />
          )}
        </div>
        <div>
          <LabelWithHint text={msg().Exp_Clbl_Amount} />
          <AmountField
            className={`${ROOT}__field-amount`}
            currencySymbol={currencySymbol}
            disabled
            fractionDigits={currencyDecimalPlaces}
            value={amountInput}
          />
          {amountError && (
            <div className="input-feedback">{msg()[amountError]}</div>
          )}
        </div>
        <div>
          <div className={`${ROOT}__field-header`}>
            <LabelWithHint text={msg().Exp_Clbl_ExchangeRate} />
            <Button
              disabled={isExchangeRateManualInput && !originalExchangeRateInput}
              onClick={onToggleExchangeRateEditMode}
              type="text"
            >
              <Text size="medium" color="action">
                {isExchangeRateManualInput
                  ? msg().Exp_Clbl_Edited
                  : msg().Com_Btn_Edit}
              </Text>
            </Button>
          </div>
          <input
            className={`${ROOT}__field-amount slds-input`}
            disabled={!isExchangeRateManualInput}
            onBlur={onBlurExchangeRate}
            onChange={onChangeExchangeRate}
            onFocus={onFocusExchangeRate}
            type="tel"
            value={exchangeRateInput}
          />
        </div>
      </div>
      <Button
        className={`${ROOT}__save-btn`}
        onClick={onClickSaveButton}
        type="primary"
      >
        {msg().Com_Btn_Save}
      </Button>
    </>
  );
};

export default ForeignCurrencyAmountModal;
