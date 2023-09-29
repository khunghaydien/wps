import React from 'react';

import configList from '../../constants/configList/countryDefaultTaxType';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

export type Props = {
  actions: Action;
  searchtaxtype: Array<Record>;
};

export default class CountryDefaultTaxType extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.actions.searchTaxType();
    this.props.actions.searchCountry();
  }

  render() {
    return (
      <MainContents
        componentKey="countryDefaultTaxType"
        configList={configList}
        itemList={this.props.actions.searchTaxType}
        {...this.props}
      />
    );
  }
}
