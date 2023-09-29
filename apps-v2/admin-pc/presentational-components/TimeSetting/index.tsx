import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/timeSetting';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchTimeSetting: Array<Record>;
};

export default class Department extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchTimeSetting(param);
    this.props.actions.getConstantsTimeSetting();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchTimeSetting(param);
    }
  }

  render() {
    const configListTimeSetting = _.cloneDeep(configList);
    configListTimeSetting.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="TimeSetting"
        configList={configListTimeSetting}
        itemList={this.props.searchTimeSetting}
        {...this.props}
      />
    );
  }
}
