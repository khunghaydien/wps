import React from 'react';

import { drop, get } from 'lodash';

import { Record } from '../../../../../../domain/models/exp/Record';

import DateUtil from '../../../../../utils/DateUtil';
import FormatUtil from '../../../../../utils/FormatUtil';
import TextUtil from '../../../../../utils/TextUtil';

import msg from '../../../../../languages';
import Grid from '../../../../Grid';
import Currency from '../../../../Grid/Formatters/Currency';

import './index.scss';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  record: Record;
};

const ROOT = 'ts-expenses__form-records__list-items-detail';

const ItemsDetail = ({
  record,
  baseCurrencySymbol,
  baseCurrencyDecimal,
}: Props) => {
  const dateFormatter = (props: { value: string }) =>
    DateUtil.format(props.value, 'L');

  const parentItem = get(record, 'items.0', {});
  const useForeignCurrency = parentItem.useForeignCurrency;

  let symbol = baseCurrencySymbol || '';
  let decimalPlaces = baseCurrencyDecimal;
  let amountKey = 'amount';

  if (useForeignCurrency) {
    symbol = get(parentItem, 'currencyInfo.symbol') || '';
    decimalPlaces = get(parentItem, 'currencyInfo.decimalPlaces', 0);
    amountKey = 'localAmount';
  }

  const formattedAmount = FormatUtil.formatNumber(
    parentItem[amountKey],
    decimalPlaces
  );

  const childItems = drop(record.items);
  const list = (
    <Grid
      data={childItems}
      idKey="itemId"
      columns={[
        {
          name: msg().Exp_Clbl_Date,
          key: 'recordDate',
          width: 120,
          shrink: false,
          grow: false,
          formatter: dateFormatter,
        },
        {
          name: msg().Exp_Clbl_ExpenseType,
          key: 'expTypeName',
          width: 230,
          shrink: false,
          grow: false,
        },
        {
          name: `${msg().Exp_Clbl_Amount}`,
          key: amountKey,
          width: 100,
          extraProps: {
            baseCurrencySymbol: symbol,
            baseCurrencyDecimal: decimalPlaces,
          },
          shrink: false,
          grow: false,
          formatter: Currency,
        },
      ]}
      selected={[]}
      browseId=""
      onClickRow={() => {}}
      onChangeRowSelection={() => {}}
      emptyMessage={TextUtil.template(
        msg().Exp_Msg_RecordItemsMandatory,
        parentItem.expTypeName
      )}
    />
  );

  const sum = (
    <div className={`${ROOT}__sum`}>
      <span className={`${ROOT}__sum-text`}>{msg().Exp_Lbl_TotalAmount}</span>
      <span
        className={`${ROOT}__sum-number`}
      >{`${symbol} ${formattedAmount}`}</span>
    </div>
  );

  return (
    <div className={ROOT}>
      {list}
      {childItems.length > 0 && sum}
    </div>
  );
};

export default ItemsDetail;
