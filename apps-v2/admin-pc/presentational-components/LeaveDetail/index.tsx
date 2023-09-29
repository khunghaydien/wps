import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/leaveDetail';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchLeaveDetail: Array<Record>;
};

export default class LeaveDetail extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsLeaveDetail();
    this.props.actions.searchLeaveDetail(param);
    this.props.actions.searchLeave(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchLeaveDetail(param);
      this.props.actions.searchLeave(param);
    }
  }

  render() {
    const configList = cloneDeep(configListTemplate);
    configList.base.forEach((config) => {
      if (config.key === 'companyId') {
        config.defaultValue = this.props.companyId;
      }
    });

    return (
      <MainContents
        componentKey="LeaveDetail"
        configList={configList}
        itemList={this.props.searchLeaveDetail}
        {...this.props}
      />
    );
  }
}
