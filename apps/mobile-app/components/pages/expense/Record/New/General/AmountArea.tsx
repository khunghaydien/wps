import React from 'react';

import { cloneDeep, find, get, isNil } from 'lodash';

import IconButton from '../../../../../../../commons/components/buttons/IconButton';
import ImgEditDisabled from '../../../../../../../commons/images/btnEditDisabled.svg';
import ImgEditOn from '../../../../../../../commons/images/btnEditOn.svg';
import msg from '../../../../../../../commons/languages';
import AmountInputField from '../../../../../molecules/commons/Fields/AmountInputField';
import CheckActive from '@commons/images/icons/check-active.svg';

import { RoundingType } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import {
  Record,
  RECORD_TYPE,
} from '../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calcTaxFromGstVat,
  calculateTax,
  ExpTaxTypeList,
  TaxRes,
} from '../../../../../../../domain/models/exp/TaxType';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';

import TaxTypeArea from './TaxTypeArea';

import './index.scss';
import './AmountArea.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general-amount-area';

type Props = {
  values: Record;
  itemIdx?: number;
  hasChildItems: boolean;
  rate: number;
  currencyDecimalPlace: number;
  currencySymbol: string;
  readOnly: boolean;
  isRecordTypeIc?: boolean;
  isRecordCC?: boolean;
  isRecordTypeHotel?: boolean;
  taxTypeList: ExpTaxTypeList;
  taxRoundingSetting: RoundingType;
  allowTaxExcludedAmount: boolean;
  allowTaxAmountChange: boolean;
  baseCurrencyDecimal: number;
  showConfirm: (string) => Promise<boolean>;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  setError: (arg0: string) => string[];
  setRate: (arg0: number) => void;
};

export default class AmountArea extends React.Component<Props> {
  onChangeAmount = (value: any) => {
    const {
      itemIdx,
      isRecordTypeHotel,
      currencyDecimalPlace,
      taxRoundingSetting,
      values,
    } = this.props;
    let updatedObj;
    const amount = value || 0;
    const recordItem = values.items[itemIdx];
    const isTaxIncluded =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const isAmountSame = isTaxIncluded
      ? amount === recordItem.amount
      : amount === recordItem.withoutTax;

    if (isAmountSame) return;

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
        if (isRecordTypeHotel) {
          // parent hotel item only update amount field
          updatedObj = { amount, [`items.${itemIdx}.amount`]: amount };
        } else {
          updatedObj = {
            ...updatedObj,
            amount,
            withoutTax: taxRes.amountWithoutTax,
          };
        }
      }
    } else {
      const amountWithoutTax = value || 0;
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
        if (isRecordTypeHotel) {
          // parent hotel item only update amount.excl field
          updatedObj = {
            withoutTax: amountWithoutTax,
            [`items.${itemIdx}.withoutTax`]: amountWithoutTax,
          };
        } else {
          updatedObj = {
            ...updatedObj,
            amount: taxRes.amountWithTax,
            withoutTax: amountWithoutTax,
          };
        }
      }
    }
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

  calcTaxFromGstVat = (gstVat: number) => {
    const { values, currencyDecimalPlace, itemIdx, onChangeUpdateValues } =
      this.props;
    const isTaxIncluded =
      values.amountInputMode === AmountInputMode.TaxIncluded;
    const baseAmount = isTaxIncluded
      ? get(values, `items.${itemIdx}.amount`)
      : get(values, `items.${itemIdx}.withoutTax`);
    const modifiedGstVat = isTaxIncluded
      ? Math.min(baseAmount, gstVat)
      : gstVat;
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
    const { values, itemIdx, isRecordTypeHotel, hasChildItems, showConfirm } =
      this.props;
    const isParentHotel = isRecordTypeHotel && itemIdx === 0;

    const inputMode = values.amountInputMode;
    const nextMode =
      inputMode === AmountInputMode.TaxIncluded
        ? AmountInputMode.TaxExcluded
        : AmountInputMode.TaxIncluded;

    if (isParentHotel && hasChildItems) {
      if (await showConfirm(msg().Exp_Msg_ConfirmChangeInputMode)) {
        const record = cloneDeep(values);
        record.amountInputMode = nextMode;
        record.amount = 0;
        record.withoutTax = 0;
        record.items[0].amount = 0;
        record.items[0].withoutTax = 0;
        record.items[0].gstVat = 0;
        record.items.splice(1);

        this.props.onChangeUpdateValues(record);
      }
    } else {
      this.props.onChangeUpdateValues({
        amountInputMode: nextMode,
      });
    }
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
      isRecordTypeIc,
      isRecordCC,
      isRecordTypeHotel,
      allowTaxExcludedAmount,
      baseCurrencyDecimal,
    } = this.props;
    const { ocrAmount, amount } = values;
    const showOCRMsg = !isNil(ocrAmount);

    const { status, message } = generateOCRAmountMsg(
      ocrAmount,
      amount,
      baseCurrencyDecimal,
      'Exp_Clbl_IncludeTax'
    );

    const isDisabled =
      readOnly ||
      values.recordType === RECORD_TYPE.FixedAllowanceSingle ||
      values.recordType === RECORD_TYPE.FixedAllowanceMulti;
    const isParentHotel = isRecordTypeHotel && itemIdx === 0;

    const isTaxManual = get(values, `items.${itemIdx}.taxManual`);
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__amount-area`}>
          <AmountInputField
            required
            className={`${ROOT}_input`}
            disabled={
              isDisabled ||
              values.amountInputMode === AmountInputMode.TaxExcluded ||
              isRecordCC
            }
            label={msg().Exp_Clbl_IncludeTax}
            errors={setError(`items.${itemIdx}.amount`)}
            onBlur={(value) => this.onChangeAmount(value)}
            value={values.items[itemIdx].amount}
            decimalPlaces={currencyDecimalPlace}
          />
          <div data-testid={`${ROOT}-tax-incl-edit`}>
            {this.renderEditImage(true)}
          </div>
        </div>
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
              />
              <div data-testid={`${ROOT}-tax-excl-edit`}>
                {this.renderEditImage(false)}
              </div>
            </div>

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
              />
              {!isParentHotel && <div>{this.renderTaxManualEditImage()}</div>}
            </div>
          </>
        )}

        {!isParentHotel && !isRecordTypeIc && (
          <TaxTypeArea
            values={this.props.values}
            itemIdx={itemIdx}
            currencyDecimalPlace={this.props.currencyDecimalPlace}
            taxRoundingSetting={this.props.taxRoundingSetting}
            readOnly={this.props.readOnly}
            taxTypeList={this.props.taxTypeList}
            setRate={this.props.setRate}
            setError={this.props.setError}
            onChangeUpdateValues={this.props.onChangeUpdateValues}
          />
        )}
      </div>
    );
  }
}
