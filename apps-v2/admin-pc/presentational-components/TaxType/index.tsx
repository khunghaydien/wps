import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/taxType';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  searchTaxType: Array<Record>;
  companyId: string;
};

export default class TaxType extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchTaxType(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchTaxType(param);
      this.props.actions.searchExpTypeGroup(param);
    }
  }

  render() {
    const configList = _.cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="taxType"
        configList={configList}
        itemList={this.props.searchTaxType}
        showCloneButton
        {...this.props}
      />
    );
  }
}
