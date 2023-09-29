import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configListTemplate from '../../constants/configList/lateArrivalEarlyLeaveReason';

import { Action, Record } from '../../utils/RecordUtil';

import MainContents from '../../components/MainContents';

type Props = {
  actions: Action;
  companyId: string;
  searchLateArrivalEarlyLeaveReason: Array<Record>;
};

export default class LateArrivalEarlyLeaveReason extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    const param = { companyId: this.props.companyId };
    this.props.actions.getConstantsLateArrivalEarlyLeaveReason();
    this.props.actions.searchLateArrivalEarlyLeaveReason(param);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.companyId !== nextProps.companyId) {
      const param = { companyId: nextProps.companyId };
      this.props.actions.searchLateArrivalEarlyLeaveReason(param);
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
        componentKey="LateArrivalEarlyLeaveReason"
        configList={configList}
        itemList={this.props.searchLateArrivalEarlyLeaveReason}
        {...this.props}
      />
    );
  }
}
