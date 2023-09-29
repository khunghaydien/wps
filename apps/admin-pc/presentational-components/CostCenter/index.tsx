import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/costCenter';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchCostCenter: Array<Record>;
};

export default class CostCenter extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchCostCenter(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchCostCenter(param);
      this.props.actions.resetCostCenterSelect();
    }
  }

  render() {
    const configListCostCenter = _.cloneDeep(configList);
    configListCostCenter.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="costCenter"
        configList={configListCostCenter}
        itemList={this.props.searchCostCenter}
        showCloneButton
        {...this.props}
      />
    );
  }
}
