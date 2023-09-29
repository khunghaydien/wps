import React from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/department';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchDepartment: Array<Record>;
};

export default class Department extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.searchDepartment(param);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchDepartment(param);
    }
  }

  render() {
    const configListDepartment = _.cloneDeep(configList);
    configListDepartment.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="department"
        configList={configListDepartment}
        itemList={this.props.searchDepartment}
        {...this.props}
      />
    );
  }
}
