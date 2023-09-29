import React from 'react';

import IconButton from '@commons/components/exp/Icon/IconButton';

import { IcTransactionWithCardNo } from '../../../../../../domain/models/exp/TransportICCard';

import CurrencyUtil from '../../../../../utils/CurrencyUtil';
import DateUtil from '../../../../../utils/DateUtil';

import msg from '../../../../../languages';
import Grid from '../../../../Grid';

const ROOT = 'ts-expenses-modal-ic-card-transaction__table';

export type transactionWithDisplayInfo = IcTransactionWithCardNo & {
  cardName: string;
  detailDisplay: string;
};

export type TableProps = {
  baseCurrencySymbol: string;
};

type HideICCardTransaction = (
  cardNo: string,
  icRecordId: string,
  isHidden: boolean
) => void;

type Props = TableProps & {
  filteredTransactions: Array<transactionWithDisplayInfo>;
  hideICCardTransaction: HideICCardTransaction;
  selectedIds?: string[];
  toggleSelection: (arg0: { id: string; checked: boolean } | string) => void;
};

const dateFormatter = (props: { value: string }) =>
  DateUtil.dateFormat(props.value);

const amountFormatter = (props: {
  baseCurrencySymbol: string;
  value: string;
}) => {
  const { baseCurrencySymbol, value } = props;
  const symbol = baseCurrencySymbol ? `${baseCurrencySymbol} ` : '';
  const amountWithComma = CurrencyUtil.convertToCurrency(value);
  return <span className="cell-amount"> {symbol + amountWithComma}</span>;
};

const statusFormatter = (props: {
  data: IcTransactionWithCardNo;
  hideICCardTransaction: HideICCardTransaction;
}) => {
  const { data, hideICCardTransaction } = props;
  const { cardNo, isUsed, isHidden = false, recordId } = data;
  if (isUsed)
    return (
      <div className={`${ROOT}-claimed`}>{msg().Exp_Lbl_TransClaimed}</div>
    );

  const icon = isHidden ? 'hide' : 'preview';
  return (
    <IconButton
      className={`${ROOT}-visible-icon-btn`}
      icon={icon}
      onClick={() => hideICCardTransaction(cardNo, recordId, !isHidden)}
    />
  );
};

const ICCardTable = (props: Props) => {
  return (
    <div className={ROOT}>
      <Grid
        data={props.filteredTransactions}
        idKey="recordId"
        columns={[
          {
            name: msg().Exp_Lbl_CardName,
            key: 'cardName',
            width: 130,
          },
          {
            name: msg().Exp_Lbl_Date,
            key: 'paymentDate',
            width: 120,
            formatter: dateFormatter,
          },
          {
            name: msg().Exp_Lbl_Amount,
            key: 'amount',
            width: 110,
            extraProps: {
              baseCurrencySymbol: props.baseCurrencySymbol,
            },
            formatter: amountFormatter,
          },
          {
            name: msg().Exp_Lbl_Detail,
            key: 'detailDisplay',
            width: 360,
          },
          {
            name: '',
            key: 'visible',
            width: 95,
            extraProps: {
              hideICCardTransaction: props.hideICCardTransaction,
            },
            formatter: statusFormatter,
          },
        ]}
        selected={props.selectedIds}
        browseId=""
        onClickRow={() => {}}
        onChangeRowSelection={props.toggleSelection}
        emptyMessage={msg().Cmn_Lbl_SuggestNoResult}
      />
    </div>
  );
};

export default ICCardTable;
