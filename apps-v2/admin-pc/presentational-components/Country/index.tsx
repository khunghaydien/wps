import React from 'react';

import configList from '../../constants/configList/country';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

export type Props = {
  actions: Action;
  searchCountry: Array<Record>;
};

export default class Country extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.actions.searchCountry();
  }

  render() {
    return (
      <MainContents
        componentKey="country"
        configList={configList}
        itemList={this.props.searchCountry}
        {...this.props}
      />
    );
  }
}
