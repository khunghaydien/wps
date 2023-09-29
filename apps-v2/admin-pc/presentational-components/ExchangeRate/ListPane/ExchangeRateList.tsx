import React from 'react';

import _ from 'lodash';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { ExchangeRate } from '../../../models/exchange-rate/ExchangeRate';

import DataGrid from '../../../components/DataGrid';

export type Props = {
  exchangeRateList: ExchangeRate[];
  selectedId: string | null | undefined;
  onListRowClick: (arg0: ExchangeRate) => void;
};

export default class ExchangeRateList extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onListRowClick = this.onListRowClick.bind(this);
  }

  onListRowClick(index: number, exchangeRate: ExchangeRate): void {
    this.props.onListRowClick(exchangeRate);
  }

  render() {
    const columnProps = {
      resizable: true,
      filterable: true,
      sortable: true,
    };

    const recordList = _.cloneDeep(this.props.exchangeRateList);

    return (
      <DataGrid
        columns={[
          {
            key: 'code',
            name: msg().Admin_Lbl_Code,
            ...columnProps,
          },
          {
            key: 'currencyCode',
            name: msg().Admin_Lbl_CurrencyCode,
            ...columnProps,
          },
          {
            key: 'currencyPairLabel',
            name: msg().Admin_Lbl_CurrencyPair,
            ...columnProps,
          },
          {
            key: 'rate',
            name: msg().Exp_Lbl_ExchangeRate,
            ...columnProps,
          },
          {
            key: 'validDateFrom',
            name: msg().Admin_Lbl_ValidDateFrom,
            ...columnProps,
          },
          {
            key: 'validDateTo',
            name: msg().Admin_Lbl_ValidDateTo,
            ...columnProps,
          },
        ]}
        rows={recordList.map((rec) => ({
          ...rec,
          validDateFrom: DateUtil.dateFormat(rec.validDateFrom),
          validDateTo: DateUtil.dateFormat(rec.validDateTo),
          isSelected: this.props.selectedId === rec.id,
        }))}
        onRowClick={this.onListRowClick}
      />
    );
  }
}
