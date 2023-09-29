import React from 'react';

import get from 'lodash/get';

import msg from '../../../../../../../commons/languages';
import FormatUtil from '../../../../../../../commons/utils/FormatUtil';
import ViewItem from '../../../../../molecules/commons/ViewItem';

import { isRecordItemized } from '../../../../../../../domain/models/exp/Record';
import { ExpRequestRecord } from '../../../../../../../domain/models/exp/request/Report';

import Amount from '../../../../../atoms/Amount';

const ROOT = 'mobile-app-pages-approval-page-expense-record-general';

export type Props = {
  record: ExpRequestRecord;
  currencySymbol: string;
  currencyDecimalPlaces: number;
};

export default (props: Props) => {
  const { record, currencyDecimalPlaces, currencySymbol } = props;

  const isForeignCurrency = get(record, 'items.0.useForeignCurrency');

  const renderGSTArea = () => {
    const gstLabel = isRecordItemized(record.recordType)
      ? msg().Exp_Clbl_GstAmount
      : `${record.items[0].taxTypeName || ''} - 
    ${FormatUtil.convertToDisplayingPercent(record.items[0].taxRate)}`;

    return (
      <ViewItem label={gstLabel} align="right">
        <Amount
          amount={record.items[0].gstVat}
          decimalPlaces={currencyDecimalPlaces}
          symbol={currencySymbol}
          className={`${ROOT}__tax`}
        />
        {record.items[0].taxManual && (
          <span className="rate-edited">{` (${msg().Exp_Lbl_Edited})`}</span>
        )}
      </ViewItem>
    );
  };

  let container = (
    <div className={ROOT}>
      <ViewItem label={msg().Exp_Clbl_WithoutTax} align="right">
        <Amount
          amount={record.items[0].withoutTax}
          decimalPlaces={currencyDecimalPlaces}
          symbol={currencySymbol}
          className={`${ROOT}__without-tax`}
        />
      </ViewItem>

      {renderGSTArea()}
    </div>
  );

  if (isForeignCurrency) {
    const symbol = get(record, 'items.0.currencyInfo.symbol') || '';
    const rate = record.items[0].exchangeRate;
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

    container = !isRecordItemized(record.recordType) && (
      <div className={ROOT}>{exchangeRateArea}</div>
    );
  }

  return container;
};
