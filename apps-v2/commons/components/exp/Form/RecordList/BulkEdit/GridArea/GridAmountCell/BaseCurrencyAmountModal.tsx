import React, { ReactElement, useEffect, useRef, useState } from 'react';

import Button from '@commons/components/buttons/Button';
import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import msg from '@commons/languages';

import { AmountOption } from '@apps/domain/models/exp/ExpenseType';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import {
  isFixedAllowanceMulti,
  isMileageRecord,
  Record,
} from '@apps/domain/models/exp/Record';

import FixedAllowanceModalContent from './FixedAllowanceModalContent';
import MileageSummaryModalContent from './MileageSummaryModalContent';

import './BaseCurrencyAmountModal.scss';

const ROOT = 'ts-expenses__modal-bulk-edit-base-currency-amount';

type LocalState = {
  amountInput: number;
  fixedAllowanceOptionIdInput: string;
  mileageDistanceInput: string;
};

export type ErrorLabelState = {
  distanceError: string;
};

// props from parent component
export type ParentProps = {
  currencyDecimalPlaces: number;
  currencySymbol: string;
  expMileageUnit: MileageUnit;
  multiFixedList: AmountOption[];
  record: Record;
  calculateAmountFromRate: (localAmount: number, rate?: number) => number;
  calculateFromTaxType: (
    amount: number,
    updateField?: { [key: string]: string | number | boolean }
  ) => void;
  searchInitialSetting: () => void;
};

type Props = ParentProps & {
  onCloseSummaryView: () => void;
};

const BaseCurrencyAmountModal = (props: Props): ReactElement => {
  const {
    currencyDecimalPlaces,
    currencySymbol,
    expMileageUnit,
    multiFixedList,
    record,
    calculateAmountFromRate,
    calculateFromTaxType,
    onCloseSummaryView,
    searchInitialSetting,
  } = props;
  const { items, recordType: expenseType, mileageRouteInfo } = record;
  const {
    amount,
    fixedAllowanceOptionId,
    mileageDistance,
    mileageRate,
    mileageRateName,
  } = items[0];
  const isFirstLoad = useRef(true);
  const [errorLabel, setErrorLabel] = useState<ErrorLabelState>({
    distanceError: '',
  });
  const [fieldInput, setFieldInput] = useState<LocalState>({
    amountInput: amount,
    fixedAllowanceOptionIdInput: fixedAllowanceOptionId,
    mileageDistanceInput: mileageDistance ? mileageDistance.toString() : '',
  });
  const { amountInput, fixedAllowanceOptionIdInput, mileageDistanceInput } =
    fieldInput;
  const isMileageExpense = isMileageRecord(expenseType);
  const isFixedAllowanceExpense = isFixedAllowanceMulti(expenseType);

  useEffect(() => {
    searchInitialSetting();
  }, []);

  // update amount on field change
  useEffect(() => {
    if (!isFirstLoad.current && isMileageExpense) {
      updateAmountFromRate(mileageRate, Number(mileageDistanceInput));
    }
    if (isFirstLoad.current) {
      // for first time the grid is opened, we don't need to trigger calculation logic for any record
      isFirstLoad.current = false;
    }
  }, [mileageDistanceInput]);

  const onClickSaveButton = async () => {
    const hasError = Object.values(errorLabel).some((label) => label !== '');
    if (hasError) return;

    const updateObj = {
      'items.0.fixedAllowanceOptionId': fixedAllowanceOptionIdInput,
      'items.0.mileageDistance': Number(mileageDistanceInput),
    };
    await calculateFromTaxType(amountInput, updateObj);
    onCloseSummaryView();
  };

  const updateAmountFromRate = (localAmount: number, rate?: number) => {
    const amount = calculateAmountFromRate(localAmount, rate);
    updateFieldInput({
      amountInput: amount,
    });
  };

  const updateFieldInput = (updateObj: { [key: string]: string | number }) => {
    setFieldInput({ ...fieldInput, ...updateObj });
  };

  const updateErrorLabel = (updateObj: { [key: string]: string }) => {
    setErrorLabel({ ...errorLabel, ...updateObj });
  };

  const isShowAmountField = isMileageExpense;
  return (
    <>
      {isMileageExpense && (
        <MileageSummaryModalContent
          baseCurrencySymbol={currencySymbol}
          errorLabel={errorLabel}
          mileageDistance={mileageDistanceInput}
          mileageRouteInfo={mileageRouteInfo}
          mileageUnit={expMileageUnit}
          mileageRateInfo={
            mileageRate
              ? { name: mileageRateName, rate: mileageRate }
              : undefined
          }
          updateErrorLabel={updateErrorLabel}
          updateFieldInput={updateFieldInput}
        />
      )}
      {isFixedAllowanceExpense && (
        <FixedAllowanceModalContent
          currencySymbol={currencySymbol}
          decimalPlaces={currencyDecimalPlaces}
          multiFixedList={multiFixedList}
          optionId={fixedAllowanceOptionIdInput}
          updateFieldInput={updateFieldInput}
        />
      )}
      {isShowAmountField && (
        <div className={`${ROOT}__field-amount`}>
          <LabelWithHint text={msg().Exp_Clbl_IncludeTax} />
          <AmountField
            currencySymbol={currencySymbol}
            disabled
            fractionDigits={currencyDecimalPlaces || 0}
            value={amountInput}
          />
        </div>
      )}
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

export default BaseCurrencyAmountModal;
