import React from 'react';

import { find, get, isNil } from 'lodash';

import IconButton from '../../../../../../../commons/components/buttons/IconButton';
import ImgEditDisabled from '../../../../../../../commons/images/btnEditDisabled.svg';
import ImgEditOn from '../../../../../../../commons/images/btnEditOn.svg';
import msg from '../../../../../../../commons/languages';
import AmountInputField from '../../../../../molecules/commons/Fields/AmountInputField';
import TextUtil from '@apps/commons/utils/TextUtil';
import Warning from '@commons/components/exp/Warning';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import CheckActive from '@commons/images/icons/check-active.svg';
import { calculateTotalAmountForItems } from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';

import { RoundingType } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import {
  calculateAmountForCCTrans,
  calculateAmountPayable,
  isAmountMatch,
  isItemizedRecord,
  isWithholdingTaxUsageRequired,
  Record,
  RECORD_TYPE,
} from '../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calcTaxFromGstVat,
  calculateTax,
  ExpTaxTypeList,
  getTaxTypeList,
  TaxRes,
} from '../../../../../../../domain/models/exp/TaxType';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';

import TaxTypeArea from './TaxTypeArea';
import WithholdingTaxArea from './WithholdingTaxArea';

import './index.scss';
import './AmountArea.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general-amount-area';

type Props = {
  values: Record;
  itemIdx?: number;
  rate: number;
  currencyDecimalPlace: number;
  currencySymbol: string;
  readOnly: boolean;
  isRecordTypeIc?: boolean;
  isRecordCC?: boolean;
  useWithholdingTax?: boolean;
  taxTypeList: ExpTaxTypeList;
  taxRoundingSetting: RoundingType;
  allowTaxExcludedAmount: boolean;
  allowTaxAmountChange: boolean;
  baseCurrencyDecimal: number;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  setError: (arg0: string) => string[];
  setRate: (arg0: number) => void;
  getCustomHintProps?: (fieldName: string) => { [key: string]: unknown };
};

export default class AmountArea extends React.Component<Props> {
  onChangeAmount = (value: any) => {
    const { itemIdx, values } = this.props;
    const amount = value || 0;
    const recordItem = values.items[itemIdx];
    const isTaxIncluded =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const isAmountSame = isTaxIncluded
      ? amount === recordItem.amount
      : amount === recordItem.withoutTax;

    if (isAmountSame) return;

    const updatedObj = this.calcAmountAndTax(amount);
    this.props.onChangeUpdateValues(updatedObj);
  };

  onClickTaxEditButton = () => {
    const { itemIdx } = this.props;
    const isTaxIncluded =
      this.props.values.amountInputMode === AmountInputMode.TaxIncluded;
    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    const taxManual = !this.props.values.items[itemIdx].taxManual;
    const targetPath = `items.${itemIdx}`;
    if (!taxManual) {
      const taxType = find(this.props.taxTypeList, {
        historyId: this.props.values.items[itemIdx].taxTypeHistoryId,
      });
      const rate = taxType ? taxType.rate : 0;
      const baseAmount = isTaxIncluded
        ? this.props.values.items[itemIdx].amount
        : this.props.values.items[itemIdx].withoutTax;
      const taxRes: TaxRes = calcTaxAction(
        rate,
        baseAmount,
        this.props.currencyDecimalPlace,
        this.props.taxRoundingSetting
      );
      const amount = isTaxIncluded ? baseAmount : taxRes.amountWithTax;
      const withoutTax = isTaxIncluded ? taxRes.amountWithoutTax : baseAmount;
      let updateObj = {
        [`${targetPath}.amount`]: amount,
        [`${targetPath}.withoutTax`]: withoutTax,
        [`${targetPath}.gstVat`]: taxRes.gstVat,
        [`${targetPath}.taxManual`]: taxManual,
      };

      if (!itemIdx) {
        updateObj = { ...updateObj, amount, withoutTax };
      }

      this.props.onChangeUpdateValues(updateObj);
    } else {
      this.props.onChangeUpdateValues({
        [`${targetPath}.taxManual`]: taxManual,
      });
    }
  };

  calcAmountAndTax = (amount: number): { [key: string]: any } => {
    let updatedObj;
    const { itemIdx, currencyDecimalPlace, taxRoundingSetting, values } =
      this.props;
    const isTaxIncluded =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    if (isTaxIncluded) {
      const taxRes = calculateTax(
        this.props.rate,
        amount,
        currencyDecimalPlace,
        taxRoundingSetting
      );
      updatedObj = {
        [`items.${itemIdx}.amount`]: amount,
        [`items.${itemIdx}.withoutTax`]: taxRes.amountWithoutTax,
        [`items.${itemIdx}.gstVat`]: taxRes.gstVat,
        [`items.${itemIdx}.taxManual`]: false,
      };
      if (itemIdx === 0) {
        updatedObj = {
          ...updatedObj,
          amount,
          withoutTax: taxRes.amountWithoutTax,
        };
      }
    } else {
      const amountWithoutTax = amount || 0;
      const taxRes = calcAmountFromTaxExcluded(
        this.props.rate,
        amountWithoutTax,
        currencyDecimalPlace,
        taxRoundingSetting
      );
      updatedObj = {
        [`items.${itemIdx}.amount`]: taxRes.amountWithTax,
        [`items.${itemIdx}.withoutTax`]: amountWithoutTax,
        [`items.${itemIdx}.gstVat`]: taxRes.gstVat,
        [`items.${itemIdx}.taxManual`]: false,
      };
      if (itemIdx === 0) {
        updatedObj = {
          ...updatedObj,
          amount: taxRes.amountWithTax,
          withoutTax: amountWithoutTax,
        };
      }
    }
    return updatedObj;
  };

  updateAmountFields = (obj?: { [key: string]: any }) => {
    const { values, currencyDecimalPlace, onChangeUpdateValues, isRecordCC } =
      this.props;
    let amount = get(obj, 'amount', values.amount);
    const withholdingTaxAmount = get(
      obj,
      'withholdingTaxAmount',
      values.items[0].withholdingTaxAmount
    );

    let updateAmtPayableObj = {};
    if (!isRecordCC) {
      const amountPayable = calculateAmountPayable(
        amount,
        currencyDecimalPlace,
        withholdingTaxAmount
      );
      updateAmtPayableObj = {
        'items.0.withholdingTaxAmount': Math.abs(withholdingTaxAmount) * -1,
        'items.0.amountPayable': amountPayable,
      };
    } else {
      amount = calculateAmountForCCTrans(
        values.items[0].amountPayable || amount,
        currencyDecimalPlace,
        withholdingTaxAmount
      );
      updateAmtPayableObj = {
        'items.0.withholdingTaxAmount': Math.abs(withholdingTaxAmount) * -1,
        'items.0.amount': amount,
      };
      const updatedAmountTaxObj = this.calcAmountAndTax(amount);
      updateAmtPayableObj = { ...updateAmtPayableObj, ...updatedAmountTaxObj };
    }

    if (obj && obj.withholdingTaxAmount) delete obj.withholdingTaxAmount;
    const updateObj = {
      ...obj,
      ...updateAmtPayableObj,
    };
    onChangeUpdateValues(updateObj);
  };

  calcTaxFromGstVat = (gstVat: number) => {
    let taxAmount = gstVat;
    const { values, currencyDecimalPlace, itemIdx, onChangeUpdateValues } =
      this.props;
    const isTaxIncluded =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const amount = get(values, `items.${itemIdx}.amount`);
    const withoutTax = get(values, `items.${itemIdx}.withoutTax`);
    const baseAmount = isTaxIncluded ? amount : withoutTax;
    if (amount * taxAmount < 0) {
      taxAmount = taxAmount * -1;
    }
    const modifiedGstVat = isTaxIncluded
      ? baseAmount >= 0
        ? Math.min(baseAmount, taxAmount)
        : Math.max(baseAmount, taxAmount)
      : taxAmount;

    const taxRes = calcTaxFromGstVat(
      modifiedGstVat,
      baseAmount,
      currencyDecimalPlace,
      isTaxIncluded
    );

    let updateObj = {
      [`items.${itemIdx}.amount`]: taxRes.amountWithTax,
      [`items.${itemIdx}.withoutTax`]: taxRes.amountWithoutTax,
      [`items.${itemIdx}.gstVat`]: modifiedGstVat,
      [`items.${itemIdx}.taxManual`]: true,
    };

    if (!itemIdx) {
      updateObj = {
        ...updateObj,
        amount: taxRes.amountWithTax,
        withoutTax: taxRes.amountWithoutTax,
      };
    }
    onChangeUpdateValues(updateObj);
  };

  toggleInputMode = async () => {
    const { values } = this.props;

    const inputMode = values.amountInputMode;
    const nextMode =
      inputMode === AmountInputMode.TaxIncluded
        ? AmountInputMode.TaxExcluded
        : AmountInputMode.TaxIncluded;

    this.props.onChangeUpdateValues({
      amountInputMode: nextMode,
    });
  };

  renderEditImage = (isTaxIncludedField: boolean) => {
    const { values, readOnly, allowTaxExcludedAmount, itemIdx, isRecordCC } =
      this.props;
    const isDisappeared =
      readOnly ||
      values.recordType === RECORD_TYPE.FixedAllowanceSingle ||
      values.recordType === RECORD_TYPE.FixedAllowanceMulti ||
      itemIdx > 0 ||
      isRecordCC;
    const isTaxIncludedMode =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const isEditBtnNeeded =
      (isTaxIncludedField && !isTaxIncludedMode) || allowTaxExcludedAmount;
    const isEditable =
      (isTaxIncludedField && isTaxIncludedMode) ||
      (!isTaxIncludedField && !isTaxIncludedMode);
    const imgEdit = isEditable ? ImgEditDisabled : ImgEditOn;
    const imgEditAlt = isEditable ? 'ImgEditOn' : 'ImgEditOff';

    if (isDisappeared || !isEditBtnNeeded) {
      return null;
    }

    return (
      <IconButton
        src={imgEdit}
        onClick={!isEditable && this.toggleInputMode}
        srcType="svg"
        alt={imgEditAlt}
        disabled={readOnly}
        className={`${ROOT}_edit`}
      />
    );
  };

  renderTaxManualEditImage = () => {
    const { readOnly, values, allowTaxAmountChange, itemIdx } = this.props;
    const isEditable = get(values, `items.${itemIdx}.taxManual`);
    const imgEdit = isEditable ? ImgEditDisabled : ImgEditOn;
    const imgEditAlt = isEditable ? 'ImgEditOn' : 'ImgEditOff';
    if (!allowTaxAmountChange || (!isEditable && readOnly)) {
      return null;
    }
    return (
      <IconButton
        src={imgEdit}
        onClick={this.onClickTaxEditButton}
        srcType="svg"
        alt={imgEditAlt}
        disabled={readOnly}
        className={`${ROOT}_edit`}
      />
    );
  };

  render() {
    const {
      values,
      itemIdx = 0,
      setError,
      readOnly,
      currencyDecimalPlace,
      currencySymbol = '',
      isRecordTypeIc,
      isRecordCC,
      allowTaxExcludedAmount,
      baseCurrencyDecimal,
      useWithholdingTax,
      getCustomHintProps,
    } = this.props;
    const { ocrAmount, recordType } = values;
    const { amount, withoutTax } = values.items[itemIdx];

    const parentItem = values.items[0];
    const isParentItem = itemIdx === 0;
    const isParentHasChildItems =
      isParentItem && isItemizedRecord(values.items.length);
    const showOCRMsg = !isNil(ocrAmount) && isParentItem;
    const showNegativeAmountWarning = !isNil(amount) && amount < 0;
    const showNegativeWithoutTaxWarning = !isNil(withoutTax) && withoutTax < 0;

    const isTaxIncludedMode =
      values.amountInputMode === AmountInputMode.TaxIncluded;

    const { status, message } = generateOCRAmountMsg(
      ocrAmount,
      amount,
      baseCurrencyDecimal,
      'Exp_Clbl_IncludeTax'
    );

    const isDisabled =
      readOnly ||
      recordType === RECORD_TYPE.FixedAllowanceSingle ||
      recordType === RECORD_TYPE.FixedAllowanceMulti;

    const isWithholdingRequired = isWithholdingTaxUsageRequired(
      values.withholdingTaxUsage
    );

    const isTaxManual = get(values, `items.${itemIdx}.taxManual`);
    const allowNegativeAmount = get(
      values,
      `items.${itemIdx}.allowNegativeAmount`,
      false
    );
    const taxTypeList = isParentItem
      ? this.props.taxTypeList
      : getTaxTypeList(
          this.props.taxTypeList,
          parentItem.taxTypeBaseId,
          parentItem.taxItems
        );

    const isTaxIncludedInputMode =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const isTaxExcludedEnabled =
      allowTaxExcludedAmount && !isTaxIncludedInputMode;
    const compareAmount = isTaxIncludedInputMode ? amount : withoutTax;

    const childItemTotalAmount = calculateTotalAmountForItems(
      baseCurrencyDecimal,
      values,
      false
    );
    const childItemTotalTaxAmount = calculateTotalAmountForItems(
      baseCurrencyDecimal,
      values,
      false,
      'gstVat'
    );
    const isTotalAmountMatch = isAmountMatch(
      compareAmount || 0,
      childItemTotalAmount
    );
    const isTotalTaxAmountMatch = isAmountMatch(
      parentItem.gstVat || 0,
      childItemTotalTaxAmount
    );

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__amount-area`}>
          <AmountInputField
            required
            className={`${ROOT}_input`}
            disabled={
              isDisabled ||
              values.amountInputMode === AmountInputMode.TaxExcluded ||
              (isRecordCC && isParentItem)
            }
            label={msg().Exp_Clbl_IncludeTax}
            errors={setError(`items.${itemIdx}.amount`)}
            onBlur={(value) => this.onChangeAmount(value)}
            value={values.items[itemIdx].amount}
            decimalPlaces={currencyDecimalPlace}
            allowNegative={allowNegativeAmount}
            {...getCustomHintProps('recordIncludeTax')}
          />
          <div data-testid={`${ROOT}-tax-incl-edit`}>
            {this.renderEditImage(true)}
          </div>
        </div>
        {showNegativeAmountWarning && isTaxIncludedMode && (
          <div className={`${ROOT}__negative-warning`}>
            <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
            <span className={`${ROOT}__negative-warning-msg`}>
              {TextUtil.template(
                msg().Exp_Lbl_NegativeAmount,
                msg().Exp_Clbl_IncludeTax
              )}
            </span>
          </div>
        )}
        {isTaxIncludedInputMode &&
          isParentHasChildItems &&
          !isTotalAmountMatch && (
            <Warning
              className={`${ROOT}__warning`}
              message={TextUtil.template(
                msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
                `${currencySymbol}${FormatUtil.formatNumber(
                  childItemTotalAmount,
                  baseCurrencyDecimal
                )}`
              )}
            />
          )}

        {showOCRMsg && (
          <div className={`input-feedback ${status.toLowerCase()}`}>
            {status === AMOUNT_MATCH_STATUS.OK && (
              <CheckActive className="input-feedback-icon-ok" />
            )}
            {message}
          </div>
        )}

        {!isRecordTypeIc && (
          <>
            <div className={`${ROOT}__amount-area`}>
              <AmountInputField
                required
                className={`${ROOT}_input`}
                disabled={
                  isDisabled ||
                  values.amountInputMode === AmountInputMode.TaxIncluded ||
                  !allowTaxExcludedAmount
                }
                label={msg().Exp_Clbl_WithoutTax}
                errors={setError(`items.${itemIdx}.withoutTax`)}
                onBlur={(value) => this.onChangeAmount(value)}
                value={values.items[itemIdx].withoutTax}
                decimalPlaces={currencyDecimalPlace}
                allowNegative={allowNegativeAmount}
                {...getCustomHintProps('recordWithoutTax')}
              />
              <div data-testid={`${ROOT}-tax-excl-edit`}>
                {this.renderEditImage(false)}
              </div>
            </div>
            {showNegativeWithoutTaxWarning && !isTaxIncludedMode && (
              <div className={`${ROOT}__negative-warning`}>
                <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
                <span className={`${ROOT}__negative-warning-msg`}>
                  {TextUtil.template(
                    msg().Exp_Lbl_NegativeAmount,
                    msg().Exp_Clbl_WithoutTax
                  )}
                </span>
              </div>
            )}
            {isTaxExcludedEnabled &&
              isParentHasChildItems &&
              !isTotalAmountMatch && (
                <Warning
                  className={`${ROOT}__warning`}
                  message={TextUtil.template(
                    msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
                    `${currencySymbol}${FormatUtil.formatNumber(
                      childItemTotalAmount,
                      baseCurrencyDecimal
                    )}`
                  )}
                />
              )}

            <div className={`${ROOT}__amount-area`}>
              <AmountInputField
                required
                className={`${ROOT}_input`}
                disabled={readOnly || !isTaxManual}
                label={msg().Exp_Clbl_GstAmount}
                errors={setError(`items.${itemIdx}.amount`)}
                onBlur={(value) => this.calcTaxFromGstVat(value)}
                value={values.items[itemIdx].gstVat}
                decimalPlaces={currencyDecimalPlace}
                {...getCustomHintProps('recordGstAmount')}
                allowNegative={allowNegativeAmount}
              />
              <div>{this.renderTaxManualEditImage()}</div>
            </div>
            {isParentHasChildItems && !isTotalTaxAmountMatch && (
              <Warning
                className={`${ROOT}__warning`}
                message={TextUtil.template(
                  msg().Exp_Msg_TaxAmountOfItemizationDoNotAddUpToTotal,
                  `${currencySymbol}${FormatUtil.formatNumber(
                    childItemTotalTaxAmount,
                    baseCurrencyDecimal
                  )}`
                )}
              />
            )}
          </>
        )}

        {!isRecordTypeIc && (
          <TaxTypeArea
            values={this.props.values}
            itemIdx={itemIdx}
            currencyDecimalPlace={this.props.currencyDecimalPlace}
            taxRoundingSetting={this.props.taxRoundingSetting}
            readOnly={this.props.readOnly}
            taxTypeList={taxTypeList}
            setRate={this.props.setRate}
            setError={this.props.setError}
            onChangeUpdateValues={this.props.onChangeUpdateValues}
          />
        )}
        {useWithholdingTax && itemIdx === 0 && (
          <WithholdingTaxArea
            values={this.props.values}
            currencyDecimalPlace={this.props.currencyDecimalPlace}
            taxRoundingSetting={this.props.taxRoundingSetting}
            readOnly={this.props.readOnly}
            setError={this.props.setError}
            updateAmountFields={this.updateAmountFields}
            onChangeUpdateValues={this.props.onChangeUpdateValues}
            required={isWithholdingRequired}
            getCustomHintProps={getCustomHintProps}
          />
        )}
      </div>
    );
  }
}
