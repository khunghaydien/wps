import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import Collapse from '@apps/commons/components/Collapse';
import CaretDown from '@apps/commons/images/icons/iconArrowDown.svg';
import CaretRight from '@apps/commons/images/icons/iconExpandClose.svg';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import {
  calcItemsTotalAmount,
  isRecordItemized,
  Record,
} from '@apps/domain/models/exp/Record';
import { calculateSubtotalAmount } from '@apps/domain/models/exp/Report';

import './RecordsSummary.scss';

const ROOT = 'ts-expenses__form-records__list-records-summary';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  isApprovedRequest: boolean;
  isCostCenterUsed: boolean;
  isCreatingNew: boolean;
  isExpenseRequest?: boolean;
  isJobUsed: boolean;
  records: Array<Record>;
  renderItem: (
    record,
    recordIdx,
    isCostCenterUsed,
    isJobUsed,
    isCreatingNew
  ) => void;
};

const renderTaxArea = (
  records: Array<Record>,
  baseCurrencyDecimal: number,
  baseCurrencySymbol: string
) => {
  const isHotelFee = isRecordItemized(records[0].recordType);
  const groupByTaxType = _.groupBy(records, 'items.0.taxTypeName');
  const taxes = Object.keys(groupByTaxType).map((name) => {
    const itemsPerTax = groupByTaxType[name];
    let taxAmount = calcItemsTotalAmount(
      itemsPerTax,
      'items.0.gstVat',
      baseCurrencyDecimal
    );

    taxAmount = FormatUtil.formatNumber(taxAmount, baseCurrencyDecimal);

    return (
      <div className={`${ROOT}__tax-item`}>
        <div className={`${ROOT}__tax-amount`}>
          {baseCurrencySymbol} {taxAmount}
        </div>
        {!isHotelFee && (
          <div className={`${ROOT}__tax-name`}>{`${
            name || ''
          } ${FormatUtil.convertToDisplayingPercent(
            itemsPerTax[0].items[0].taxRate || 0
          )}`}</div>
        )}
      </div>
    );
  });

  return <div className={`${ROOT}__tax`}>{taxes}</div>;
};

const RecordsSummary = (props: Props) => {
  const {
    records,
    isApprovedRequest,
    isCostCenterUsed,
    isJobUsed,
    baseCurrencySymbol,
    baseCurrencyDecimal,
    isExpenseRequest,
  } = props;

  const groupByExpType = _.groupBy(records, 'items.0.expTypeName');

  const table = Object.keys(groupByExpType).map((expTypeName) => {
    const items = groupByExpType[expTypeName].filter(
      ({ recordId }) => !!recordId || isApprovedRequest
    );

    if (_.isEmpty(items)) {
      return <></>;
    }

    const title = `${expTypeName} (${items.length})`;

    const { foreignCurrency } = calculateSubtotalAmount(items);

    let baseCurrencyAmount = calcItemsTotalAmount(
      items,
      'items.0.amount',
      baseCurrencyDecimal
    );

    baseCurrencyAmount = FormatUtil.formatNumber(
      baseCurrencyAmount,
      baseCurrencyDecimal
    );

    const subTotal = (
      <div className={`${ROOT}__amount-base`}>
        {baseCurrencySymbol} {baseCurrencyAmount}
      </div>
    );

    const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
      const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
      return (
        <div key={fc} className={`${ROOT}__amount-foreign`}>
          {symbol} {FormatUtil.formatNumber(amount, decimalPlaces)}
        </div>
      );
    });

    const amountArea = (
      <div className={`${ROOT}__amount`}>
        {subTotal}
        {foreignCurrencyAmount}
      </div>
    );

    let exclTaxArea = <div className={`${ROOT}__dash`}>—</div>;
    let taxArea = <div className={`${ROOT}__dash`}>—</div>;

    if (_.isEmpty(foreignCurrency)) {
      let exclTaxTotal = calcItemsTotalAmount(
        items,
        'items.0.withoutTax',
        baseCurrencyDecimal
      );

      exclTaxTotal = FormatUtil.formatNumber(exclTaxTotal, baseCurrencyDecimal);

      exclTaxArea = (
        <div className={`${ROOT}__excl`}>
          {baseCurrencySymbol} {exclTaxTotal}
        </div>
      );

      taxArea = renderTaxArea(items, baseCurrencyDecimal, baseCurrencySymbol);
    }

    const summary = (
      <>
        {exclTaxArea}
        {taxArea}
        {amountArea}
      </>
    );

    const body = (
      <>
        {items.map((item) => {
          // get idx based on original view
          const idx = _.findIndex(records, { recordId: item.recordId });
          return props.renderItem(
            item,
            idx,
            isCostCenterUsed,
            isJobUsed,
            props.isCreatingNew
          );
        })}
      </>
    );

    const session = (
      <Collapse
        header={title}
        summary={summary}
        isCollapsed
        closeIcon={CaretDown}
        openIcon={CaretRight}
        btnSrcType="svg"
      >
        {body}
      </Collapse>
    );

    return session;
  });

  const cssClass = classNames(ROOT, {
    'is-request': isExpenseRequest,
    'extra-one-column':
      (isJobUsed || isCostCenterUsed) && !(isJobUsed && isCostCenterUsed),
    'extra-two-column': isJobUsed && isCostCenterUsed,
  });

  return <div className={cssClass}>{table}</div>;
};

export default RecordsSummary;
