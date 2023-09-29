import React from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/leaveOfAbsence';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  itemList: Array<Record>;
};

export default class LeaveOfAbsence extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsLeaveOfAbsence();
    this.props.actions.search(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.search(param);
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
        componentKey="LeaveOfAbsence"
        configList={configList}
        itemList={this.props.itemList}
        {...this.props}
      />
    );
  }
}
