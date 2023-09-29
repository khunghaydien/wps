import React from 'react';

import assign from 'lodash/assign';
import find from 'lodash/find';
import get from 'lodash/get';

import msg from '../../../../../../../../commons/languages';
import {
  parseNumberOrNull,
  toFixedNumber,
} from '../../../../../../../../commons/utils/NumberUtil';
import AmountInputField from '../../../../../../molecules/commons/Fields/AmountInputField';
import SelectField from '../../../../../../molecules/commons/Fields/SelectField';
import ViewItem from '../../../../../../molecules/commons/ViewItem';

import {
  calcAmountFromRate,
  Currency,
  CurrencyList,
  RoundingType,
} from '../../../../../../../../domain/models/exp/foreign-currency/Currency';
import { ExchangeRateList } from '../../../../../../../../domain/models/exp/foreign-currency/ExchangeRate';
import {
  Record,
  RECORD_TYPE,
} from '../../../../../../../../domain/models/exp/Record';

import Amount from '../../../../../../atoms/Amount';
import Errors from '../../../../../../atoms/Errors';
import ExchangeRate from './ExchangeRate';

import './index.scss';

type RateMap = {
  [currencyId: string]: {
    [recordDate: string]: ExchangeRateList;
  };
};

export type ForeignCurrencyProps = {
  currencyList: CurrencyList;
  exchangeRateMap: RateMap;
  getExchangeRate: (currencyId: string, recordDate: string) => Promise<number>;
};

type Props = ForeignCurrencyProps & {
  values: Record;
  itemIdx: number;
  isRecordTypeHotel: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRoundingSetting: RoundingType;
  readOnly: boolean;
  isParentHotel: boolean;
  hasChildItems: boolean;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  setError: (arg0: string) => string[];
};

export default class ForeignCurrencyArea extends React.Component<Props> {
  onCurrencyChange = (currencyId: string) => {
    const { values, currencyList, baseCurrencyDecimal, expRoundingSetting } =
      this.props;

    const recordDate = values.recordDate;

    this.props.getExchangeRate(currencyId, recordDate).then((rate) => {
      const currencyInfo =
        find(currencyList, { id: currencyId }) || ({} as Currency);
      const currencyDecimal = Number(currencyInfo.decimalPlaces) || 0;
      const localAmount = toFixedNumber(
        values.items[0].localAmount,
        currencyDecimal
      );
      const amount = calcAmountFromRate(
        rate,
        localAmount,
        baseCurrencyDecimal,
        expRoundingSetting
      );

      const updateObj = {
        amount,
        'items.0.amount': amount,
        'items.0.currencyId': currencyId,
        'items.0.localAmount': localAmount,
        'items.0.currencyInfo.code': currencyInfo.isoCurrencyCode || '',
        'items.0.currencyInfo.name': currencyInfo.name || '',
        'items.0.currencyInfo.decimalPlaces': currencyDecimal,
        'items.0.currencyInfo.symbol': currencyInfo.symbol || '',
        'items.0.exchangeRate': rate,
        'items.0.originalExchangeRate': rate,
        'items.0.exchangeRateManual': rate === 0,
      };
      this.props.onChangeUpdateValues(updateObj);
    });
  };

  onLocalAmountChange = (local: number | string | null) => {
    const {
      values,
      itemIdx,
      isRecordTypeHotel,
      baseCurrencyDecimal,
      expRoundingSetting,
    } = this.props;
    const localAmount = parseNumberOrNull(local) || 0;
    const exchangeRate =
      parseNumberOrNull(values.items[itemIdx].exchangeRate) || 0;

    const amount = calcAmountFromRate(
      exchangeRate,
      localAmount,
      baseCurrencyDecimal,
      expRoundingSetting
    );

    let updateObj = {
      [`items.${itemIdx}.amount`]: amount,
      [`items.${itemIdx}.localAmount`]: localAmount,
    };
    if (itemIdx === 0) {
      if (isRecordTypeHotel) {
        updateObj = { [`items.${itemIdx}.localAmount`]: localAmount };
      } else {
        updateObj = { ...updateObj, amount };
      }
    }
    this.props.onChangeUpdateValues(updateObj);
  };

  onExchangeRateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { values, itemIdx, baseCurrencyDecimal, expRoundingSetting } =
      this.props;
    const value = e.target.value;
    const rate = parseNumberOrNull(value) || 0;
    const localAmount =
      parseNumberOrNull(values.items[itemIdx].localAmount) || 0;
    const amount = calcAmountFromRate(
      rate,
      localAmount,
      baseCurrencyDecimal,
      expRoundingSetting
    );
    let updateObj = {
      [`items.${itemIdx}.amount`]: amount,
      [`items.${itemIdx}.exchangeRate`]: rate,
    };
    if (itemIdx === 0) {
      updateObj = { ...updateObj, amount };
    }

    this.props.onChangeUpdateValues(updateObj);
  };

  onExchangeRateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { itemIdx } = this.props;
    const { value } = e.target;
    this.props.onChangeUpdateValues({
      [`items.${itemIdx}.exchangeRate`]: parseNumberOrNull(value) || '',
    });
  };

  onClickEditRateBtn = () => {
    const { itemIdx } = this.props;
    const { exchangeRateManual, originalExchangeRate, localAmount } =
      this.props.values.items[itemIdx];

    let updatedManual = !exchangeRateManual;
    if (originalExchangeRate === 0) {
      updatedManual = true;
    }

    const updateObj = {
      [`items.${itemIdx}.exchangeRateManual`]: updatedManual,
    };
    // if disable rate field, need to recalc using originalRate(master rate)
    if (!updatedManual) {
      const amount = calcAmountFromRate(
        originalExchangeRate,
        localAmount,
        this.props.baseCurrencyDecimal,
        this.props.expRoundingSetting
      );
      assign(updateObj, {
        [`items.${itemIdx}.amount`]: amount,
        [`items.${itemIdx}.exchangeRate`]: originalExchangeRate,
      });
      if (itemIdx === 0) {
        assign(updateObj, { amount });
      }
    }
    this.props.onChangeUpdateValues(updateObj);
  };

  render() {
    const {
      values,
      itemIdx,
      isParentHotel,
      hasChildItems,
      currencyList,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      readOnly,
    } = this.props;

    const decimalPlaces = get(values, 'items.0.currencyInfo.decimalPlaces', 0);
    const symbol = get(values, 'items.0.currencyInfo.symbol', '');
    const currencyId = values.items[0].currencyId || '';

    const localAmountLabel =
      msg().Exp_Clbl_LocalAmount + (symbol ? ` (${symbol})` : '');
    const amountError = this.props.setError(`items.${itemIdx}.amount`);

    const currencyOptions = currencyList.map((currency) => {
      return {
        label: currency.isoCurrencyCode,
        value: currency.id,
      };
    });

    const isFixedForeignCurrency = values.items[0].useFixedForeignCurrency;
    const isCurrencyDisabled =
      readOnly ||
      isFixedForeignCurrency ||
      !values.items[0].expTypeId ||
      itemIdx > 0 ||
      (isParentHotel && hasChildItems);

    const currencySelection = (
      <SelectField
        required
        disabled={isCurrencyDisabled}
        label={msg().Exp_Clbl_Currency}
        options={currencyOptions}
        onChange={(e: any) => {
          const id = e.target.value;
          this.onCurrencyChange(id);
        }}
        value={currencyId}
      />
    );

    const localAmount = (
      <AmountInputField
        required
        disabled={
          readOnly ||
          this.props.values.recordType === RECORD_TYPE.FixedAllowanceSingle ||
          this.props.values.recordType === RECORD_TYPE.FixedAllowanceMulti
        }
        label={localAmountLabel}
        onBlur={this.onLocalAmountChange}
        value={values.items[itemIdx].localAmount}
        decimalPlaces={decimalPlaces}
      />
    );

    const baseAmount = (
      <ViewItem label={msg().Exp_Clbl_Amount} align="right">
        <Amount
          amount={values.items[itemIdx].amount}
          decimalPlaces={baseCurrencyDecimal}
          symbol={baseCurrencySymbol}
        />
        <Errors messages={amountError} />
      </ViewItem>
    );

    return (
      <>
        {currencySelection}
        {localAmount}
        {!isParentHotel && (
          <ExchangeRate
            onExchangeRateBlur={this.onExchangeRateBlur}
            onExchangeRateFocus={this.onExchangeRateFocus}
            readOnly={readOnly}
            exchangeRateManual={values.items[itemIdx].exchangeRateManual}
            originalExchangeRate={values.items[itemIdx].originalExchangeRate}
            onClickEditRateBtn={this.onClickEditRateBtn}
            exchangeRate={values.items[itemIdx].exchangeRate}
          />
        )}
        {baseAmount}
      </>
    );
  }
}
