import React, { FC } from 'react';

import get from 'lodash/get';
import isNil from 'lodash/isNil';

import styled, { css } from 'styled-components';

import FormatUtil from '@apps/commons/utils/FormatUtil';
import Warning from '@commons/components/exp/Warning';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import CheckActive from '@commons/images/icons/check-active.svg';
import msg from '@commons/languages';
import { getItemizeWarningMessage } from '@commons/utils/exp/ItemizationUtil';
import TextUtil from '@commons/utils/TextUtil';
import AmountInputField from '@mobile/components/molecules/commons/Fields/AmountInputField';

import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';
import {
  calculateTotalTaxes,
  isItemizedRecord,
  Record as ExpRecord,
  updateTaxItemFieldValues,
} from '@apps/domain/models/exp/Record';
import {
  AmountInputMode,
  ExpTaxTypeList,
} from '@apps/domain/models/exp/TaxType';

import PencilEditButton from '@mobile/components/pages/expense/Record/New/General/MultipleTaxEntries/PencilEditButton';

interface IMultipleTaxEntriesFormProps {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  currencySymbol: string;
  isRecordCC?: boolean;
  readOnly: boolean;
  taxRoundingSetting: RoundingType;
  taxTypeList: ExpTaxTypeList;
  values: ExpRecord;
  errors: { items?: Array<Record<string, any>> };
  getCustomHintProps?: (fieldName: string) => { [key: string]: unknown };
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
}

const MultipleTaxEntriesForm: FC<IMultipleTaxEntriesFormProps> = (props) => {
  const {
    readOnly,
    values,
    isRecordCC,
    getCustomHintProps,
    allowTaxExcludedAmount,
    taxRoundingSetting,
    allowTaxAmountChange,
    onChangeUpdateValues,
    currencySymbol,
    baseCurrencyDecimal,
    errors,
  } = props;

  // Multi tax for will only display for parent record, meaning itemIdx will be 0 always
  const itemIdx = 0;

  const recordItem = values.items[itemIdx];
  const { taxItems = [], allowNegativeAmount = false } = recordItem;
  const isRecordItemized = isItemizedRecord(values.items.length);

  const getInclTaxFieldsDisableStatus = (isMultiTaxChild = false) =>
    readOnly || isTaxExcludedMode || (isRecordCC && !isMultiTaxChild);
  const isTaxExcludedMode =
    values.amountInputMode === AmountInputMode.TaxExcluded;
  const isTaxIncludedMode =
    values.amountInputMode === AmountInputMode.TaxIncluded;

  const isExclTaxFieldsDisabled =
    readOnly || isTaxIncludedMode || !allowTaxExcludedAmount;

  const calcAmountAndTax =
    (field: string, taxItemIdx: number) => (value: number) => {
      const taxItem = taxItems[taxItemIdx];

      // form fields to be updated
      const updatedTaxItemFields = updateTaxItemFieldValues({
        taxItem,
        field,
        value,
        baseCurrencyDecimal,
        taxRoundingSetting,
        isTaxIncludedMode,
      });

      const updatedObj = (() => {
        // updated taxItems with latest changes
        taxItems[taxItemIdx] = { ...updatedTaxItemFields };

        // calculate total taxes using updated taxItems
        const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
          calculateTotalTaxes(taxItems, baseCurrencyDecimal);

        return {
          ...(getInclTaxFieldsDisableStatus() && !isRecordCC
            ? {
                amount: totalAmountInclTax,
                amountPayable: totalAmountInclTax,
                [`items.${itemIdx}.amount`]: totalAmountInclTax,
                [`items.${itemIdx}.amountPayable`]: totalAmountInclTax,
              }
            : {}),
          ...(isExclTaxFieldsDisabled
            ? {
                withoutTax: totalAmountExclTax,
                [`items.${itemIdx}.withoutTax`]: totalAmountExclTax,
              }
            : {}),
          gstVat: totalGstVat,
          [`items.${itemIdx}.gstVat`]: totalGstVat,
          [`items.${itemIdx}.taxItems.${taxItemIdx}`]: {
            ...updatedTaxItemFields,
          },
        };
      })();

      // submit fields to be updated
      onChangeUpdateValues(updatedObj);
    };

  const onChangeTotalAmountInclTax = (value) => {
    const { totalAmountExclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    onChangeUpdateValues({
      amount: value,
      amountPayable: value,
      withoutTax: totalAmountExclTax,
      [`items.${itemIdx}.amount`]: value,
      [`items.${itemIdx}.amountPayable`]: value,
      [`items.${itemIdx}.withoutTax`]: totalAmountExclTax,
    });
  };

  const onChangeTotalAmountExclTax = (value) => {
    const { totalAmountInclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    onChangeUpdateValues({
      amount: totalAmountInclTax,
      amountPayable: totalAmountInclTax,
      withoutTax: value,
      [`items.${itemIdx}.amount`]: totalAmountInclTax,
      [`items.${itemIdx}.withoutTax`]: value,
    });
  };

  const onClickTaxManualEditBtn = (taxItemIdx) => () => {
    const taxItem = taxItems[taxItemIdx];
    const { taxManual, amount, withoutTax } = taxItem;

    if (taxManual) {
      // form fields to be updated
      const updatedTaxItemFields = updateTaxItemFieldValues({
        taxItem,
        field: isTaxIncludedMode ? 'amount' : 'withoutTax',
        value: isTaxIncludedMode ? amount : withoutTax,
        baseCurrencyDecimal,
        taxRoundingSetting,
        isTaxIncludedMode,
      });

      // updated taxItems with latest changes
      taxItems[taxItemIdx] = { ...updatedTaxItemFields };

      const updatedObj = (() => {
        // updated taxItems with latest changes
        taxItems[taxItemIdx] = { ...updatedTaxItemFields };

        // calculate total taxes using updated taxItems
        const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
          calculateTotalTaxes(taxItems, baseCurrencyDecimal);

        return {
          ...(getInclTaxFieldsDisableStatus() && !isRecordCC
            ? {
                amount: totalAmountInclTax,
                amountPayable: totalAmountInclTax,
                [`items.${itemIdx}.amount`]: totalAmountInclTax,
                [`items.${itemIdx}.amountPayable`]: totalAmountInclTax,
              }
            : {}),
          ...(isExclTaxFieldsDisabled
            ? {
                withoutTax: totalAmountExclTax,
                [`items.${itemIdx}.withoutTax`]: totalAmountExclTax,
              }
            : {}),
          gstVat: totalGstVat,
          [`items.${itemIdx}.gstVat`]: totalGstVat,
          [`items.${itemIdx}.taxItems.${taxItemIdx}`]: {
            ...updatedTaxItemFields,
            taxManual: false,
          },
        };
      })();

      onChangeUpdateValues(updatedObj);
    } else {
      onChangeUpdateValues({
        [`items.${itemIdx}.taxItems.${taxItemIdx}.taxManual`]: true,
      });
    }
  };

  const renderTaxManualEditBtn = (taxItemIdx) => {
    const taxItem = taxItems[taxItemIdx];
    const { taxManual: isEditable } = taxItem;
    if (!allowTaxAmountChange || (!isEditable && readOnly)) {
      return null;
    }

    return (
      <PencilEditButton
        isEditable={isEditable}
        onClick={onClickTaxManualEditBtn(taxItemIdx)}
        isDisabled={readOnly}
      />
    );
  };

  const toggleInputMode = () => {
    const nextMode = isTaxIncludedMode
      ? AmountInputMode.TaxExcluded
      : AmountInputMode.TaxIncluded;

    const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
      calculateTotalTaxes(taxItems, baseCurrencyDecimal);

    if (nextMode === AmountInputMode.TaxIncluded) {
      onChangeUpdateValues({
        withoutTax: totalAmountExclTax,
        gstVat: totalGstVat,
        [`items.${itemIdx}.withoutTax`]: totalAmountExclTax,
        [`items.${itemIdx}.gstVat`]: totalGstVat,
        amountInputMode: nextMode,
      });
    }

    if (nextMode === AmountInputMode.TaxExcluded) {
      onChangeUpdateValues({
        amount: totalAmountInclTax,
        amountPayable: totalAmountInclTax,
        gstVat: totalGstVat,
        [`items.${itemIdx}.amount`]: totalAmountInclTax,
        [`items.${itemIdx}.gstVat`]: totalGstVat,
        amountInputMode: nextMode,
      });
    }
  };

  const renderEditBtn = (isTaxIncludedField: boolean) => {
    const isDisappeared = readOnly || itemIdx > 0 || isRecordCC;
    const isEditBtnNeeded =
      (isTaxIncludedField && !isTaxIncludedMode) || allowTaxExcludedAmount;
    const isEditable =
      (isTaxIncludedField && isTaxIncludedMode) ||
      (!isTaxIncludedField && !isTaxIncludedMode);

    if (isDisappeared || !isEditBtnNeeded) {
      return null;
    }

    return (
      <PencilEditButton
        isEditable={isEditable}
        isDisabled={readOnly}
        onClick={toggleInputMode}
      />
    );
  };

  const commonInputFieldProps = {
    allowNegative: allowNegativeAmount,
    decimalPlaces: baseCurrencyDecimal,
    currencySymbol,
  };

  const $totalTaxesAmount = (() => {
    if (taxItems?.length <= 0) {
      return null;
    }

    const isNegativeAmount = !isNil(recordItem.amount) && recordItem.amount < 0;
    const isNegativeWithoutTaxAmount =
      !isNil(recordItem.withoutTax) && recordItem.withoutTax < 0;
    const errorNegativeAmount = get(errors, `items.${itemIdx}.amount`);
    const errorAmountNotMatch = get(errors, 'amount');

    const { totalAmountInclTax, totalAmountExclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    const { status, message } = generateOCRAmountMsg(
      values.ocrAmount,
      recordItem.amount,
      baseCurrencyDecimal,
      'Exp_Clbl_IncludeTax'
    );

    const $totalAmountInclTax = (
      <>
        <FormField>
          <AmountInputField
            required={!getInclTaxFieldsDisableStatus()}
            label={msg().Exp_Lbl_TotalAmountInclTax}
            disabled={getInclTaxFieldsDisableStatus()}
            onBlur={onChangeTotalAmountInclTax}
            value={recordItem.amount}
            {...commonInputFieldProps}
            errors={
              !readOnly &&
              errorAmountNotMatch && [
                TextUtil.template(
                  msg()[errorAmountNotMatch],
                  `${currencySymbol}${FormatUtil.formatNumber(
                    totalAmountInclTax,
                    baseCurrencyDecimal
                  )}`
                ),
              ]
            }
          />
          {renderEditBtn(true)}
        </FormField>
        {!isNil(values.ocrAmount) && (
          <div className={`input-feedback ${status.toLowerCase()}`}>
            {status === AMOUNT_MATCH_STATUS.OK && (
              <CheckActive className="input-feedback-icon-ok" />
            )}
            {message}
          </div>
        )}
        {isNegativeAmount && !allowNegativeAmount && errorNegativeAmount && (
          <div className="input-feedback">{msg()[errorNegativeAmount]}</div>
        )}
        {isNegativeAmount && allowNegativeAmount && isTaxIncludedMode && (
          <div className={`negative-warning`}>
            <ImgIconAttention className={`negative-warning-svg`} />
            <span className={`negative-warning-msg`}>
              {TextUtil.template(
                msg().Exp_Lbl_NegativeAmount,
                msg().Exp_Clbl_IncludeTax
              )}
            </span>
          </div>
        )}
      </>
    );

    const $totalAmountExclTax = (
      <>
        <FormField>
          <AmountInputField
            required={!isExclTaxFieldsDisabled}
            label={msg().Exp_Lbl_TotalAmountExclTax}
            disabled={isExclTaxFieldsDisabled}
            value={recordItem.withoutTax}
            onBlur={onChangeTotalAmountExclTax}
            {...commonInputFieldProps}
            errors={
              !readOnly &&
              recordItem.withoutTax !== totalAmountExclTax && [
                TextUtil.template(
                  msg().Exp_Lbl_AmountOfAllTaxTypesDoNotAddUpToTotal,
                  `${currencySymbol}${FormatUtil.formatNumber(
                    totalAmountExclTax,
                    baseCurrencyDecimal
                  )}`
                ),
              ]
            }
          />
          {renderEditBtn(false)}
        </FormField>
        {isNegativeWithoutTaxAmount &&
          allowNegativeAmount &&
          isTaxExcludedMode && (
            <div className={`negative-warning`}>
              <ImgIconAttention className={`negative-warning-svg`} />
              <span className={`negative-warning-msg`}>
                {TextUtil.template(
                  msg().Exp_Lbl_NegativeAmount,
                  msg().Exp_Clbl_WithoutTax
                )}
              </span>
            </div>
          )}
      </>
    );

    return (
      <>
        <BlueHeader>{msg().Exp_Lbl_TotalAmountAndTaxes}</BlueHeader>
        {$totalAmountInclTax}
        {$totalAmountExclTax}
      </>
    );
  })();

  const generateItemizeWarningMessage = (
    key: string,
    message: string,
    taxTypeBaseId: string,
    total: number
  ) => {
    return isRecordItemized
      ? getItemizeWarningMessage(
          baseCurrencyDecimal,
          currencySymbol,
          values,
          key,
          message,
          taxTypeBaseId,
          total
        )
      : '';
  };

  const $multipleTaxEntries = taxItems.map((taxItem, taxItemIdx) => {
    const {
      amount: amtInclTax,
      withoutTax: amtExclTax,
      taxManual,
      gstVat,
      taxRate,
      taxTypeName,
      taxTypeBaseId,
    } = taxItem;

    const amountInclWarning = generateItemizeWarningMessage(
      'amount',
      msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
      taxTypeBaseId,
      amtInclTax
    );
    const amountExclWarning = generateItemizeWarningMessage(
      'withoutTax',
      msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
      taxTypeBaseId,
      amtExclTax
    );
    const taxWarning = generateItemizeWarningMessage(
      'gstVat',
      msg().Exp_Msg_TaxAmountOfItemizationDoNotAddUpToTotal,
      taxTypeBaseId,
      gstVat
    );

    return (
      <>
        <BlueHeader>{`${taxTypeName} - ${taxRate}%`}</BlueHeader>
        {/* Amount Incl Tax */}
        <FormField>
          <AmountInputField
            {...commonInputFieldProps}
            disabled={getInclTaxFieldsDisableStatus(true)}
            label={msg().Exp_Clbl_IncludeTax}
            onBlur={calcAmountAndTax('amount', taxItemIdx)}
            value={amtInclTax}
            {...getCustomHintProps('recordIncludeTax')}
          />
        </FormField>
        {!getInclTaxFieldsDisableStatus(true) && amountInclWarning && (
          <WarningEl message={amountInclWarning} />
        )}

        {/* Amount Excl Tax */}
        <FormField>
          <AmountInputField
            {...commonInputFieldProps}
            disabled={isExclTaxFieldsDisabled}
            label={msg().Exp_Clbl_WithoutTax}
            onBlur={calcAmountAndTax('withoutTax', taxItemIdx)}
            value={amtExclTax}
            {...getCustomHintProps('recordWithoutTax')}
          />
        </FormField>
        {!isExclTaxFieldsDisabled && amountExclWarning && (
          <WarningEl message={amountExclWarning} />
        )}

        {/* GST Amount */}
        <FormField>
          <AmountInputField
            {...commonInputFieldProps}
            disabled={readOnly || !taxManual}
            label={msg().Exp_Clbl_GstAmount}
            onBlur={calcAmountAndTax('gstVat', taxItemIdx)}
            value={gstVat}
            {...getCustomHintProps('recordGstAmount')}
          />
          <div>{renderTaxManualEditBtn(taxItemIdx)}</div>
        </FormField>
        {taxWarning && <WarningEl message={taxWarning} />}
      </>
    );
  });

  return (
    <MultipletaxEntriesWrapper>
      {$totalTaxesAmount}
      {$multipleTaxEntries}
      <SeparatorLine />
    </MultipletaxEntriesWrapper>
  );
};

export default MultipleTaxEntriesForm;

const sharedFontStyle = css`
  color: #333;
  font-size: 13px;
  white-space: nowrap;
`;

const SeparatorLine = styled.div`
  margin: 10px -12px;
  border-bottom: 1px solid #ddd;
`;

const BlueHeader = styled.div`
  ${sharedFontStyle}

  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  padding: 0 12px;
  background-color: #ebf3f7;
  margin: 10px -12px;

  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  white-space: normal;
`;

const MultipletaxEntriesWrapper = styled.div`
  .mobile-app-atoms-label__text {
    margin: 0;
    ${sharedFontStyle}
    font-weight: bold;
  }

  .ts-icon-button {
    padding-top: 18px;
    padding-left: 12px;
  }

  .negative-warning {
    margin-top: 8px;
    border: 1px solid #ffa845;
    border-radius: 4px;
    padding: 8px;
    display: flex;

    &-svg {
      display: flex;
      justify-content: center;
      align-self: center;
      overflow: visible !important;
    }

    &-msg {
      color: #333;
      margin-left: 10px;
    }
  }
`;

const FormField = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 8px;
`;

const WarningEl = styled(Warning)`
  margin: 8px 0;
`;
