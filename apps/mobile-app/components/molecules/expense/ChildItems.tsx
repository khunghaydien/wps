import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../commons/utils/FormatUtil';
import ViewItem from '../commons/ViewItem';

import { getLabelValueFromEIs } from '../../../../domain/models/exp/ExtendedItem';
import { RecordItem } from '../../../../domain/models/exp/Record';

import LinkListItem from '@mobile/components/atoms/LinkListItem';

import Amount from '../../atoms/Amount';

import './ChildItems.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-record-child-items';

type Props = {
  currencySymbol: string;
  currencyDecimalPlaces: number;
  items: RecordItem[];
  isClickable?: boolean;
  onClickChildItem?: (idx) => void;
};

const ChildItems = (props: Props) => {
  const { items } = props;
  const isForeignCurrency = get(items, '0.useForeignCurrency');
  const foreignDecimal = get(items, '0.currencyInfo.decimalPlaces') || 0;
  const foreignSymbol = get(items, '0.currencyInfo.symbol') || '';

  /**
   * Render tax area for each base currency record item
   */
  const renderTaxArea = (recordItem) => {
    const taxLabel = `${recordItem.taxTypeName || ''} - 
      ${FormatUtil.convertToDisplayingPercent(recordItem.taxRate)}`;
    return (
      <>
        <ViewItem label={msg().Exp_Clbl_WithoutTax} align="right">
          <Amount
            amount={recordItem.withoutTax}
            decimalPlaces={props.currencyDecimalPlaces}
            symbol={props.currencySymbol}
            className={`${ROOT}__without-tax`}
          />
        </ViewItem>
        <ViewItem label={taxLabel} align="right">
          <Amount
            amount={recordItem.gstVat}
            decimalPlaces={props.currencyDecimalPlaces}
            symbol={props.currencySymbol}
            className={`${ROOT}__tax`}
          />
          {recordItem.taxManual && (
            <span className="rate-edited">{` (${msg().Exp_Lbl_Edited})`}</span>
          )}
        </ViewItem>
      </>
    );
  };

  /**
   * Render exchange rate area for each foreign currency record item
   */
  const renderExchangeRateArea = (recordItem) => {
    const ratio = `${foreignSymbol} 1 = ${props.currencySymbol} ${recordItem.exchangeRate}`;
    return (
      <ViewItem
        label={msg().Exp_Clbl_ExchangeRate}
        align="right"
        className={`${ROOT}__exchange-rate`}
      >
        <span>{ratio}</span>
        {recordItem.exchangeRateManual && (
          <span className="rate-edited">{` (${msg().Exp_Lbl_Edited})`}</span>
        )}
      </ViewItem>
    );
  };

  const itemSections = items.map((item, index) => {
    if (index <= 0) {
      return null;
    }
    const extendedItems = getLabelValueFromEIs(item);
    // check if is same date as previous item; for grouping purpose
    const isSameDate =
      index > 1 && items[index - 1].recordDate === item.recordDate;

    const headerClass = classNames(`${ROOT}__header`, {
      'is-first-item': !isSameDate,
    });

    let headerContent = (
      <>
        <div className={`${ROOT}__exp-type`}>{item.expTypeName}</div>
        <Amount
          amount={item.amount}
          decimalPlaces={props.currencyDecimalPlaces}
          symbol={props.currencySymbol}
          className="base-amount"
        />
        {isForeignCurrency && (
          <Amount
            amount={item.localAmount}
            decimalPlaces={foreignDecimal}
            symbol={foreignSymbol}
            className="local-amount"
          />
        )}
      </>
    );

    if (props.isClickable) {
      headerContent = (
        <LinkListItem
          className={headerClass}
          onClick={() => props.onClickChildItem(index)}
        >
          <div>{headerContent}</div>
        </LinkListItem>
      );
    } else {
      headerContent = <div className={headerClass}>{headerContent}</div>;
    }

    return (
      <>
        {!isSameDate && (
          <div className={`${ROOT}__date sticky`}>
            {DateUtil.formatYMD(item.recordDate)}
          </div>
        )}

        {headerContent}

        <div className={`${ROOT}__content`}>
          {isForeignCurrency
            ? renderExchangeRateArea(item)
            : renderTaxArea(item)}

          {extendedItems.map((ei, i) => (
            <ViewItem key={i} label={ei.label} className="block">
              {ei.value}
            </ViewItem>
          ))}

          {item.remarks && (
            <ViewItem label={msg().Exp_Clbl_Summary} className="block">
              {item.remarks}
            </ViewItem>
          )}
        </div>
      </>
    );
  });

  return itemSections && <div className={ROOT}>{itemSections}</div>;
};

export default ChildItems;
