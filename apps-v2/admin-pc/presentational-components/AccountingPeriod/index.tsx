import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/accountingPeriod';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  searchAccountingPeriod: Array<Record>;
  companyId: string;
};

export default class AccountingPeriod extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchAccountingPeriod(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchAccountingPeriod(param);
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
      if (config.key === 'active') {
        config.defaultValue = false;
      }
    });

    return (
      <MainContents
        componentKey="accountingPeriod"
        configList={configList}
        itemList={this.props.searchAccountingPeriod}
        showCloneButton
        {...this.props}
      />
    );
  }
}
