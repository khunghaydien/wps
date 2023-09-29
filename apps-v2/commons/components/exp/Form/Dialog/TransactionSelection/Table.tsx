import React from 'react';

import IconButton from '@commons/components/exp/Icon/IconButton';

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
  handleToggleHide: (id: string, isHidden: boolean) => void;
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
  const toggleHide = (id: string, toHide: boolean) => () => {
    props.handleToggleHide(id, toHide);
  };

  const labelFomatter = (props: { data: Transaction }) => {
    const { isUsed, isHidden, id } = props.data;
    const icon = isHidden ? 'hide' : 'preview';
    const eyeIcon = (
      <IconButton
        icon={icon}
        className={`${ROOT}__eye-icon`}
        size="large"
        onClick={toggleHide(id, !isHidden)}
      />
    );
    const label = isUsed ? (
      <div className={`${ROOT}-cell-claimed`}>{msg().Exp_Lbl_TransClaimed}</div>
    ) : (
      eyeIcon
    );

    return label;
  };

  const data = props.transactions.map((trans) => {
    return { ...trans, showCheckbox: !trans.isUsed };
  });

  return (
    <div className={ROOT}>
      <Grid
        data={data}
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
            width: 100,
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
            width: 200,
            shrink: false,
            grow: false,
          },
          {
            name: '',
            key: 'isUsed',
            width: 150,
            shrink: false,
            grow: false,
            formatter: labelFomatter,
          },
        ]}
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
