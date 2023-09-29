import React from 'react';

import { cloneDeep } from 'lodash';

import configList from '../../constants/configList/group';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  searchGroup: Array<Record>;
  companyId: string;
};

export default class Group extends React.Component<Props> {
  componentDidMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchReportType({ ...param, active: true });
    this.props.actions.search(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.search(param);
      this.props.actions.searchReportType({ ...param, active: true });
    }
  }

  render() {
    const configListGroup = cloneDeep(configList);
    configListGroup.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="Group"
        configList={configListGroup}
        itemList={this.props.searchGroup}
        showCloneButton
        {...this.props}
      />
    );
  }
}
