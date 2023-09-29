import React from 'react';

import msg from '../../../../commons/languages';

import { ExchangeRate } from '../../../models/exchange-rate/ExchangeRate';

import ListPaneHeader from '../../../components/MainContents/ListPaneHeader';

import ExchangeRateList from './ExchangeRateList';

const ROOT = 'admin-pc-contents-list-pane';

type Props = {
  exchangeRateList: ExchangeRate[];
  selectedRecordId: string | null | undefined;
  onSelectExchangeRate: (arg0: any) => void;
  onClickCreateNewButton: () => void;
};

export default class ListPane extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <ListPaneHeader
          title={msg().Exp_Lbl_ExchangeRate}
          onClickCreateNewButton={this.props.onClickCreateNewButton}
        />

        <div className={`${ROOT}__react-data-grid-wrapper`}>
          {this.props.exchangeRateList.length > 0 && (
            <div className={`${ROOT}__react-data-grid`}>
              <ExchangeRateList
                exchangeRateList={this.props.exchangeRateList}
                selectedId={this.props.selectedRecordId}
                onListRowClick={this.props.onSelectExchangeRate}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
