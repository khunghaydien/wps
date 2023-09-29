import React, { FC } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import Tabs from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs';
import Tab from '@commons/components/exp/Form/RecordItem/General/Layout/AccordionTabs/AccordionTab';
import Grid from '@commons/components/exp/Form/RecordItem/General/Layout/Grid';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import CheckActive from '@commons/images/icons/check-active.svg';
import { getItemizeWarningMessage } from '@commons/utils/exp/ItemizationUtil';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';
import {
  calculateTotalTaxes,
  isCCRecord,
  isIcRecord,
  Record as ExpRecord,
  updateTaxItemFieldValues,
} from '@apps/domain/models/exp/Record';
import {
  AmountInputMode,
  RoundingModeType,
} from '@apps/domain/models/exp/TaxType';

import TaxFormField from './TaxFormField';

interface IMultipleTaxEntriesFormProps {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint?: CustomHint;
  errors: { items?: Array<Record<string, any>> };
  expPreRecord?: ExpRecord;
  expRecord: ExpRecord;
  fixedAmountMessage?: string;
  isExpenseRequest: boolean;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  isItemized: boolean;
  isMileageRecord?: boolean;
  isShowIcon?: boolean;
  readOnly: boolean;
  taxRoundingSetting: RoundingModeType;
  toggleInputMode: () => void;
  updateRecord: (
    updateObj: {
      [key: string]: any;
    },
    recalc?: boolean
  ) => void;
}

const MultipleTaxEntriesForm: FC<IMultipleTaxEntriesFormProps> = (props) => {
  const {
    expRecord,
    expPreRecord,
    isHighlightDiff,
    isHighlightNewRecord,
    customHint,
    isFinanceApproval,
    isFixedAllowance,
    isMileageRecord,
    readOnly,
    fixedAmountMessage,
    isExpenseRequest,
    baseCurrencyDecimal,
    allowTaxAmountChange,
    isItemized,
    isShowIcon,
    taxRoundingSetting,
    allowTaxExcludedAmount,
    baseCurrencySymbol = '',
    errors,
    toggleInputMode,
    updateRecord,
  } = props;

  // Multi tax for will only display for parent record, meaning recordItemIdx will be 0 always
  const recordItemIdx = 0;

  const { amountInputMode, recordType } = expRecord;
  const recordItem = expRecord.items[recordItemIdx];
  const preRecordItem = expPreRecord?.items?.[recordItemIdx];
  const { taxItems = [], allowNegativeAmount = false } = recordItem;

  const isRecordTypeIc = isIcRecord(recordType);
  const isRecordCC = isCCRecord(expRecord);
  const isTaxExcludedMode = amountInputMode === AmountInputMode.TaxExcluded;
  const isTaxIncludedMode = amountInputMode === AmountInputMode.TaxIncluded;
  const isEditButtonShown =
    allowTaxExcludedAmount || (!allowTaxExcludedAmount && isTaxExcludedMode);
  const isExpenseIcRecord = !isExpenseRequest && isRecordTypeIc;

  const getInclTaxFieldsDisableStatus = (isMultiTaxChild = false) =>
    readOnly ||
    isFixedAllowance ||
    isExpenseIcRecord ||
    isTaxExcludedMode ||
    (isRecordCC && !isMultiTaxChild) ||
    isMileageRecord;
  const amtExclTaxReadOnly = readOnly || isMileageRecord;
  const isExclTaxFieldsDisabled =
    !allowTaxExcludedAmount || isTaxIncludedMode || amtExclTaxReadOnly;

  // updates other fields when one tax field changes
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
                [`items.${recordItemIdx}.amount`]: totalAmountInclTax,
                [`items.${recordItemIdx}.amountPayable`]: totalAmountInclTax,
              }
            : {}),
          ...(isExclTaxFieldsDisabled
            ? {
                withoutTax: totalAmountExclTax,
                [`items.${recordItemIdx}.withoutTax`]: totalAmountExclTax,
              }
            : {}),
          gstVat: totalGstVat,
          [`items.${recordItemIdx}.gstVat`]: totalGstVat,
          [`items.${recordItemIdx}.taxItems.${taxItemIdx}`]: {
            ...updatedTaxItemFields,
          },
        };
      })();

      updateRecord(updatedObj, true);
    };

  const onChangeTotalAmountInclTax = (value) => {
    const { totalAmountExclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    updateRecord(
      {
        amount: value,
        amountPayable: value,
        withoutTax: totalAmountExclTax,
        [`items.${recordItemIdx}.amount`]: value,
        [`items.${recordItemIdx}.amountPayable`]: value,
        [`items.${recordItemIdx}.withoutTax`]: totalAmountExclTax,
      },
      true
    );
  };

  const onChangeTotalAmountExclTax = (value) => {
    const { totalAmountInclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    updateRecord(
      {
        amount: totalAmountInclTax,
        amountPayable: totalAmountInclTax,
        [`items.${recordItemIdx}.amount`]: totalAmountInclTax,
        withoutTax: value,
        [`items.${recordItemIdx}.withoutTax`]: value,
      },
      true
    );
  };

  const onClickGstVatEditBtn = (taxItemIdx) => () => {
    const taxItem = taxItems[taxItemIdx];
    const { taxManual, amount, withoutTax } = taxItem;

    if (taxManual) {
      // form fields to be updated
      const updatedTaxItemFields = updateTaxItemFieldValues({
        taxItem: { ...taxItem, taxManual: false },
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
                [`items.${recordItemIdx}.amount`]: totalAmountInclTax,
                [`items.${recordItemIdx}.amountPayable`]: totalAmountInclTax,
              }
            : {}),
          ...(isExclTaxFieldsDisabled
            ? {
                withoutTax: totalAmountExclTax,
                [`items.${recordItemIdx}.withoutTax`]: totalAmountExclTax,
              }
            : {}),
          gstVat: totalGstVat,
          [`items.${recordItemIdx}.gstVat`]: totalGstVat,
          [`items.${recordItemIdx}.taxItems.${taxItemIdx}`]: {
            ...updatedTaxItemFields,
            taxManual: false,
          },
        };
      })();

      updateRecord(updatedObj, true);
    } else {
      updateRecord(
        {
          [`items.${recordItemIdx}.taxItems.${taxItemIdx}.taxManual`]: true,
        },
        true
      );
    }
  };

  const onClickEditButton = (amountInputMode) => () => {
    const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
      calculateTotalTaxes(taxItems, baseCurrencyDecimal);

    if (amountInputMode === AmountInputMode.TaxIncluded) {
      updateRecord(
        {
          withoutTax: totalAmountExclTax,
          gstVat: totalGstVat,
          [`items.${recordItemIdx}.withoutTax`]: totalAmountExclTax,
          [`items.${recordItemIdx}.gstVat`]: totalGstVat,
        },
        true
      );
    }

    if (amountInputMode === AmountInputMode.TaxExcluded) {
      updateRecord(
        {
          amount: totalAmountInclTax,
          amountPayable: totalAmountInclTax,
          gstVat: totalGstVat,
          [`items.${recordItemIdx}.amount`]: totalAmountInclTax,
          [`items.${recordItemIdx}.gstVat`]: totalGstVat,
        },
        true
      );
    }

    toggleInputMode();
  };

  const isHighlight = (amount: number, preAmount: number) => {
    const isDifferent = expPreRecord && isHighlightDiff && amount !== preAmount;
    return isHighlightNewRecord || isDifferent;
  };

  const commonInputFieldProps = {
    allowNegativeAmount,
    decimalPlaces: baseCurrencyDecimal,
    currencySymbol: baseCurrencySymbol,
  };

  const $totalTaxAmounts = (() => {
    if (taxItems.length <= 0) {
      return null;
    }

    const { totalAmountInclTax, totalAmountExclTax } = calculateTotalTaxes(
      taxItems,
      baseCurrencyDecimal
    );

    const { status, message } = generateOCRAmountMsg(
      expRecord.ocrAmount,
      recordItem.amount,
      baseCurrencyDecimal,
      'Exp_Clbl_IncludeTax'
    );

    /* Total Amount (Incl. Tax) */
    const $totalAmountInclTax = (() => {
      const isNegative = !isNil(recordItem.amount) && recordItem.amount < 0;
      const errorNegativeAmount = get(errors, `items.${recordItemIdx}.amount`);
      const errorAmountNotMatch = get(errors, 'amount');

      return (
        <TaxFormField
          label={msg().Exp_Lbl_TotalAmountInclTax} // KIV - use custom label
          value={recordItem.amount}
          showEditButton={
            recordItemIdx === 0 && !isRecordCC && isEditButtonShown
          }
          isEditButtonDisabled={readOnly || !isTaxExcludedMode}
          onClickEditButton={onClickEditButton(AmountInputMode.TaxIncluded)}
          onInputChange={onChangeTotalAmountInclTax}
          isInputDisabled={getInclTaxFieldsDisableStatus()}
          inputFieldClassName={classNames({
            'highlight-bg': isHighlight(
              recordItem.amount,
              preRecordItem?.amount
            ),
          })}
          {...commonInputFieldProps}
          errors={
            errorAmountNotMatch && [
              TextUtil.template(
                msg()[errorAmountNotMatch],
                `${baseCurrencySymbol}${FormatUtil.formatNumber(
                  totalAmountInclTax,
                  baseCurrencyDecimal
                )}`
              ),
            ]
          }
          feedbackMessage={
            <>
              {!isNil(expRecord.ocrAmount) && (
                <div className={`input-feedback ${status.toLowerCase()}`}>
                  {status === AMOUNT_MATCH_STATUS.OK && (
                    <CheckActive className="input-feedback-icon-ok" />
                  )}
                  {message}
                </div>
              )}
              {isNegative && !allowNegativeAmount && errorNegativeAmount && (
                <div className="input-feedback">
                  {msg()[errorNegativeAmount]}
                </div>
              )}
              {isNegative && allowNegativeAmount && isTaxIncludedMode && (
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
          }
        />
      );
    })();

    /* Total Amount (Excl. Tax) */
    const $totalAmountExclTax = (() => {
      const isEditBtnDisabled = readOnly || !isTaxIncludedMode;
      const isNegative =
        !isNil(recordItem.withoutTax) && recordItem.withoutTax < 0;

      return (
        <TaxFormField
          label={msg().Exp_Lbl_TotalAmountExclTax}
          value={recordItem.withoutTax}
          showEditButton={
            !isRecordCC &&
            allowTaxExcludedAmount &&
            !isFinanceApproval &&
            !isEditBtnDisabled
          }
          inputFieldClassName={classNames({
            'highlight-bg': isHighlight(
              recordItem.withoutTax,
              preRecordItem?.withoutTax
            ),
          })}
          isEditButtonDisabled={isEditBtnDisabled}
          onClickEditButton={onClickEditButton(AmountInputMode.TaxExcluded)}
          isInputDisabled={isExclTaxFieldsDisabled}
          onInputChange={onChangeTotalAmountExclTax}
          {...commonInputFieldProps}
          errors={
            recordItem.withoutTax !== totalAmountExclTax && [
              TextUtil.template(
                msg().Exp_Lbl_AmountOfAllTaxTypesDoNotAddUpToTotal,
                `${baseCurrencySymbol}${FormatUtil.formatNumber(
                  totalAmountExclTax,
                  baseCurrencyDecimal
                )}`
              ),
            ]
          }
          feedbackMessage={
            <>
              {isNegative && allowNegativeAmount && isTaxExcludedMode && (
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
          }
        />
      );
    })();

    return (
      <Grid noOfColumns={2} columnGap={20}>
        {$totalAmountInclTax}
        {$totalAmountExclTax}
      </Grid>
    );
  })();

  const generateItemizeWarningMessage = (
    key: string,
    message: string,
    taxTypeBaseId: string,
    total: number
  ) => {
    return isItemized
      ? getItemizeWarningMessage(
          baseCurrencyDecimal,
          baseCurrencySymbol,
          expRecord,
          key,
          message,
          taxTypeBaseId,
          total
        )
      : '';
  };

  const $multipleTaxEntries = taxItems.map(
    (
      {
        taxTypeBaseId,
        taxTypeName,
        taxRate,
        amount,
        withoutTax,
        taxManual,
        gstVat,
      },
      taxItemIdx
    ) => {
      const warningMessage = generateItemizeWarningMessage(
        'amount',
        msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
        taxTypeBaseId,
        amount
      );
      const {
        amount: previousAmount,
        withoutTax: previousWithoutTax,
        gstVat: previousGstVat,
      } = preRecordItem?.taxItems?.[taxItemIdx] || {};

      const $amountInclTax = (
        <TaxFormField
          label={msg().Exp_Clbl_IncludeTax}
          hintMsg={customHint.recordIncludeTax}
          tooltipMessage={isFixedAllowance && !readOnly && fixedAmountMessage}
          isInputDisabled={getInclTaxFieldsDisableStatus(true)}
          value={amount}
          onInputChange={calcAmountAndTax('amount', taxItemIdx)}
          inputFieldClassName={classNames({
            'highlight-bg': isHighlight(amount, previousAmount),
          })}
          {...commonInputFieldProps}
          warningMessage={isTaxIncludedMode ? warningMessage : ''}
        />
      );

      const $amountExclTax = (() => {
        const warningMessage = isTaxExcludedMode
          ? generateItemizeWarningMessage(
              'withoutTax',
              msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
              taxTypeBaseId,
              withoutTax
            )
          : '';
        return (
          <TaxFormField
            label={msg().Exp_Clbl_WithoutTax}
            hintMsg={customHint.recordWithoutTax}
            isInputDisabled={isExclTaxFieldsDisabled}
            value={withoutTax}
            onInputChange={calcAmountAndTax('withoutTax', taxItemIdx)}
            inputFieldClassName={classNames({
              'highlight-bg': isHighlight(withoutTax, previousWithoutTax),
            })}
            {...commonInputFieldProps}
            warningMessage={warningMessage}
          />
        );
      })();

      const $gstVat = (() => {
        const gstVatInputDisabled = readOnly || !taxManual;
        const warningMessage = generateItemizeWarningMessage(
          'gstVat',
          msg().Exp_Msg_TaxAmountOfItemizationDoNotAddUpToTotal,
          taxTypeBaseId,
          gstVat
        );

        return (
          <TaxFormField
            label={msg().Exp_Clbl_GstAmount}
            hintMsg={customHint.recordGstAmount}
            showEditButton={allowTaxAmountChange && (taxManual || !readOnly)}
            isEditButtonDisabled={readOnly}
            onClickEditButton={onClickGstVatEditBtn(taxItemIdx)}
            isInputDisabled={gstVatInputDisabled}
            editButtonLabel={!gstVatInputDisabled && msg().Exp_Clbl_Edited}
            inputFieldClassName={classNames({
              'highlight-bg': isHighlight(gstVat, previousGstVat),
            })}
            {...commonInputFieldProps}
            value={
              gstVatInputDisabled
                ? `${baseCurrencySymbol} ${
                    FormatUtil.formatNumber(gstVat, baseCurrencyDecimal) || 0
                  }`
                : gstVat
            }
            onInputChange={calcAmountAndTax('gstVat', taxItemIdx)}
            warningMessage={warningMessage}
          />
        );
      })();

      return (
        <>
          <TaxRateAndName>{`${taxTypeName} - ${FormatUtil.convertToDisplayingPercent(
            taxRate
          )}`}</TaxRateAndName>
          <Grid noOfColumns={3} columnGap={20}>
            {$amountInclTax}
            {$amountExclTax}
            {$gstVat}
          </Grid>
        </>
      );
    }
  );

  return (
    <Tabs>
      <Tab
        id={msg().Exp_Lbl_TotalAmountAndTaxes}
        label={msg().Exp_Lbl_TotalAmountAndTaxes}
        isShowIcon={isShowIcon}
      >
        {$totalTaxAmounts}

        {$multipleTaxEntries}
      </Tab>
    </Tabs>
  );
};

export default MultipleTaxEntriesForm;

const TaxRateAndName = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ebf3f7;
  color: #333;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin: -1px -20px 20px -20px;
  padding: 0 20px;
  min-height: 30px;
  font-size: 12px;
  line-height: 15px;
`;
