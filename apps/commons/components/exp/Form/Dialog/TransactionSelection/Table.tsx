import React from 'react';

import {
  Transaction,
  TransactionList,
} from '../../../../../../domain/models/exp/CreditCard';

import CurrencyUtil from '../../../../../utils/CurrencyUtil';
import DateUtil from '../../../../../utils/DateUtil';

import msg from '../../../../../languages';
import Grid from '../../../../Grid';
import Tooltip from '../../../../Tooltip';

const ROOT = 'ts-expenses-modal-transaction-selection__table';

export type TableProps = {
  baseCurrencySymbol: string;
};

type Props = TableProps & {
  selectedId?: string;
  transactions: TransactionList;
  toggleSelection: (arg0: { id: string; checked: boolean }) => void;
};

const dateFormatter = (props: { value: string }) =>
  DateUtil.format(props.value, 'L');

const amountFormatter = (props: {
  baseCurrencySymbol: string;
  value: string;
}) => {
  const { baseCurrencySymbol, value } = props;
  const symbol = baseCurrencySymbol ? `${baseCurrencySymbol} ` : '';
  const amountWithComma = CurrencyUtil.convertToCurrency(value);
  return (
    <span className={`${ROOT}-cell-amount`}>{symbol + amountWithComma}</span>
  );
};

const cardNameFormatter = (props: { data: Transaction; value: string }) => {
  const { data, value } = props;
  const tooltipContent = (
    <>
      {data.cardAssociation} **** {data.cardNumber}
      <br />
      {data.reimbursementFlag && <b>{msg().Exp_Lbl_ReimbursementTooltip}</b>}
    </>
  );
  return (
    <Tooltip align="top left" content={tooltipContent}>
      <div className={`${ROOT}__cell-inner`}>{value}</div>
    </Tooltip>
  );
};

const Table = (props: Props) => {
  return (
    <div className={ROOT}>
      <Grid
        data={props.transactions}
        idKey="id"
        columns={[
          {
            name: msg().Exp_Lbl_TransactionDate,
            key: 'transactionDate',
            width: 130,
            shrink: false,
            grow: false,
            formatter: dateFormatter,
          },
          {
            name: msg().Exp_Lbl_VendorName,
            key: 'merchantName',
            width: 150,
            shrink: false,
            grow: false,
          },
          {
            name: msg().Exp_Lbl_Amount,
            key: 'amount',
            width: 140,
            shrink: false,
            grow: false,
            extraProps: {
              baseCurrencySymbol: props.baseCurrencySymbol,
            },
            formatter: amountFormatter,
          },
          {
            name: msg().Exp_Lbl_CardName,
            key: 'cardNameL',
            width: 150,
            shrink: false,
            grow: false,
            formatter: cardNameFormatter,
          },
          {
            name: msg().Exp_Lbl_Description,
            key: 'transactionDescription',
            width: 300,
            shrink: false,
            grow: false,
          },
        ]}
        showCheckBox
        selected={props.selectedId ? [props.selectedId] : []}
        browseId=""
        onClickRow={() => {}}
        onChangeRowSelection={props.toggleSelection}
        emptyMessage={msg().Cmn_Lbl_SuggestNoResult}
      />
    </div>
  );
};

export default Table;
