import React from 'react';

import configList from '../../constants/configList/currency';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

export type Props = {
  actions: Action;
  searchCurrency: Array<Record>;
  searchIsoCurrencyCode: Array<Record>;
};
export default class Currency extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.actions.searchCurrency();
    this.props.actions.searchIsoCurrencyCode();
  }

  render() {
    return (
      <MainContents
        componentKey="currency"
        configList={configList}
        itemList={this.props.searchCurrency}
        {...this.props}
      />
    );
  }
}
