import React from 'react';

import { find, get, isEmpty } from 'lodash';

import msg from '../../../../../../../commons/languages';
import FormatUtil from '../../../../../../../commons/utils/FormatUtil';
import SelectField from '../../../../../molecules/commons/Fields/SelectField';

import { AmountOption } from '../../../../../../../domain/models/exp/ExpenseType';
import {
  calcAmountFromRate,
  RoundingType,
} from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import { Record } from '../../../../../../../domain/models/exp/Record';
import { calculateTax } from '../../../../../../../domain/models/exp/TaxType';

import './index.scss';

type Props = {
  values: Record;
  currencySymbol: string;
  expRoundingSetting: RoundingType;
  taxRoundingSetting: RoundingType;
  readOnly: boolean;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  errors?: string[];
  fixedAllowanceOptionList?: Array<AmountOption>;
  rate: number;
  decimalPlaces: number;
};

const ROOT =
  'mobile-app-pages-expense-page-record-new-general-fixed-amount-selection';

export default class FixedAmountSelectionArea extends React.Component<Props> {
  onSelectAmount = (value: string) => {
    const selectedFixedAllowanceOption = find(
      this.props.fixedAllowanceOptionList,
      { id: value }
    );
    const amount = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.allowanceAmount
      : 0;
    const fixedAllowanceOptionId = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.id
      : '';
    const fixedAllowanceOptionLabel = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.label
      : '';

    const taxRes = calculateTax(
      this.props.rate,
      amount,
      this.props.decimalPlaces,
      this.props.taxRoundingSetting
    );

    this.props.onChangeUpdateValues({
      amount,
      withoutTax: taxRes.amountWithoutTax,
      'items.0.amount': amount,
      'items.0.withoutTax': taxRes.amountWithoutTax,
      'items.0.gstVat': taxRes.gstVat,
      'items.0.fixedAllowanceOptionId': fixedAllowanceOptionId,
      'items.0.fixedAllowanceOptionLabel': fixedAllowanceOptionLabel,
      'items.0.taxManual': false,
    });
  };

  onSelectLocalAmount = (value: string) => {
    const selectedFixedAllowanceOption = find(
      this.props.fixedAllowanceOptionList,
      { id: value }
    );
    const localAmount = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.allowanceAmount
      : 0;

    const fixedAllowanceOptionId = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.id
      : '';
    const fixedAllowanceOptionLabel = selectedFixedAllowanceOption
      ? selectedFixedAllowanceOption.label
      : '';

    const exchangeRate = this.props.values.items[0].exchangeRate || 0;
    const amount = calcAmountFromRate(
      exchangeRate,
      localAmount,
      this.props.decimalPlaces,
      this.props.expRoundingSetting
    );
    const updateObj = {
      amount,
      'items.0.amount': amount,
      'items.0.localAmount': localAmount,
      'items.0.fixedAllowanceOptionId': fixedAllowanceOptionId,
      'items.0.fixedAllowanceOptionLabel': fixedAllowanceOptionLabel,
    };

    this.props.onChangeUpdateValues(updateObj);
  };

  render() {
    const { values, fixedAllowanceOptionList } = this.props;
    const errors = this.props.errors || [];
    const isDisabledExpType =
      isEmpty(values.items[0].expTypeId) || this.props.readOnly;

    const isForeignCurrency = values.items[0].useForeignCurrency;
    const decimal = isForeignCurrency
      ? get(values, 'items.0.currencyInfo.decimalPlaces', 0)
      : this.props.decimalPlaces;
    const symbol =
      (isForeignCurrency
        ? get(values, 'items.0.currencyInfo.symbol', '')
        : this.props.currencySymbol) || '';

    const optionList: Array<{
      label: string;
      value: string;
    }> = fixedAllowanceOptionList
      ? fixedAllowanceOptionList.map((amountOption) => {
          return {
            label: `${amountOption.label} ${symbol}${FormatUtil.formatNumber(
              amountOption.allowanceAmount,
              decimal
            )}`,
            value: amountOption.id,
          };
        })
      : [{ label: '', value: '' }];

    optionList.unshift({
      label: '',
      value: '',
    });

    return (
      <div className={ROOT}>
        <SelectField
          required
          disabled={isDisabledExpType}
          label={msg().Exp_Lbl_AmountSelection}
          errors={errors}
          options={optionList}
          onChange={(e: any) => {
            if (isForeignCurrency) {
              this.onSelectLocalAmount(e.target.value);
            } else {
              this.onSelectAmount(e.target.value);
            }
          }}
          value={values.items[0].fixedAllowanceOptionId}
        />
      </div>
    );
  }
}
