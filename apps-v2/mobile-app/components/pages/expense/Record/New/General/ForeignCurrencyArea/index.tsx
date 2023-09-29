import React from 'react';

import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import styled from 'styled-components';

import AmountInputField from '../../../../../../molecules/commons/Fields/AmountInputField';
import SelectField from '../../../../../../molecules/commons/Fields/SelectField';
import ViewItem from '../../../../../../molecules/commons/ViewItem';
import Warning from '@commons/components/exp/Warning';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import msg from '@commons/languages';
import {
  calculateFCChildItemListAmount,
  calculateTotalAmountForItems,
  updateChildItemInfo,
} from '@commons/utils/exp/ItemizationUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import { parseNumberOrNull, toFixedNumber } from '@commons/utils/NumberUtil';
import TextUtil from '@commons/utils/TextUtil';

import {
  calcAmountFromRate,
  Currency,
  CurrencyList,
  RoundingType,
} from '../../../../../../../../domain/models/exp/foreign-currency/Currency';
import { ExchangeRateList } from '../../../../../../../../domain/models/exp/foreign-currency/ExchangeRate';
import {
  isAmountMatch,
  isItemizedRecord,
  Record,
  RECORD_TYPE,
  RecordItem,
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
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRoundingSetting: RoundingType;
  readOnly: boolean;
  onChangeUpdateValues: (arg0: { [key: string]: unknown }) => void;
  setError: (arg0: string) => string[];
  getCustomHintProps?: (fieldName: string) => { [key: string]: unknown };
};

const ROOT = 'mobile-app-pages-expense-page-record-new-general-amount-area';

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

      const updatedItemList = updateChildItemInfo(updateObj, values.items);
      const updatedChildObj = this.calculateChildItem(updatedItemList);
      Object.assign(updateObj, ...updatedChildObj);
      this.props.onChangeUpdateValues(updateObj);
    });
  };

  onLocalAmountChange = (local: number | string | null) => {
    const { values, itemIdx, baseCurrencyDecimal, expRoundingSetting } =
      this.props;
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
      updateObj = { ...updateObj, amount };
    }
    this.props.onChangeUpdateValues(updateObj);
  };

  onExchangeRateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { values, itemIdx, baseCurrencyDecimal, expRoundingSetting } =
      this.props;
    const cloneValues = cloneDeep(values);
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
      cloneValues.items[0].amount = Number(amount);
      cloneValues.items[0].exchangeRate = rate;

      if (isItemizedRecord(values.items.length)) {
        const updatedChildObj = this.calculateChildItem(cloneValues.items);
        Object.assign(updateObj, ...updatedChildObj);
      }
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
    const { itemIdx, values } = this.props;
    const { exchangeRateManual, originalExchangeRate, localAmount } =
      values.items[itemIdx];
    const cloneValues = cloneDeep(values);

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
      cloneValues.items[0].amount = Number(amount);
      cloneValues.items[0].exchangeRate = originalExchangeRate;

      if (itemIdx === 0) {
        assign(updateObj, { amount });
      }
    }

    if (isItemizedRecord(values.items.length)) {
      const childExchangeRateManualObj = {};
      const [parentItem, ...childItemList] = cloneValues.items;

      parentItem.exchangeRateManual = updatedManual;
      childItemList.forEach((_, idx) => {
        const itemPath = `items.${idx + 1}.exchangeRateManual`;
        childExchangeRateManualObj[itemPath] = updatedManual;
      });

      const updatedChildItemObj = this.calculateChildItem(cloneValues.items);
      Object.assign(
        updateObj,
        ...updatedChildItemObj,
        childExchangeRateManualObj
      );
    }
    this.props.onChangeUpdateValues(updateObj);
  };

  calculateChildItem = (itemList: RecordItem[]) => {
    const { baseCurrencyDecimal, expRoundingSetting } = this.props;

    if (!isItemizedRecord(itemList.length)) return [];

    const calculatedChildItemList = calculateFCChildItemListAmount(
      baseCurrencyDecimal,
      expRoundingSetting,
      itemList
    );
    return calculatedChildItemList.map((item, idx: number) => ({
      [`items.${idx + 1}`]: item,
    }));
  };

  render() {
    const {
      values,
      itemIdx = 0,
      currencyList,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      readOnly,
      setError,
      getCustomHintProps,
    } = this.props;

    const isParentItem = itemIdx === 0;
    const isItemizedParent =
      isParentItem && isItemizedRecord(values.items.length);
    const decimalPlaces = get(
      values,
      `items.${itemIdx}.currencyInfo.decimalPlaces`,
      0
    );
    const symbol = get(values, `items.${itemIdx}.currencyInfo.symbol`, '');
    const currencyId = values.items[itemIdx].currencyId || '';
    const localAmount = values.items[itemIdx].localAmount;
    const showNegativeAmountWarning = localAmount < 0;

    const allowNegativeAmount = get(
      values,
      `items.${itemIdx}.allowNegativeAmount`,
      false
    );
    const localAmountLabel =
      msg().Exp_Clbl_LocalAmount + (symbol ? ` (${symbol})` : '');
    const amountError = this.props.setError(`items.${itemIdx}.amount`);
    const childItemTotalAmount = calculateTotalAmountForItems(
      decimalPlaces,
      values,
      true
    );
    const isTotalAmountMatch = isAmountMatch(localAmount, childItemTotalAmount);

    const currencyOptions = currencyList.map((currency) => {
      return {
        label: currency.isoCurrencyCode,
        value: currency.id,
      };
    });

    const isFixedForeignCurrency =
      values.items[itemIdx].useFixedForeignCurrency;
    const isCurrencyDisabled =
      readOnly ||
      isFixedForeignCurrency ||
      !values.items[itemIdx].expTypeId ||
      itemIdx > 0;

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
        {...getCustomHintProps('recordCurrency')}
      />
    );

    const foreignCurrencyAmount = (
      <>
        <AmountInputField
          required
          disabled={
            readOnly ||
            this.props.values.recordType === RECORD_TYPE.FixedAllowanceSingle ||
            this.props.values.recordType === RECORD_TYPE.FixedAllowanceMulti
          }
          errors={setError(`items.${itemIdx}.localAmount`)}
          label={localAmountLabel}
          onBlur={this.onLocalAmountChange}
          value={localAmount}
          decimalPlaces={decimalPlaces}
          allowNegative={allowNegativeAmount}
        />
        {showNegativeAmountWarning && (
          <div className={`${ROOT}__negative-warning`}>
            <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
            <span className={`${ROOT}__negative-warning-msg`}>
              {TextUtil.template(
                msg().Exp_Lbl_NegativeAmount,
                msg().Exp_Clbl_LocalAmount
              )}
            </span>
          </div>
        )}
        {isItemizedParent && !isTotalAmountMatch && (
          <WarningEl
            message={TextUtil.template(
              msg().Exp_Msg_LocalAmountOfItemizationDoNotAddUpToTotal,
              `${symbol || ''}${FormatUtil.formatNumber(
                childItemTotalAmount,
                decimalPlaces
              )}`
            )}
          />
        )}
      </>
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
        {foreignCurrencyAmount}
        <ExchangeRateWrapper isParentItem={isParentItem}>
          <ExchangeRate
            onExchangeRateBlur={this.onExchangeRateBlur}
            onExchangeRateFocus={this.onExchangeRateFocus}
            readOnly={readOnly}
            exchangeRateManual={values.items[itemIdx].exchangeRateManual}
            originalExchangeRate={values.items[itemIdx].originalExchangeRate}
            onClickEditRateBtn={this.onClickEditRateBtn}
            exchangeRate={values.items[itemIdx].exchangeRate}
            getCustomHintProps={getCustomHintProps}
            isParentItem={isParentItem}
          />
        </ExchangeRateWrapper>
        {baseAmount}
      </>
    );
  }
}

const ExchangeRateWrapper = styled.div<{ isParentItem: boolean }>`
  ${({ isParentItem }) =>
    isParentItem
      ? ''
      : `
      .mobile-app-pages-expense-page-record-new-general-foreign-currency-area-exchange-rate
      .mobile-app-molecules-commons-text-field {
        width: 100%;
      }
    `}
`;

const WarningEl = styled(Warning)`
  margin-bottom: 8px;
`;
