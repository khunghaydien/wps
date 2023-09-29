import React from 'react';

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

type Props = TableProps & {
  filteredTransactions: Array<transactionWithDisplayInfo>;
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
            width: 130,
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
        ]}
        showCheckBox
        selected={props.selectedIds}
        browseId=""
        onClickRow={props.toggleSelection}
        onChangeRowSelection={props.toggleSelection}
        emptyMessage={msg().Cmn_Lbl_SuggestNoResult}
      />
    </div>
  );
};

export default ICCardTable;
