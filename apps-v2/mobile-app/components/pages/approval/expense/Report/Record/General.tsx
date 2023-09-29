import React from 'react';

import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import msg from '../../../../../../../commons/languages';
import FormatUtil from '../../../../../../../commons/utils/FormatUtil';
import ViewItem from '../../../../../molecules/commons/ViewItem';
import Highlight from '@apps/commons/components/exp/Highlight';
import { Color } from '@apps/core/styles';

import { isUseWithholdingTax } from '../../../../../../../domain/models/exp/Record';
import { ExpRequestRecord } from '../../../../../../../domain/models/exp/request/Report';

import Amount from '../../../../../atoms/Amount';

const ROOT = 'mobile-app-pages-approval-page-expense-record-general';

export type Props = {
  record: ExpRequestRecord;
  preRecord?: ExpRequestRecord;
  currencySymbol: string;
  currencyDecimalPlaces: number;
  isHighlightDiff?: boolean;
};

export default (props: Props) => {
  const {
    record,
    currencyDecimalPlaces,
    currencySymbol,
    isHighlightDiff,
    preRecord,
  } = props;

  const isForeignCurrency = get(record, 'items.0.useForeignCurrency');

  const checkHighlight = (key: string) => {
    if (!isHighlightDiff) return false;
    if (!preRecord) return true;
    const value = get(record.items[0], key);
    const preValue = get(preRecord.items[0], key);
    return !isEqual(value, preValue);
  };

  const renderGSTArea = () => {
    const gstLabel = `${record.items[0].taxTypeName || ''} -
    ${FormatUtil.convertToDisplayingPercent(record.items[0].taxRate)}`;

    const isGSTHighlight = preRecord && checkHighlight('taxTypeName');
    const label: any = isGSTHighlight ? (
      <Highlight>{gstLabel}</Highlight>
    ) : (
      gstLabel
    );

    return (
      <ViewItem label={label} align="right">
        <Highlight highlight={checkHighlight('gstVat')}>
          <Amount
            amount={record.items[0].gstVat}
            decimalPlaces={currencyDecimalPlaces}
            symbol={currencySymbol}
            className={`${ROOT}__tax`}
          />
        </Highlight>
        {record.items[0].taxManual && (
          <span className="rate-edited">{` (${msg().Exp_Clbl_Edited})`}</span>
        )}
      </ViewItem>
    );
  };

  const renderWithholdingArea = () => {
    if (!isUseWithholdingTax(record.withholdingTaxUsage)) {
      return null;
    }

    return (
      <>
        <ViewItem label={msg().Exp_Clbl_WithholdingTaxAmount} align="right">
          <Highlight highlight={checkHighlight('withholdingTaxAmount')}>
            <Amount
              amount={record.items[0].withholdingTaxAmount}
              decimalPlaces={currencyDecimalPlaces}
              symbol={currencySymbol}
              className={`${ROOT}__withholding-tax`}
            />
          </Highlight>
        </ViewItem>
        <ViewItem label={msg().Exp_Clbl_AmountPayable} align="right">
          <Highlight highlight={checkHighlight('amountPayable')}>
            <Amount
              amount={record.items[0].amountPayable}
              decimalPlaces={currencyDecimalPlaces}
              symbol={currencySymbol}
              className={`${ROOT}__amount-payable`}
            />
          </Highlight>
        </ViewItem>
      </>
    );
  };

  let container = (
    <div className={ROOT}>
      <ViewItem label={msg().Exp_Clbl_WithoutTax} align="right">
        <Highlight highlight={checkHighlight('withoutTax')}>
          <Amount
            amount={record.items[0].withoutTax}
            decimalPlaces={currencyDecimalPlaces}
            symbol={currencySymbol}
            className={`${ROOT}__without-tax`}
          />
        </Highlight>
      </ViewItem>

      {renderGSTArea()}

      {renderWithholdingArea()}
    </div>
  );

  if (isForeignCurrency) {
    const symbol = get(record, 'items.0.currencyInfo.symbol') || '';
    const code = get(record, 'items.0.currencyInfo.code') || '';
    const rate = record.items[0].exchangeRate;

    const currencyArea = (
      <ViewItem className="block" label={msg().Exp_Clbl_Currency}>
        <Highlight highlight={checkHighlight('currencyInfo.code')}>
          {code}
        </Highlight>
        {checkHighlight('currencyInfo.code') && (
          <Highlight highlightColor={Color.bgDisabled}>
            {`(${get(preRecord.items[0], 'currencyInfo.code') || ''})`}
          </Highlight>
        )}
      </ViewItem>
    );

    const exchangeRateArea = (
      <ViewItem
        label={msg().Exp_Clbl_ExchangeRate}
        align="right"
        className={`${ROOT}__exchange-rate`}
      >
        <span>{`${symbol} 1 = ${currencySymbol} ${rate}`}</span>
        {record.items[0].exchangeRateManual && (
          <span className="rate-edited">{` (${msg().Exp_Lbl_Edited})`}</span>
        )}
      </ViewItem>
    );

    container = (
      <div className={ROOT}>
        {exchangeRateArea}
        {currencyArea}
      </div>
    );
  }

  return container;
};
